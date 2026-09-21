package com.collabcode.workspace.controller;

import com.collabcode.workspace.dto.InviteDto;
import com.collabcode.workspace.dto.WorkspaceDto;
import com.collabcode.workspace.service.WorkspaceInviteService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invites")
public class InviteController {

    private final WorkspaceInviteService inviteService;

    public InviteController(WorkspaceInviteService inviteService) {
        this.inviteService = inviteService;
    }

    @GetMapping("/{token}")
    public ResponseEntity<InviteDto> getInvite(@PathVariable String token, HttpServletRequest servletRequest) {
        String baseUrl = servletRequest.getHeader("Origin");
        if (baseUrl == null || baseUrl.isBlank()) {
            baseUrl = "http://" + servletRequest.getServerName() + (servletRequest.getServerPort() != 80 ? ":" + servletRequest.getServerPort() : "");
        }
        return ResponseEntity.ok(inviteService.getInvite(token, baseUrl));
    }

    @PostMapping("/{token}/accept")
    public ResponseEntity<WorkspaceDto> acceptInvite(@AuthenticationPrincipal String userId,
                                                     @PathVariable String token) {
        return ResponseEntity.ok(inviteService.acceptInvite(userId, token));
    }
}
