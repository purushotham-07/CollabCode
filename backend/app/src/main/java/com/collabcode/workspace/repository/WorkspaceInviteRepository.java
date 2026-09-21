package com.collabcode.workspace.repository;

import com.collabcode.workspace.model.WorkspaceInvite;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkspaceInviteRepository extends MongoRepository<WorkspaceInvite, String> {

    Optional<WorkspaceInvite> findByToken(String token);

    List<WorkspaceInvite> findByWorkspaceId(String workspaceId);

    void deleteByWorkspaceId(String workspaceId);
}
