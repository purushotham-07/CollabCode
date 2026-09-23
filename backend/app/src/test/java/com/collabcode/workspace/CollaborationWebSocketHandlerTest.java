package com.collabcode.workspace;

import com.collabcode.workspace.repository.FileNodeRepository;
import com.collabcode.workspace.websocket.CollaborationWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CollaborationWebSocketHandlerTest {

    private CollaborationWebSocketHandler handler;
    private ObjectMapper objectMapper;

    @Mock
    private FileNodeRepository fileNodeRepository;

    @Mock
    private WebSocketSession session1;

    @Mock
    private WebSocketSession session2;

    private Map<String, Object> attributes1;
    private Map<String, Object> attributes2;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        handler = new CollaborationWebSocketHandler(objectMapper, fileNodeRepository);
        attributes1 = new HashMap<>();
        attributes2 = new HashMap<>();

        lenient().when(session1.getId()).thenReturn("session-1");
        lenient().when(session1.getAttributes()).thenReturn(attributes1);
        lenient().when(session1.isOpen()).thenReturn(true);

        lenient().when(session2.getId()).thenReturn("session-2");
        lenient().when(session2.getAttributes()).thenReturn(attributes2);
        lenient().when(session2.isOpen()).thenReturn(true);
    }

    @Test
    @DisplayName("Users can connect to same workspace and broadcast code changes")
    void testCodeChangeBroadcast() throws Exception {
        when(session1.getUri()).thenReturn(URI.create("ws://localhost/ws?workspaceId=ws-1&userId=u1&userName=Alice"));
        when(session2.getUri()).thenReturn(URI.create("ws://localhost/ws?workspaceId=ws-1&userId=u2&userName=Bob"));

        handler.afterConnectionEstablished(session1);
        handler.afterConnectionEstablished(session2);

        // Session 1 sends CODE_CHANGE
        String codeChangeJson = objectMapper.writeValueAsString(Map.of(
                "type", "CODE_CHANGE",
                "workspaceId", "ws-1",
                "fileId", "file-123",
                "content", "console.log('hello world');"
        ));

        handler.handleMessage(session1, new TextMessage(codeChangeJson));

        // Session 2 should have received the broadcast message
        verify(session2, atLeastOnce()).sendMessage(any(TextMessage.class));
    }

    @Test
    @DisplayName("Users can send and broadcast chat messages across workspace")
    void testChatMessageBroadcast() throws Exception {
        when(session1.getUri()).thenReturn(URI.create("ws://localhost/ws?workspaceId=ws-2&userId=u1&userName=Alice"));
        when(session2.getUri()).thenReturn(URI.create("ws://localhost/ws?workspaceId=ws-2&userId=u2&userName=Bob"));

        handler.afterConnectionEstablished(session1);
        handler.afterConnectionEstablished(session2);

        String chatMsgJson = objectMapper.writeValueAsString(Map.of(
                "type", "CHAT_MESSAGE",
                "workspaceId", "ws-2",
                "message", Map.of(
                        "id", "msg-1",
                        "author", "Alice",
                        "text", "Hey Bob!",
                        "time", "12:00"
                )
        ));

        handler.handleMessage(session1, new TextMessage(chatMsgJson));

        // Both sessions should receive the chat message
        verify(session1, atLeastOnce()).sendMessage(any(TextMessage.class));
        verify(session2, atLeastOnce()).sendMessage(any(TextMessage.class));
    }

    @Test
    @DisplayName("Disconnecting leaves workspace cleanly")
    void testDisconnection() throws Exception {
        when(session1.getUri()).thenReturn(URI.create("ws://localhost/ws?workspaceId=ws-3&userId=u1&userName=Alice"));
        handler.afterConnectionEstablished(session1);

        handler.afterConnectionClosed(session1, CloseStatus.NORMAL);
        // Verify no uncaught exceptions
    }
}
