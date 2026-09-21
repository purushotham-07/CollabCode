package com.collabcode.workspace.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateFileRequest(
    @NotBlank(message = "File path is required")
    String path,

    boolean isDirectory,

    String content
) {}
