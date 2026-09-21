package com.collabcode.workspace.service;

import com.collabcode.auth.model.User;
import com.collabcode.auth.repository.UserRepository;
import com.collabcode.common.exception.AppException;
import com.collabcode.workspace.dto.*;
import com.collabcode.workspace.model.*;
import com.collabcode.workspace.repository.FileNodeRepository;
import com.collabcode.workspace.repository.WorkspaceInviteRepository;
import com.collabcode.workspace.repository.WorkspaceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;
    private final FileNodeRepository fileNodeRepository;
    private final WorkspaceInviteRepository workspaceInviteRepository;

    public WorkspaceService(WorkspaceRepository workspaceRepository,
                            UserRepository userRepository,
                            FileNodeRepository fileNodeRepository,
                            WorkspaceInviteRepository workspaceInviteRepository) {
        this.workspaceRepository = workspaceRepository;
        this.userRepository = userRepository;
        this.fileNodeRepository = fileNodeRepository;
        this.workspaceInviteRepository = workspaceInviteRepository;
    }

    @Transactional
    public WorkspaceDto createWorkspace(String userId, CreateWorkspaceRequest request) {
        String name = request.name().trim();
        Workspace workspace = new Workspace(name, userId);
        workspace = workspaceRepository.save(workspace);

        // Seed initial project files for a seamless developer experience
        seedInitialFiles(workspace.getId());

        return toWorkspaceDto(workspace, userId);
    }

    public List<WorkspaceSummaryDto> getUserWorkspaces(String userId) {
        List<Workspace> memberWorkspaces = workspaceRepository.findByMemberUserId(userId);
        return memberWorkspaces.stream()
                .map(ws -> {
                    WorkspaceRole myRole = ws.getMemberRole(userId).orElse(WorkspaceRole.VIEWER);
                    int count = ws.getMembers() != null ? ws.getMembers().size() : 1;
                    return new WorkspaceSummaryDto(
                            ws.getId(),
                            ws.getName(),
                            ws.getOwnerId(),
                            count,
                            myRole,
                            ws.getCreatedAt(),
                            ws.getUpdatedAt()
                    );
                })
                .sorted(Comparator.comparing(WorkspaceSummaryDto::updatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    public WorkspaceDto getWorkspace(String userId, String workspaceId) {
        Workspace workspace = getWorkspaceAndRequireRole(userId, workspaceId, WorkspaceRole.VIEWER);
        return toWorkspaceDto(workspace, userId);
    }

    public Workspace getWorkspaceAndRequireRole(String userId, String workspaceId, WorkspaceRole requiredRole) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new AppException("Workspace not found", HttpStatus.NOT_FOUND));

        WorkspaceRole role = workspace.getMemberRole(userId)
                .orElseThrow(() -> new AppException("You do not have access to this workspace", HttpStatus.FORBIDDEN));

        if (!role.hasPermission(requiredRole)) {
            throw new AppException(
                    String.format("Action requires %s role, but your role is %s", requiredRole, role),
                    HttpStatus.FORBIDDEN
            );
        }

        return workspace;
    }

    @Transactional
    public WorkspaceDto updateMemberRole(String currentUserId, String workspaceId, String targetUserId, WorkspaceRole newRole) {
        Workspace workspace = getWorkspaceAndRequireRole(currentUserId, workspaceId, WorkspaceRole.OWNER);

        if (workspace.isOwner(targetUserId)) {
            throw new AppException("Cannot change the role of the workspace owner", HttpStatus.BAD_REQUEST);
        }

        if (!workspace.hasMember(targetUserId)) {
            throw new AppException("User is not a member of this workspace", HttpStatus.NOT_FOUND);
        }

        workspace.addOrUpdateMember(targetUserId, newRole);
        workspace = workspaceRepository.save(workspace);

        return toWorkspaceDto(workspace, currentUserId);
    }

    @Transactional
    public void removeMember(String currentUserId, String workspaceId, String targetUserId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new AppException("Workspace not found", HttpStatus.NOT_FOUND));

        boolean isSelf = currentUserId.equals(targetUserId);
        boolean isOwner = workspace.isOwner(currentUserId);

        if (!isSelf && !isOwner) {
            throw new AppException("Only the workspace owner can remove members", HttpStatus.FORBIDDEN);
        }

        if (workspace.isOwner(targetUserId)) {
            throw new AppException("The workspace owner cannot be removed", HttpStatus.BAD_REQUEST);
        }

        boolean removed = workspace.removeMember(targetUserId);
        if (!removed) {
            throw new AppException("User is not a member of this workspace", HttpStatus.NOT_FOUND);
        }

        workspaceRepository.save(workspace);
    }

    @Transactional
    public void deleteWorkspace(String currentUserId, String workspaceId) {
        Workspace workspace = getWorkspaceAndRequireRole(currentUserId, workspaceId, WorkspaceRole.OWNER);
        
        fileNodeRepository.deleteByWorkspaceId(workspaceId);
        workspaceInviteRepository.deleteByWorkspaceId(workspaceId);
        workspaceRepository.delete(workspace);
    }

    public WorkspaceDto toWorkspaceDto(Workspace workspace, String currentUserId) {
        WorkspaceRole myRole = workspace.getMemberRole(currentUserId).orElse(WorkspaceRole.VIEWER);

        List<String> memberUserIds = workspace.getMembers().stream()
                .map(WorkspaceMember::getUserId)
                .toList();

        Map<String, User> userMap = userRepository.findAllById(memberUserIds).stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        List<WorkspaceMemberDto> memberDtos = workspace.getMembers().stream()
                .map(m -> {
                    User u = userMap.get(m.getUserId());
                    String name = u != null ? u.getDisplayName() : "Collaborator";
                    String email = u != null ? u.getEmail() : "";
                    String avatar = u != null ? u.getAvatarUrl() : null;
                    return new WorkspaceMemberDto(m.getUserId(), name, email, avatar, m.getRole(), m.getJoinedAt());
                })
                .toList();

        return new WorkspaceDto(
                workspace.getId(),
                workspace.getName(),
                workspace.getOwnerId(),
                memberDtos,
                myRole,
                workspace.getCreatedAt(),
                workspace.getUpdatedAt()
        );
    }

    private void seedInitialFiles(String workspaceId) {
        FileNode readme = new FileNode(
                workspaceId,
                "README.md",
                false,
                "# Welcome to CollabCode Workspace\n\nEdit this file collaboratively with sub-millisecond CRDT sync!\n"
        );
        FileNode srcDir = new FileNode(workspaceId, "src", true, null);
        FileNode indexJs = new FileNode(
                workspaceId,
                "src/index.js",
                false,
                "// Real-time collaborative code editor\nconsole.log('Hello from CollabCode!');\n"
        );

        fileNodeRepository.saveAll(List.of(readme, srcDir, indexJs));
    }
}
