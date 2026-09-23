package com.collabcode.workspace.websocket;

import com.collabcode.workspace.model.FileNode;
import com.collabcode.workspace.repository.FileNodeRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;

@Component
public class CollaborationWebSocketHandler extends TextWebSocketHandler {

    private static final Logger log = LoggerFactory.getLogger(CollaborationWebSocketHandler.class);
    private static final int MAX_CHAT_HISTORY = 100;

    private final ObjectMapper objectMapper;
    private final FileNodeRepository fileNodeRepository;
    private final ExecutorService persistenceExecutor = Executors.newFixedThreadPool(2);

    // workspaceId -> Set of active WebSocketSessions
    private final Map<String, Set<WebSocketSession>> workspaceSessions = new ConcurrentHashMap<>();

    // workspaceId -> Map of sessionId -> UserPresence
    private final Map<String, Map<String, UserPresence>> workspaceUsers = new ConcurrentHashMap<>();

    // workspaceId -> List of recent chat messages
    private final Map<String, List<Map<String, Object>>> workspaceChatHistory = new ConcurrentHashMap<>();

    public record UserPresence(String userId, String userName, String avatarUrl, String sessionId) {}

    public CollaborationWebSocketHandler(ObjectMapper objectMapper, FileNodeRepository fileNodeRepository) {
        this.objectMapper = objectMapper;
        this.fileNodeRepository = fileNodeRepository;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("WebSocket connection established: session={}", session.getId());
        Map<String, String> queryParams = parseQueryParams(session.getUri());
        String workspaceId = queryParams.get("workspaceId");
        String userId = queryParams.get("userId");
        String userName = queryParams.getOrDefault("userName", "Anonymous");
        String avatarUrl = queryParams.get("avatarUrl");

        if (workspaceId != null && !workspaceId.isBlank()) {
            joinWorkspace(session, workspaceId, userId, userName, avatarUrl);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            JsonNode root = objectMapper.readTree(message.getPayload());
            String type = root.path("type").asText();

            switch (type) {
                case "JOIN" -> handleJoin(session, root);
                case "CODE_CHANGE" -> handleCodeChange(session, root);
                case "CHAT_MESSAGE" -> handleChatMessage(session, root);
                case "FILE_TREE_CHANGE" -> handleFileTreeChange(session, root);
                case "CURSOR_MOVE" -> handleCursorMove(session, root);
                case "PING" -> sendDirect(session, Map.of("type", "PONG"));
                default -> log.debug("Unknown message type: {}", type);
            }
        } catch (Exception e) {
            log.error("Error processing WebSocket message from session {}: {}", session.getId(), e.getMessage());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info("WebSocket connection closed: session={}, status={}", session.getId(), status);
        leaveWorkspace(session);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.warn("WebSocket transport error for session {}: {}", session.getId(), exception.getMessage());
        leaveWorkspace(session);
    }

    private void handleJoin(WebSocketSession session, JsonNode root) {
        String workspaceId = root.path("workspaceId").asText();
        String userId = root.path("userId").asText(null);
        String userName = root.path("userName").asText("Anonymous");
        String avatarUrl = root.path("avatarUrl").asText(null);

        if (workspaceId != null && !workspaceId.isBlank()) {
            joinWorkspace(session, workspaceId, userId, userName, avatarUrl);
        }
    }

    private void joinWorkspace(WebSocketSession session, String workspaceId, String userId, String userName, String avatarUrl) {
        session.getAttributes().put("workspaceId", workspaceId);
        session.getAttributes().put("userId", userId);
        session.getAttributes().put("userName", userName);
        session.getAttributes().put("avatarUrl", avatarUrl);

        workspaceSessions.computeIfAbsent(workspaceId, k -> ConcurrentHashMap.newKeySet()).add(session);

        UserPresence presence = new UserPresence(
                userId != null ? userId : session.getId(),
                userName,
                avatarUrl,
                session.getId()
        );
        workspaceUsers.computeIfAbsent(workspaceId, k -> new ConcurrentHashMap<>()).put(session.getId(), presence);

        // 1. Send recent chat history to the newly connected session
        List<Map<String, Object>> history = workspaceChatHistory.getOrDefault(workspaceId, Collections.emptyList());
        sendDirect(session, Map.of(
                "type", "CHAT_HISTORY",
                "workspaceId", workspaceId,
                "messages", history
        ));

        // 2. Broadcast updated presence to everyone in the workspace
        broadcastPresence(workspaceId);
    }

    private void handleCodeChange(WebSocketSession session, JsonNode root) {
        String workspaceId = root.path("workspaceId").asText();
        String fileId = root.path("fileId").asText();
        String content = root.path("content").asText("");
        String senderId = (String) session.getAttributes().get("userId");

        if (workspaceId == null || fileId == null) return;

        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "CODE_CHANGE");
        payload.put("workspaceId", workspaceId);
        payload.put("fileId", fileId);
        payload.put("content", content);
        payload.put("senderId", senderId);
        payload.put("senderSessionId", session.getId());

        // Broadcast to other peers immediately
        broadcastToWorkspace(workspaceId, payload, session);

        // Async persist to MongoDB so modifications are never lost
        persistenceExecutor.submit(() -> {
            try {
                fileNodeRepository.findById(fileId).ifPresent(file -> {
                    if (file.getWorkspaceId().equals(workspaceId) && !file.isDirectory()) {
                        file.setContent(content);
                        file.setUpdatedAt(Instant.now());
                        fileNodeRepository.save(file);
                    }
                });
            } catch (Exception e) {
                log.warn("Failed to persist code change for file {}: {}", fileId, e.getMessage());
            }
        });
    }

