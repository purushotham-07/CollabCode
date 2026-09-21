package com.collabcode.workspace.dto;

import com.collabcode.workspace.model.WorkspaceRole;

import java.time.Instant;

public record InviteDto(
    String id,
    String workspaceId,
    String workspaceName,
    WorkspaceRole role,
    String token,
    String inviteUrl,
    Instant expiresAt,
    int maxUses,
    int usedCount,
    Instant createdAt
) {}
