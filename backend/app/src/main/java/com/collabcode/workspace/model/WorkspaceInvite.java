package com.collabcode.workspace.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.UUID;

@Document(collection = "workspace_invites")
public class WorkspaceInvite {

    @Id
    private String id;

    @Indexed
    private String workspaceId;

    private WorkspaceRole role;

    @Indexed(unique = true)
    private String token;

    @Indexed(expireAfterSeconds = 0)
    private Instant expiresAt;

    private int maxUses;

    private int usedCount;

    private String createdBy;

    @CreatedDate
    private Instant createdAt;

    public WorkspaceInvite() {
    }

    public WorkspaceInvite(String workspaceId, WorkspaceRole role, Instant expiresAt, int maxUses, String createdBy) {
        this.workspaceId = workspaceId;
        this.role = role != null ? role : WorkspaceRole.EDITOR;
        this.token = UUID.randomUUID().toString();
        this.expiresAt = expiresAt;
        this.maxUses = maxUses;
        this.usedCount = 0;
        this.createdBy = createdBy;
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

    public WorkspaceRole getRole() {
        return role;
    }

    public void setRole(WorkspaceRole role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public int getMaxUses() {
        return maxUses;
    }

    public void setMaxUses(int maxUses) {
        this.maxUses = maxUses;
    }

    public int getUsedCount() {
        return usedCount;
    }

    public void setUsedCount(int usedCount) {
        this.usedCount = usedCount;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isValid() {
        if (expiresAt != null && Instant.now().isAfter(expiresAt)) {
            return false;
        }
        if (maxUses > 0 && usedCount >= maxUses) {
            return false;
        }
        return true;
    }

    public void incrementUses() {
        this.usedCount++;
    }
}
