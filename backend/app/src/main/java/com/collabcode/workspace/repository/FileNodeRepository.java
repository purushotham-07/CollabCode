package com.collabcode.workspace.repository;

import com.collabcode.workspace.model.FileNode;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileNodeRepository extends MongoRepository<FileNode, String> {

    List<FileNode> findByWorkspaceId(String workspaceId);

    Optional<FileNode> findByWorkspaceIdAndPath(String workspaceId, String path);

    boolean existsByWorkspaceIdAndPath(String workspaceId, String path);

    void deleteByWorkspaceIdAndPath(String workspaceId, String path);

    void deleteByWorkspaceIdAndPathStartingWith(String workspaceId, String pathPrefix);

    List<FileNode> findByWorkspaceIdAndPathStartingWith(String workspaceId, String pathPrefix);

    void deleteByWorkspaceId(String workspaceId);
}
