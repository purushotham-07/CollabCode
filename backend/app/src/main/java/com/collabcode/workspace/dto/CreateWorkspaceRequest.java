package com.collabcode.workspace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateWorkspaceRequest(
    @NotBlank(message = "Workspace name is required")
    @Size(min = 2, max = 50, message = "Workspace name must be between 2 and 50 characters")
    String name
) {}
