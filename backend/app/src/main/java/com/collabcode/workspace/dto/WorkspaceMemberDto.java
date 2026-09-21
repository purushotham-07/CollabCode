package com.collabcode.workspace.dto;

import com.collabcode.workspace.model.WorkspaceRole;

import java.time.Instant;

public record WorkspaceMemberDto(
    String userId,
    String displayName,
    String email,
    String avatarUrl,
    WorkspaceRole role,
    Instant joinedAt
) {}
