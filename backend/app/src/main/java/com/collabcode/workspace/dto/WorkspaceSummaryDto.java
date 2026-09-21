package com.collabcode.workspace.dto;

import com.collabcode.workspace.model.WorkspaceRole;

import java.time.Instant;

public record WorkspaceSummaryDto(
    String id,
    String name,
    String ownerId,
    int memberCount,
    WorkspaceRole myRole,
    Instant createdAt,
    Instant updatedAt
) {}
