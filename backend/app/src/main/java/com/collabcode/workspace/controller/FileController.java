package com.collabcode.workspace.controller;

import com.collabcode.workspace.dto.CreateFileRequest;
import com.collabcode.workspace.dto.FileDto;
import com.collabcode.workspace.dto.MoveFileRequest;
import com.collabcode.workspace.dto.RenameFileRequest;
import com.collabcode.workspace.service.FileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/files")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @GetMapping
    public ResponseEntity<List<FileDto>> getFiles(@AuthenticationPrincipal String userId,
                                                  @PathVariable String workspaceId) {
        return ResponseEntity.ok(fileService.getWorkspaceFiles(userId, workspaceId));
    }

    @PostMapping
    public ResponseEntity<FileDto> createFile(@AuthenticationPrincipal String userId,
                                              @PathVariable String workspaceId,
                                              @Valid @RequestBody CreateFileRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fileService.createFile(userId, workspaceId, request));
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<FileDto> getFile(@AuthenticationPrincipal String userId,
                                           @PathVariable String workspaceId,
                                           @PathVariable String fileId) {
        return ResponseEntity.ok(fileService.getFile(userId, workspaceId, fileId));
    }

    @PutMapping("/{fileId}/content")
    public ResponseEntity<FileDto> updateContent(@AuthenticationPrincipal String userId,
                                                 @PathVariable String workspaceId,
                                                 @PathVariable String fileId,
                                                 @RequestBody Map<String, String> body) {
        String content = body.getOrDefault("content", "");
        return ResponseEntity.ok(fileService.updateFileContent(userId, workspaceId, fileId, content));
    }

    @PatchMapping("/{fileId}/rename")
    public ResponseEntity<FileDto> renameFile(@AuthenticationPrincipal String userId,
                                              @PathVariable String workspaceId,
                                              @PathVariable String fileId,
                                              @Valid @RequestBody RenameFileRequest request) {
        return ResponseEntity.ok(fileService.renameFile(userId, workspaceId, fileId, request.newPath()));
    }

    @PatchMapping("/{fileId}/move")
    public ResponseEntity<FileDto> moveFile(@AuthenticationPrincipal String userId,
                                            @PathVariable String workspaceId,
                                            @PathVariable String fileId,
                                            @Valid @RequestBody MoveFileRequest request) {
        return ResponseEntity.ok(fileService.moveFile(userId, workspaceId, fileId, request.destinationPath()));
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Map<String, String>> deleteFile(@AuthenticationPrincipal String userId,
                                                          @PathVariable String workspaceId,
                                                          @PathVariable String fileId) {
        fileService.deleteFile(userId, workspaceId, fileId);
        return ResponseEntity.ok(Map.of("message", "File deleted successfully"));
    }
}
