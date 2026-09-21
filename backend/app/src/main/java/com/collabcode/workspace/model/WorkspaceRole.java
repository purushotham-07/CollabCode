package com.collabcode.workspace.model;

public enum WorkspaceRole {
    OWNER(3),
    EDITOR(2),
    VIEWER(1);

    private final int level;

    WorkspaceRole(int level) {
        this.level = level;
    }

    public int getLevel() {
        return level;
    }

    public boolean canEdit() {
        return this == OWNER || this == EDITOR;
    }

    public boolean canManageRoles() {
        return this == OWNER;
    }

    public boolean canDelete() {
        return this == OWNER;
    }

    public boolean hasPermission(WorkspaceRole requiredRole) {
        return this.level >= requiredRole.level;
    }
}
