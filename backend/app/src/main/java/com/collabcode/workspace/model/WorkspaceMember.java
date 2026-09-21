package com.collabcode.workspace.model;

import java.time.Instant;

public class WorkspaceMember {

    private String userId;
    private WorkspaceRole role;
    private Instant joinedAt;

    public WorkspaceMember() {
    }

    public WorkspaceMember(String userId, WorkspaceRole role) {
        this.userId = userId;
        this.role = role;
        this.joinedAt = Instant.now();
    }

    public WorkspaceMember(String userId, WorkspaceRole role, Instant joinedAt) {
        this.userId = userId;
        this.role = role;
        this.joinedAt = joinedAt;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public WorkspaceRole getRole() {
        return role;
    }

    public void setRole(WorkspaceRole role) {
        this.role = role;
    }

    public Instant getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Instant joinedAt) {
        this.joinedAt = joinedAt;
    }
}
