package com.collabcode.workspace;

import com.collabcode.workspace.dto.CreateFileRequest;
import com.collabcode.workspace.dto.FileDto;
import com.collabcode.workspace.model.FileNode;
import com.collabcode.workspace.model.Workspace;
import com.collabcode.workspace.model.WorkspaceRole;
import com.collabcode.workspace.repository.FileNodeRepository;
import com.collabcode.workspace.service.FileService;
import com.collabcode.workspace.service.WorkspaceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FileServiceTest {

    @Mock
    private FileNodeRepository fileRepository;

    @Mock
    private WorkspaceService workspaceService;

    private FileService fileService;

    @BeforeEach
    void setUp() {
        fileService = new FileService(fileRepository, workspaceService);
    }

    @Test
    void testCreateFileDetectsLanguageAndAutoCreatesParents() {
        String wsId = "ws_1";
        CreateFileRequest req = new CreateFileRequest("src/utils/math.js", false, "export const add = (a,b) => a+b;");

        Workspace ws = new Workspace("Proj", "user_1");
        when(workspaceService.getWorkspaceAndRequireRole("user_1", wsId, WorkspaceRole.EDITOR)).thenReturn(ws);
        when(fileRepository.existsByWorkspaceIdAndPath(wsId, "src/utils/math.js")).thenReturn(false);
        when(fileRepository.existsByWorkspaceIdAndPath(wsId, "src")).thenReturn(false);
        when(fileRepository.existsByWorkspaceIdAndPath(wsId, "src/utils")).thenReturn(false);

        FileNode savedNode = new FileNode(wsId, "src/utils/math.js", false, req.content());
        savedNode.setId("file_123");
        when(fileRepository.save(any(FileNode.class))).thenReturn(savedNode);

        FileDto result = fileService.createFile("user_1", wsId, req);

        assertNotNull(result);
        assertEquals("src/utils/math.js", result.path());
        assertEquals("math.js", result.name());
        assertEquals("javascript", result.language());
        assertFalse(result.isDirectory());

        // Verifies parent directories "src" and "src/utils" were auto-created
        verify(fileRepository, times(1)).saveAll(any());
    }

    @Test
    void testRenameDirectoryUpdatesChildrenPrefixes() {
        String wsId = "ws_1";
        FileNode dirNode = new FileNode(wsId, "src", true, null);
        dirNode.setId("dir_1");

        FileNode childNode = new FileNode(wsId, "src/main.py", false, "print('hi')");
        childNode.setId("child_1");

        Workspace ws = new Workspace("Proj", "user_1");
        when(workspaceService.getWorkspaceAndRequireRole("user_1", wsId, WorkspaceRole.EDITOR)).thenReturn(ws);
        when(fileRepository.findById("dir_1")).thenReturn(Optional.of(dirNode));
        when(fileRepository.existsByWorkspaceIdAndPath(wsId, "lib")).thenReturn(false);
        when(fileRepository.findByWorkspaceIdAndPathStartingWith(wsId, "src/")).thenReturn(List.of(childNode));
        when(fileRepository.save(any(FileNode.class))).thenReturn(dirNode);

        fileService.renameFile("user_1", wsId, "dir_1", "lib");

        assertEquals("lib", dirNode.getPath());
        assertEquals("lib/main.py", childNode.getPath());
        verify(fileRepository).saveAll(List.of(childNode));
    }

    @Test
    void testDeleteDirectoryDeletesChildrenRecursively() {
        String wsId = "ws_1";
        FileNode dirNode = new FileNode(wsId, "src", true, null);
        dirNode.setId("dir_1");

        Workspace ws = new Workspace("Proj", "user_1");
        when(workspaceService.getWorkspaceAndRequireRole("user_1", wsId, WorkspaceRole.EDITOR)).thenReturn(ws);
        when(fileRepository.findById("dir_1")).thenReturn(Optional.of(dirNode));

        fileService.deleteFile("user_1", wsId, "dir_1");

        verify(fileRepository).deleteByWorkspaceIdAndPathStartingWith(wsId, "src/");
        verify(fileRepository).delete(dirNode);
    }
}
