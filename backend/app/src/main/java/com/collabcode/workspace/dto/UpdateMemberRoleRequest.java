package com.collabcode.workspace.dto;

import com.collabcode.workspace.model.WorkspaceRole;
import jakarta.validation.constraints.NotNull;

public record UpdateMemberRoleRequest(
    @NotNull(message = "Role is required")
    WorkspaceRole role
) {}
