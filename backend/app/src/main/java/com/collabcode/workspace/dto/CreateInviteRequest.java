package com.collabcode.workspace.dto;

import com.collabcode.workspace.model.WorkspaceRole;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CreateInviteRequest(
    @NotNull(message = "Invite role is required")
    WorkspaceRole role,

    @Min(value = 1, message = "Expiration must be at least 1 hour")
    @Max(value = 168, message = "Expiration cannot exceed 168 hours (7 days)")
    Integer expiresInHours,

    @Min(value = 0, message = "Max uses cannot be negative")
    Integer maxUses
) {
    public CreateInviteRequest {
        if (expiresInHours == null) expiresInHours = 48;
        if (maxUses == null) maxUses = 0;
    }
}
