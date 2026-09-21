package com.collabcode.workspace.controller;

import com.collabcode.workspace.dto.*;
import com.collabcode.workspace.service.WorkspaceInviteService;
import com.collabcode.workspace.service.WorkspaceService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {

    private final WorkspaceService workspaceService;
    private final WorkspaceInviteService inviteService;

    public WorkspaceController(WorkspaceService workspaceService, WorkspaceInviteService inviteService) {
        this.workspaceService = workspaceService;
        this.inviteService = inviteService;
    }

    @PostMapping
    public ResponseEntity<WorkspaceDto> createWorkspace(@AuthenticationPrincipal String userId,
                                                        @Valid @RequestBody CreateWorkspaceRequest request) {
        WorkspaceDto workspace = workspaceService.createWorkspace(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(workspace);
    }

    @GetMapping
    public ResponseEntity<List<WorkspaceSummaryDto>> getWorkspaces(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(workspaceService.getUserWorkspaces(userId));
    }

    @GetMapping("/{workspaceId}")
    public ResponseEntity<WorkspaceDto> getWorkspace(@AuthenticationPrincipal String userId,
                                                     @PathVariable String workspaceId) {
        return ResponseEntity.ok(workspaceService.getWorkspace(userId, workspaceId));
    }

    @PatchMapping("/{workspaceId}/members/{targetUserId}")
    public ResponseEntity<WorkspaceDto> updateMemberRole(@AuthenticationPrincipal String currentUserId,
                                                         @PathVariable String workspaceId,
                                                         @PathVariable String targetUserId,
                                                         @Valid @RequestBody UpdateMemberRoleRequest request) {
        return ResponseEntity.ok(workspaceService.updateMemberRole(currentUserId, workspaceId, targetUserId, request.role()));
    }

    @DeleteMapping("/{workspaceId}/members/{targetUserId}")
    public ResponseEntity<Map<String, String>> removeMember(@AuthenticationPrincipal String currentUserId,
                                                            @PathVariable String workspaceId,
                                                            @PathVariable String targetUserId) {
        workspaceService.removeMember(currentUserId, workspaceId, targetUserId);
        return ResponseEntity.ok(Map.of("message", "Member removed successfully"));
    }

    @DeleteMapping("/{workspaceId}")
    public ResponseEntity<Map<String, String>> deleteWorkspace(@AuthenticationPrincipal String currentUserId,
                                                               @PathVariable String workspaceId) {
        workspaceService.deleteWorkspace(currentUserId, workspaceId);
        return ResponseEntity.ok(Map.of("message", "Workspace deleted successfully"));
    }

    @PostMapping("/{workspaceId}/invites")
    public ResponseEntity<InviteDto> createInvite(@AuthenticationPrincipal String currentUserId,
                                                  @PathVariable String workspaceId,
                                                  @Valid @RequestBody CreateInviteRequest request,
                                                  HttpServletRequest servletRequest) {
        String baseUrl = servletRequest.getHeader("Origin");
        if (baseUrl == null || baseUrl.isBlank()) {
            baseUrl = "http://" + servletRequest.getServerName() + (servletRequest.getServerPort() != 80 ? ":" + servletRequest.getServerPort() : "");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(inviteService.createInvite(currentUserId, workspaceId, request, baseUrl));
    }
}
