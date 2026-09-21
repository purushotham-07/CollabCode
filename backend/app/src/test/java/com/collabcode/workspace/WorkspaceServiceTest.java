package com.collabcode.workspace;

import com.collabcode.auth.model.User;
import com.collabcode.auth.repository.UserRepository;
import com.collabcode.common.exception.AppException;
import com.collabcode.workspace.dto.CreateWorkspaceRequest;
import com.collabcode.workspace.dto.WorkspaceDto;
import com.collabcode.workspace.model.Workspace;
import com.collabcode.workspace.model.WorkspaceRole;
import com.collabcode.workspace.repository.FileNodeRepository;
import com.collabcode.workspace.repository.WorkspaceInviteRepository;
import com.collabcode.workspace.repository.WorkspaceRepository;
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
class WorkspaceServiceTest {

    @Mock
    private WorkspaceRepository workspaceRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FileNodeRepository fileNodeRepository;

    @Mock
    private WorkspaceInviteRepository workspaceInviteRepository;

    private WorkspaceService workspaceService;

    @BeforeEach
    void setUp() {
        workspaceService = new WorkspaceService(workspaceRepository, userRepository, fileNodeRepository, workspaceInviteRepository);
    }

    @Test
    void testCreateWorkspaceSetsOwnerAndSeedsFiles() {
        CreateWorkspaceRequest req = new CreateWorkspaceRequest("My Project");
        Workspace savedWs = new Workspace("My Project", "user_owner");
        savedWs.setId("ws_123");

        User owner = new User("owner@collabcode.dev", null, "Owner User", null);
        owner.setId("user_owner");

        when(workspaceRepository.save(any(Workspace.class))).thenReturn(savedWs);
        when(userRepository.findAllById(any())).thenReturn(List.of(owner));

        WorkspaceDto dto = workspaceService.createWorkspace("user_owner", req);

        assertNotNull(dto);
        assertEquals("ws_123", dto.id());
        assertEquals("My Project", dto.name());
        assertEquals(WorkspaceRole.OWNER, dto.myRole());
        verify(fileNodeRepository, times(1)).saveAll(any());
    }

    @Test
    void testRequireRoleEnforcesPermissionHierarchy() {
        Workspace ws = new Workspace("Team Repo", "user_owner");
        ws.setId("ws_1");
        ws.addOrUpdateMember("user_editor", WorkspaceRole.EDITOR);
        ws.addOrUpdateMember("user_viewer", WorkspaceRole.VIEWER);

        when(workspaceRepository.findById("ws_1")).thenReturn(Optional.of(ws));

        // Editor can perform EDITOR actions
        assertDoesNotThrow(() -> workspaceService.getWorkspaceAndRequireRole("user_editor", "ws_1", WorkspaceRole.EDITOR));

        // Viewer CANNOT perform EDITOR actions
        assertThrows(AppException.class, () ->
                workspaceService.getWorkspaceAndRequireRole("user_viewer", "ws_1", WorkspaceRole.EDITOR));

        // Editor CANNOT perform OWNER actions
        assertThrows(AppException.class, () ->
                workspaceService.getWorkspaceAndRequireRole("user_editor", "ws_1", WorkspaceRole.OWNER));
    }

    @Test
    void testOwnerCannotBeDemoted() {
        Workspace ws = new Workspace("Team Repo", "user_owner");
        ws.setId("ws_1");

        when(workspaceRepository.findById("ws_1")).thenReturn(Optional.of(ws));

        assertThrows(AppException.class, () ->
                workspaceService.updateMemberRole("user_owner", "ws_1", "user_owner", WorkspaceRole.VIEWER));
    }

    @Test
    void testUpdateMemberRoleByOwnerSucceeds() {
        Workspace ws = new Workspace("Team Repo", "user_owner");
        ws.setId("ws_1");
        ws.addOrUpdateMember("user_bob", WorkspaceRole.VIEWER);

        User owner = new User("owner@collabcode.dev", null, "Owner", null);
        owner.setId("user_owner");
        User bob = new User("bob@collabcode.dev", null, "Bob", null);
        bob.setId("user_bob");

        when(workspaceRepository.findById("ws_1")).thenReturn(Optional.of(ws));
        when(workspaceRepository.save(any(Workspace.class))).thenReturn(ws);
        when(userRepository.findAllById(any())).thenReturn(List.of(owner, bob));

        WorkspaceDto result = workspaceService.updateMemberRole("user_owner", "ws_1", "user_bob", WorkspaceRole.EDITOR);

        assertNotNull(result);
        assertEquals(WorkspaceRole.EDITOR, ws.getMemberRole("user_bob").orElse(null));
    }
}
