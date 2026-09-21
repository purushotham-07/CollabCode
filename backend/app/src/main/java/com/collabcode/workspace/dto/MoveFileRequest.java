package com.collabcode.workspace.dto;

import jakarta.validation.constraints.NotBlank;

public record MoveFileRequest(
    @NotBlank(message = "Destination folder path is required")
    String destinationPath
) {}
