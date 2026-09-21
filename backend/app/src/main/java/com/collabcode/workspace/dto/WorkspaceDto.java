package com.collabcode.workspace.dto;

import com.collabcode.workspace.model.WorkspaceRole;

import java.time.Instant;
import java.util.List;

public record WorkspaceDto(
    String id,
    String name,
    String ownerId,
    List<WorkspaceMemberDto> members,
    WorkspaceRole myRole,
    Instant createdAt,
    Instant updatedAt
) {}
