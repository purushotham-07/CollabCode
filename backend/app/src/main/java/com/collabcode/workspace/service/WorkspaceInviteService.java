package com.collabcode.workspace.service;

import com.collabcode.common.exception.AppException;
import com.collabcode.workspace.dto.CreateInviteRequest;
import com.collabcode.workspace.dto.InviteDto;
import com.collabcode.workspace.dto.WorkspaceDto;
import com.collabcode.workspace.model.Workspace;
import com.collabcode.workspace.model.WorkspaceInvite;
import com.collabcode.workspace.model.WorkspaceRole;
import com.collabcode.workspace.repository.WorkspaceInviteRepository;
import com.collabcode.workspace.repository.WorkspaceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class WorkspaceInviteService {

    private final WorkspaceInviteRepository inviteRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceService workspaceService;

    public WorkspaceInviteService(WorkspaceInviteRepository inviteRepository,
                                  WorkspaceRepository workspaceRepository,
                                  WorkspaceService workspaceService) {
        this.inviteRepository = inviteRepository;
        this.workspaceRepository = workspaceRepository;
        this.workspaceService = workspaceService;
    }

    @Transactional
    public InviteDto createInvite(String userId, String workspaceId, CreateInviteRequest request, String baseUrl) {
        Workspace workspace = workspaceService.getWorkspaceAndRequireRole(userId, workspaceId, WorkspaceRole.EDITOR);

        // Viewers cannot create invites; editors can create editor/viewer invites; owners can create any
        Instant expiresAt = Instant.now().plus(request.expiresInHours(), ChronoUnit.HOURS);
        WorkspaceInvite invite = new WorkspaceInvite(
                workspaceId,
                request.role(),
                expiresAt,
                request.maxUses(),
                userId
        );

        invite = inviteRepository.save(invite);
        return toInviteDto(invite, workspace.getName(), baseUrl);
    }

    public InviteDto getInvite(String token, String baseUrl) {
        WorkspaceInvite invite = inviteRepository.findByToken(token)
                .orElseThrow(() -> new AppException("Invitation link is invalid or has expired", HttpStatus.NOT_FOUND));

        if (!invite.isValid()) {
            throw new AppException("This invitation link has expired or reached its maximum usage limit", HttpStatus.GONE);
        }

        Workspace workspace = workspaceRepository.findById(invite.getWorkspaceId())
                .orElseThrow(() -> new AppException("Workspace associated with this invite no longer exists", HttpStatus.NOT_FOUND));

        return toInviteDto(invite, workspace.getName(), baseUrl);
    }

    @Transactional
    public WorkspaceDto acceptInvite(String userId, String token) {
        WorkspaceInvite invite = inviteRepository.findByToken(token)
                .orElseThrow(() -> new AppException("Invitation link is invalid or has expired", HttpStatus.NOT_FOUND));

        if (!invite.isValid()) {
            throw new AppException("This invitation link has expired or reached its maximum usage limit", HttpStatus.GONE);
        }

        Workspace workspace = workspaceRepository.findById(invite.getWorkspaceId())
                .orElseThrow(() -> new AppException("Workspace no longer exists", HttpStatus.NOT_FOUND));

        if (workspace.hasMember(userId)) {
            // User is already a member - upgrade role if invite offers higher permission
            WorkspaceRole currentRole = workspace.getMemberRole(userId).orElse(WorkspaceRole.VIEWER);
            if (invite.getRole().hasPermission(currentRole)) {
                workspace.addOrUpdateMember(userId, invite.getRole());
                workspace = workspaceRepository.save(workspace);
            }
        } else {
            workspace.addOrUpdateMember(userId, invite.getRole());
            workspace = workspaceRepository.save(workspace);
        }

        invite.incrementUses();
        inviteRepository.save(invite);

        return workspaceService.toWorkspaceDto(workspace, userId);
    }

    private InviteDto toInviteDto(WorkspaceInvite invite, String workspaceName, String baseUrl) {
        String base = (baseUrl != null && !baseUrl.isBlank()) ? baseUrl : "http://localhost";
        String inviteUrl = base + "/invite/" + invite.getToken();

        return new InviteDto(
                invite.getId(),
                invite.getWorkspaceId(),
                workspaceName,
                invite.getRole(),
                invite.getToken(),
                inviteUrl,
                invite.getExpiresAt(),
                invite.getMaxUses(),
                invite.getUsedCount(),
                invite.getCreatedAt()
        );
    }
}
