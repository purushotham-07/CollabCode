package com.collabcode.auth;

import com.collabcode.auth.controller.AuthController;
import com.collabcode.auth.dto.LoginRequest;
import com.collabcode.auth.dto.RegisterRequest;
import com.collabcode.auth.dto.TokenResponse;
import com.collabcode.auth.dto.UserDto;
import com.collabcode.auth.service.AuthService;
import com.collabcode.auth.service.GoogleOAuthService;
import com.collabcode.common.exception.GlobalExceptionHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
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
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @Mock
    private GoogleOAuthService googleOAuthService;

    @InjectMocks
    private AuthController authController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void testRegisterEndpointReturns201AndSetsCookie() throws Exception {
        RegisterRequest request = new RegisterRequest("Carol Danvers", "carol@example.com", "SuperPassword123!");
        UserDto userDto = new UserDto("user_carol", "carol@example.com", "Carol Danvers", null, Set.of("ROLE_USER"), Instant.now());
        TokenResponse tokenResponse = TokenResponse.of("mock.jwt.token", 900000, userDto);

        when(authService.register(any(RegisterRequest.class)))
                .thenReturn(new AuthService.AuthResult(tokenResponse, "mock_refresh_token_123"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Set-Cookie"))
                .andExpect(jsonPath("$.accessToken").value("mock.jwt.token"))
                .andExpect(jsonPath("$.user.email").value("carol@example.com"));
    }

    @Test
    void testLoginEndpointReturns200AndSetsCookie() throws Exception {
        LoginRequest request = new LoginRequest("carol@example.com", "SuperPassword123!");
        UserDto userDto = new UserDto("user_carol", "carol@example.com", "Carol Danvers", null, Set.of("ROLE_USER"), Instant.now());
        TokenResponse tokenResponse = TokenResponse.of("mock.jwt.token", 900000, userDto);

        when(authService.login(any(LoginRequest.class)))
                .thenReturn(new AuthService.AuthResult(tokenResponse, "mock_refresh_token_123"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(header().exists("Set-Cookie"))
                .andExpect(jsonPath("$.accessToken").value("mock.jwt.token"));
    }

    @Test
    void testRegisterValidationFailureReturnsProblemDetail() throws Exception {
        RegisterRequest invalidRequest = new RegisterRequest("", "not-an-email", "short");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Bad Request - Validation Error"))
                .andExpect(jsonPath("$.errors").isMap());
    }

    @Test
    void testRefreshEndpointWithCookie() throws Exception {
        UserDto userDto = new UserDto("user_carol", "carol@example.com", "Carol Danvers", null, Set.of("ROLE_USER"), Instant.now());
        TokenResponse tokenResponse = TokenResponse.of("new.mock.jwt.token", 900000, userDto);

        when(authService.refresh("cookie_refresh_val"))
                .thenReturn(new AuthService.AuthResult(tokenResponse, "new_cookie_refresh_val"));

        mockMvc.perform(post("/api/auth/refresh")
                        .cookie(new Cookie("refreshToken", "cookie_refresh_val")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("new.mock.jwt.token"));
    }

    @Test
    void testLogoutClearsCookie() throws Exception {
        mockMvc.perform(post("/api/auth/logout")
                        .cookie(new Cookie("refreshToken", "old_refresh_val")))
                .andExpect(status().isOk())
                .andExpect(header().exists("Set-Cookie"))
                .andExpect(jsonPath("$.message").value("Logged out successfully"));

        verify(authService).logout("old_refresh_val");
    }
}