    private void handleChatMessage(WebSocketSession session, JsonNode root) {
        String workspaceId = root.path("workspaceId").asText();
        JsonNode messageNode = root.path("message");

        if (workspaceId == null || messageNode.isMissingNode()) return;

        Map<String, Object> messageMap = objectMapper.convertValue(messageNode, Map.class);
        String senderId = (String) session.getAttributes().get("userId");
        if (senderId != null && !messageMap.containsKey("senderId")) {
            messageMap.put("senderId", senderId);
        }

        // Store in chat history
        List<Map<String, Object>> history = workspaceChatHistory.computeIfAbsent(workspaceId, k -> new CopyOnWriteArrayList<>());
        history.add(messageMap);
        while (history.size() > MAX_CHAT_HISTORY) {
            history.remove(0);
        }

        Map<String, Object> broadcastPayload = Map.of(
                "type", "CHAT_MESSAGE",
                "workspaceId", workspaceId,
                "message", messageMap
        );

        // Broadcast to ALL users in the workspace (including sender)
        broadcastToWorkspace(workspaceId, broadcastPayload, null);
    }

    private void handleFileTreeChange(WebSocketSession session, JsonNode root) {
        String workspaceId = root.path("workspaceId").asText();
        String action = root.path("action").asText("REFRESH");

        if (workspaceId == null) return;

        Map<String, Object> payload = Map.of(
                "type", "FILE_TREE_CHANGE",
                "workspaceId", workspaceId,
                "action", action
        );

        // Broadcast to other users in the workspace
        broadcastToWorkspace(workspaceId, payload, session);
    }

    private void handleCursorMove(WebSocketSession session, JsonNode root) {
        String workspaceId = root.path("workspaceId").asText();
        String fileId = root.path("fileId").asText();
        JsonNode cursor = root.path("cursor");
        String userId = (String) session.getAttributes().get("userId");
        String userName = (String) session.getAttributes().get("userName");

        if (workspaceId == null || fileId == null) return;

        Map<String, Object> payload = Map.of(
                "type", "CURSOR_MOVE",
                "workspaceId", workspaceId,
                "fileId", fileId,
                "userId", userId != null ? userId : session.getId(),
                "userName", userName != null ? userName : "Anonymous",
                "cursor", cursor
        );

        broadcastToWorkspace(workspaceId, payload, session);
    }

    private void leaveWorkspace(WebSocketSession session) {
        String workspaceId = (String) session.getAttributes().get("workspaceId");
        if (workspaceId == null) return;

        Set<WebSocketSession> sessions = workspaceSessions.get(workspaceId);
        if (sessions != null) {
            sessions.remove(session);
            if (sessions.isEmpty()) {
                workspaceSessions.remove(workspaceId);
            }
        }

        Map<String, UserPresence> users = workspaceUsers.get(workspaceId);
        if (users != null) {
            users.remove(session.getId());
            if (users.isEmpty()) {
                workspaceUsers.remove(workspaceId);
            }
        }

        broadcastPresence(workspaceId);
    }

    private void broadcastPresence(String workspaceId) {
        Map<String, UserPresence> users = workspaceUsers.getOrDefault(workspaceId, Collections.emptyMap());
        // Deduplicate users by userId so same user in multiple tabs appears once
        Map<String, UserPresence> uniqueUsers = new HashMap<>();
        for (UserPresence p : users.values()) {
            uniqueUsers.put(p.userId(), p);
        }

        Map<String, Object> payload = Map.of(
                "type", "PRESENCE_UPDATE",
                "workspaceId", workspaceId,
                "users", new ArrayList<>(uniqueUsers.values())
        );

        broadcastToWorkspace(workspaceId, payload, null);
    }

    private void broadcastToWorkspace(String workspaceId, Map<String, Object> payload, WebSocketSession excludeSession) {
        Set<WebSocketSession> sessions = workspaceSessions.get(workspaceId);
        if (sessions == null || sessions.isEmpty()) return;

        try {
            String json = objectMapper.writeValueAsString(payload);
            TextMessage message = new TextMessage(json);

            for (WebSocketSession s : sessions) {
                if (excludeSession != null && s.getId().equals(excludeSession.getId())) {
                    continue;
                }
                if (s.isOpen()) {
                    synchronized (s) {
                        try {
                            s.sendMessage(message);
                        } catch (IOException e) {
                            log.warn("Failed to send message to session {}: {}", s.getId(), e.getMessage());
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to serialize or broadcast message for workspace {}: {}", workspaceId, e.getMessage());
        }
    }

    private void sendDirect(WebSocketSession session, Map<String, Object> payload) {
        if (!session.isOpen()) return;
        try {
            String json = objectMapper.writeValueAsString(payload);
            synchronized (session) {
                session.sendMessage(new TextMessage(json));
            }
        } catch (Exception e) {
            log.warn("Failed to send direct message to session {}: {}", session.getId(), e.getMessage());
        }
    }

    private Map<String, String> parseQueryParams(URI uri) {
        Map<String, String> queryPairs = new HashMap<>();
        if (uri == null || uri.getQuery() == null) return queryPairs;

        String query = uri.getQuery();
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            if (idx > 0) {
                String key = URLDecoder.decode(pair.substring(0, idx), StandardCharsets.UTF_8);
                String value = URLDecoder.decode(pair.substring(idx + 1), StandardCharsets.UTF_8);
                queryPairs.put(key, value);
            }
        }
        return queryPairs;
    }
}
