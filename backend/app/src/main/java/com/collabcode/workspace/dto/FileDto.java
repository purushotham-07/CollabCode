package com.collabcode.workspace.dto;

import com.collabcode.workspace.model.FileNode;

import java.time.Instant;

public record FileDto(
    String id,
    String workspaceId,
    String path,
    String name,
    boolean isDirectory,
    String language,
    String content,
    Instant createdAt,
    Instant updatedAt
) {
    public static FileDto from(FileNode file) {
        return new FileDto(
            file.getId(),
            file.getWorkspaceId(),
            file.getPath(),
            file.getName(),
            file.isDirectory(),
            file.getLanguage(),
            file.getContent(),
            file.getCreatedAt(),
            file.getUpdatedAt()
        );
    }
}
