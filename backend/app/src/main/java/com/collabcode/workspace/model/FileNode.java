package com.collabcode.workspace.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "files")
@CompoundIndex(name = "ws_path_idx", def = "{'workspaceId': 1, 'path': 1}", unique = true)
public class FileNode {

    @Id
    private String id;

    @Indexed
    private String workspaceId;

    private String path;

    private boolean isDirectory;

    private String language;

    private String content;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public FileNode() {
    }

    public FileNode(String workspaceId, String path, boolean isDirectory, String content) {
        this.workspaceId = workspaceId;
        this.path = normalizePath(path);
        this.isDirectory = isDirectory;
        this.language = isDirectory ? null : detectLanguage(this.path);
        this.content = content != null ? content : "";
    }

    public static String normalizePath(String rawPath) {
        if (rawPath == null) return "";
        String p = rawPath.replace('\\', '/').trim();
        while (p.startsWith("/")) p = p.substring(1);
        while (p.endsWith("/")) p = p.substring(0, p.length() - 1);
        return p;
    }

    public static String detectLanguage(String filePath) {
        if (filePath == null) return "plaintext";
        String lower = filePath.toLowerCase();
        if (lower.endsWith(".js") || lower.endsWith(".jsx") || lower.endsWith(".mjs")) return "javascript";
        if (lower.endsWith(".ts") || lower.endsWith(".tsx")) return "typescript";
        if (lower.endsWith(".py")) return "python";
        if (lower.endsWith(".java")) return "java";
        if (lower.endsWith(".html") || lower.endsWith(".htm")) return "html";
        if (lower.endsWith(".css") || lower.endsWith(".scss") || lower.endsWith(".sass")) return "css";
        if (lower.endsWith(".json")) return "json";
        if (lower.endsWith(".md") || lower.endsWith(".markdown")) return "markdown";
        if (lower.endsWith(".sql")) return "sql";
        if (lower.endsWith(".go")) return "go";
        if (lower.endsWith(".rs")) return "rust";
        if (lower.endsWith(".sh") || lower.endsWith(".bash")) return "shell";
        if (lower.endsWith(".xml") || lower.endsWith(".svg")) return "xml";
        if (lower.endsWith(".yml") || lower.endsWith(".yaml")) return "yaml";
        return "plaintext";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(String workspaceId) {
        this.workspaceId = workspaceId;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = normalizePath(path);
        if (!this.isDirectory) {
            this.language = detectLanguage(this.path);
        }
    }

    public boolean isDirectory() {
        return isDirectory;
    }

    public void setDirectory(boolean directory) {
        isDirectory = directory;
        if (directory) {
            this.language = null;
        }
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getName() {
        if (path == null || path.isEmpty()) return "";
        int lastSlash = path.lastIndexOf('/');
        return lastSlash >= 0 ? path.substring(lastSlash + 1) : path;
    }
}
