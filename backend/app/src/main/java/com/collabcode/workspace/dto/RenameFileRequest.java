package com.collabcode.workspace.dto;

import jakarta.validation.constraints.NotBlank;

public record RenameFileRequest(
    @NotBlank(message = "New name or path is required")
    String newPath
) {}
