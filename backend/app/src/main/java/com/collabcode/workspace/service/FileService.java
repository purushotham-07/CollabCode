package com.collabcode.workspace.service;

import com.collabcode.common.exception.AppException;
import com.collabcode.workspace.dto.CreateFileRequest;
import com.collabcode.workspace.dto.FileDto;
import com.collabcode.workspace.model.FileNode;
import com.collabcode.workspace.model.WorkspaceRole;
import com.collabcode.workspace.repository.FileNodeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class FileService {

    private final FileNodeRepository fileRepository;
    private final WorkspaceService workspaceService;

    public FileService(FileNodeRepository fileRepository, WorkspaceService workspaceService) {
        this.fileRepository = fileRepository;
        this.workspaceService = workspaceService;
    }

    public List<FileDto> getWorkspaceFiles(String userId, String workspaceId) {
        workspaceService.getWorkspaceAndRequireRole(userId, workspaceId, WorkspaceRole.VIEWER);

        List<FileNode> files = fileRepository.findByWorkspaceId(workspaceId);
        return files.stream()
                .sorted(Comparator.comparing(FileNode::isDirectory).reversed()
                        .thenComparing(FileNode::getPath))
                .map(FileDto::from)
                .toList();
    }

    public FileDto getFile(String userId, String workspaceId, String fileId) {
        workspaceService.getWorkspaceAndRequireRole(userId, workspaceId, WorkspaceRole.VIEWER);

        FileNode file = fileRepository.findById(fileId)
                .filter(f -> f.getWorkspaceId().equals(workspaceId))
                .orElseThrow(() -> new AppException("File not found", HttpStatus.NOT_FOUND));

        return FileDto.from(file);
    }

    @Transactional
    public FileDto createFile(String userId, String workspaceId, CreateFileRequest request) {
        workspaceService.getWorkspaceAndRequireRole(userId, workspaceId, WorkspaceRole.EDITOR);

        String normalizedPath = FileNode.normalizePath(request.path());
        if (normalizedPath.isEmpty()) {
            throw new AppException("File path cannot be empty", HttpStatus.BAD_REQUEST);
        }

        if (fileRepository.existsByWorkspaceIdAndPath(workspaceId, normalizedPath)) {
            throw new AppException("A file or directory already exists at path: " + normalizedPath, HttpStatus.CONFLICT);
        }

        // Auto-create intermediate parent directories if missing
        ensureParentDirectoriesExist(workspaceId, normalizedPath);

        FileNode node = new FileNode(workspaceId, normalizedPath, request.isDirectory(), request.content());
        node = fileRepository.save(node);

        return FileDto.from(node);
    }

    @Transactional
    public FileDto updateFileContent(String userId, String workspaceId, String fileId, String content) {
        workspaceService.getWorkspaceAndRequireRole(userId, workspaceId, WorkspaceRole.EDITOR);

        FileNode file = fileRepository.findById(fileId)
                .filter(f -> f.getWorkspaceId().equals(workspaceId))
                .orElseThrow(() -> new AppException("File not found", HttpStatus.NOT_FOUND));

        if (file.isDirectory()) {
            throw new AppException("Cannot update content of a directory node", HttpStatus.BAD_REQUEST);
        }

        file.setContent(content != null ? content : "");
        file = fileRepository.save(file);

        return FileDto.from(file);
    }

    @Transactional
    public FileDto renameFile(String userId, String workspaceId, String fileId, String newNameOrPath) {
        workspaceService.getWorkspaceAndRequireRole(userId, workspaceId, WorkspaceRole.EDITOR);

        FileNode file = fileRepository.findById(fileId)
                .filter(f -> f.getWorkspaceId().equals(workspaceId))
                .orElseThrow(() -> new AppException("File not found", HttpStatus.NOT_FOUND));

        String oldPath = file.getPath();
        String targetPath;

        if (newNameOrPath.contains("/")) {
            targetPath = FileNode.normalizePath(newNameOrPath);
        } else {
            // It's just a file/directory name change within the same parent folder
            int lastSlash = oldPath.lastIndexOf('/');
            targetPath = lastSlash >= 0 ? oldPath.substring(0, lastSlash + 1) + newNameOrPath.trim() : newNameOrPath.trim();
        }

        if (oldPath.equals(targetPath)) {
            return FileDto.from(file);
        }

        if (fileRepository.existsByWorkspaceIdAndPath(workspaceId, targetPath)) {
            throw new AppException("A file or directory already exists at path: " + targetPath, HttpStatus.CONFLICT);
        }

        if (file.isDirectory()) {
            // Recursively update all children paths
            String oldPrefix = oldPath + "/";
            String newPrefix = targetPath + "/";
            List<FileNode> children = fileRepository.findByWorkspaceIdAndPathStartingWith(workspaceId, oldPrefix);
            for (FileNode child : children) {
                String subPath = child.getPath().substring(oldPrefix.length());
                child.setPath(newPrefix + subPath);
            }
            fileRepository.saveAll(children);
        }

        file.setPath(targetPath);
        file = fileRepository.save(file);

        return FileDto.from(file);
    }

    @Transactional
    public FileDto moveFile(String userId, String workspaceId, String fileId, String destinationDir) {
        workspaceService.getWorkspaceAndRequireRole(userId, workspaceId, WorkspaceRole.EDITOR);

        FileNode file = fileRepository.findById(fileId)
                .filter(f -> f.getWorkspaceId().equals(workspaceId))
                .orElseThrow(() -> new AppException("File not found", HttpStatus.NOT_FOUND));

        String normalizedDest = FileNode.normalizePath(destinationDir);
        String fileName = file.getName();
        String newPath = normalizedDest.isEmpty() ? fileName : normalizedDest + "/" + fileName;

        return renameFile(userId, workspaceId, fileId, newPath);
    }

    @Transactional
    public void deleteFile(String userId, String workspaceId, String fileId) {
        workspaceService.getWorkspaceAndRequireRole(userId, workspaceId, WorkspaceRole.EDITOR);

        FileNode file = fileRepository.findById(fileId)
                .filter(f -> f.getWorkspaceId().equals(workspaceId))
                .orElseThrow(() -> new AppException("File not found", HttpStatus.NOT_FOUND));

        if (file.isDirectory()) {
            // Delete all child nodes under this directory
            fileRepository.deleteByWorkspaceIdAndPathStartingWith(workspaceId, file.getPath() + "/");
        }

        fileRepository.delete(file);
    }

    private void ensureParentDirectoriesExist(String workspaceId, String filePath) {
        int lastSlash = filePath.lastIndexOf('/');
        if (lastSlash <= 0) return;

        String parentPath = filePath.substring(0, lastSlash);
        String[] parts = parentPath.split("/");
        StringBuilder currentPath = new StringBuilder();

        List<FileNode> newDirectories = new ArrayList<>();
        for (String part : parts) {
            if (currentPath.length() > 0) currentPath.append("/");
            currentPath.append(part);
            String dirPath = currentPath.toString();

            if (!fileRepository.existsByWorkspaceIdAndPath(workspaceId, dirPath)) {
                newDirectories.add(new FileNode(workspaceId, dirPath, true, null));
            }
        }

        if (!newDirectories.isEmpty()) {
            fileRepository.saveAll(newDirectories);
        }
    }
}
