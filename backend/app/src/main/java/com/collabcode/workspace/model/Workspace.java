package com.collabcode.workspace.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Document(collection = "workspaces")
public class Workspace {

    @Id
    private String id;

    private String name;

    @Indexed
    private String ownerId;

    private List<WorkspaceMember> members = new ArrayList<>();

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public Workspace() {
    }

    public Workspace(String name, String ownerId) {
        this.name = name;
        this.ownerId = ownerId;
        this.members.add(new WorkspaceMember(ownerId, WorkspaceRole.OWNER));
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public List<WorkspaceMember> getMembers() {
        return members;
    }

    public void setMembers(List<WorkspaceMember> members) {
        this.members = members;
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

    public Optional<WorkspaceMember> getMember(String userId) {
        if (members == null) return Optional.empty();
        return members.stream().filter(m -> m.getUserId().equals(userId)).findFirst();
    }

    public boolean hasMember(String userId) {
        return getMember(userId).isPresent();
    }

    public Optional<WorkspaceRole> getMemberRole(String userId) {
        return getMember(userId).map(WorkspaceMember::getRole);
    }

    public boolean isOwner(String userId) {
        return ownerId != null && ownerId.equals(userId);
    }

    public void addOrUpdateMember(String userId, WorkspaceRole role) {
        if (members == null) {
            members = new ArrayList<>();
        }
        Optional<WorkspaceMember> existing = getMember(userId);
        if (existing.isPresent()) {
            existing.get().setRole(role);
        } else {
            members.add(new WorkspaceMember(userId, role));
        }
    }

    public boolean removeMember(String userId) {
        if (members == null || isOwner(userId)) return false;
        return members.removeIf(m -> m.getUserId().equals(userId));
    }
}
