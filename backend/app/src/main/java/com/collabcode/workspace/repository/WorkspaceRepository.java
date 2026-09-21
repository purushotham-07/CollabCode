package com.collabcode.workspace.repository;

import com.collabcode.workspace.model.Workspace;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkspaceRepository extends MongoRepository<Workspace, String> {

    List<Workspace> findByOwnerId(String ownerId);

    @Query("{ 'members.userId': ?0 }")
    List<Workspace> findByMemberUserId(String userId);
}
