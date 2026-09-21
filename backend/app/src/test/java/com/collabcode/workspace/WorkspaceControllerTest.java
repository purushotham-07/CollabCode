package com.collabcode.workspace;

import com.collabcode.common.exception.GlobalExceptionHandler;
import com.collabcode.workspace.controller.WorkspaceController;
import com.collabcode.workspace.dto.*;
import com.collabcode.workspace.model.WorkspaceRole;
import com.collabcode.workspace.service.WorkspaceInviteService;
import com.collabcode.workspace.service.WorkspaceService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class WorkspaceControllerTest {

    private MockMvc mockMvc;

    @Mock
    private WorkspaceService workspaceService;

    @Mock
    private WorkspaceInviteService inviteService;

    @InjectMocks
    private WorkspaceController workspaceController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(workspaceController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void testCreateWorkspace() throws Exception {
        CreateWorkspaceRequest request = new CreateWorkspaceRequest("Alpha Project");
        WorkspaceDto dto = new WorkspaceDto(
                "ws_alpha",
                "Alpha Project",
                "user_owner",
                List.of(new WorkspaceMemberDto("user_owner", "Owner", "owner@test.com", null, WorkspaceRole.OWNER, Instant.now())),
                WorkspaceRole.OWNER,
                Instant.now(),
                Instant.now()
        );

        when(workspaceService.createWorkspace(any(), any(CreateWorkspaceRequest.class))).thenReturn(dto);

        mockMvc.perform(post("/api/workspaces")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("ws_alpha"))
                .andExpect(jsonPath("$.name").value("Alpha Project"))
                .andExpect(jsonPath("$.myRole").value("OWNER"));
    }

    @Test
    void testGetWorkspaces() throws Exception {
        WorkspaceSummaryDto summary = new WorkspaceSummaryDto(
                "ws_1",
                "Alpha",
                "user_1",
                2,
                WorkspaceRole.OWNER,
                Instant.now(),
                Instant.now()
        );

        when(workspaceService.getUserWorkspaces(any())).thenReturn(List.of(summary));

        mockMvc.perform(get("/api/workspaces"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("ws_1"))
                .andExpect(jsonPath("$[0].memberCount").value(2));
    }

    @Test
    void testCreateInvite() throws Exception {
        CreateInviteRequest request = new CreateInviteRequest(WorkspaceRole.EDITOR, 24, 5);
        InviteDto inviteDto = new InviteDto(
                "inv_1",
                "ws_1",
                "Alpha",
                WorkspaceRole.EDITOR,
                "token_xyz",
                "http://localhost/invite/token_xyz",
                Instant.now().plusSeconds(86400),
                5,
                0,
                Instant.now()
        );

        when(inviteService.createInvite(any(), eq("ws_1"), any(CreateInviteRequest.class), any())).thenReturn(inviteDto);

        mockMvc.perform(post("/api/workspaces/ws_1/invites")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("token_xyz"))
                .andExpect(jsonPath("$.role").value("EDITOR"))
                .andExpect(jsonPath("$.maxUses").value(5));
    }
}
