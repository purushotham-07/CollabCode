package com.collabcode.auth;

import com.collabcode.auth.dto.LoginRequest;
import com.collabcode.auth.dto.RegisterRequest;
import com.collabcode.auth.model.RefreshToken;
import com.collabcode.auth.model.User;
import com.collabcode.auth.repository.RefreshTokenRepository;
import com.collabcode.auth.repository.UserRepository;
import com.collabcode.auth.service.AuthService;
import com.collabcode.auth.service.JwtService;
import com.collabcode.common.exception.AppException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private JwtService jwtService;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "accessTokenExpirationMs", 60000L);
        ReflectionTestUtils.setField(jwtService, "refreshTokenExpirationMs", 3600000L);
        jwtService.init();

        authService = new AuthService(userRepository, refreshTokenRepository, jwtService, passwordEncoder);
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest req = new RegisterRequest("Bob", "bob@example.com", "SecurePassword123!");
        when(userRepository.existsByEmail("bob@example.com")).thenReturn(false);
        when(passwordEncoder.encode(req.password())).thenReturn("encoded_pass");

        User savedUser = new User("bob@example.com", "encoded_pass", "Bob", null);
        savedUser.setId("user_bob");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        AuthService.AuthResult result = authService.register(req);

        assertNotNull(result);
        assertNotNull(result.rawRefreshToken());
        assertEquals("user_bob", result.tokenResponse().user().id());
        assertEquals("bob@example.com", result.tokenResponse().user().email());
        verify(refreshTokenRepository, times(1)).save(any(RefreshToken.class));
    }

    @Test
    void testRegisterDuplicateEmailThrowsAppException() {
        RegisterRequest req = new RegisterRequest("Bob", "bob@example.com", "SecurePassword123!");
        when(userRepository.existsByEmail("bob@example.com")).thenReturn(true);

        assertThrows(AppException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testLoginSuccess() {
        LoginRequest req = new LoginRequest("bob@example.com", "SecurePassword123!");
        User user = new User("bob@example.com", "encoded_pass", "Bob", null);
        user.setId("user_bob");

        when(userRepository.findByEmail("bob@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("SecurePassword123!", "encoded_pass")).thenReturn(true);

        AuthService.AuthResult result = authService.login(req);

        assertNotNull(result);
        assertNotNull(result.tokenResponse().accessToken());
        assertEquals("bob@example.com", result.tokenResponse().user().email());
    }

    @Test
    void testLoginWrongPasswordThrowsBadCredentials() {
        LoginRequest req = new LoginRequest("bob@example.com", "WrongPassword!");
        User user = new User("bob@example.com", "encoded_pass", "Bob", null);
        user.setId("user_bob");

        when(userRepository.findByEmail("bob@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("WrongPassword!", "encoded_pass")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> authService.login(req));
    }

    @Test
    void testRefreshTokenRotation() {
        String rawOldToken = "old-raw-token-value";
        String oldHash = jwtService.hashToken(rawOldToken);

        RefreshToken oldTokenDoc = new RefreshToken("user_bob", oldHash, "family_123", Instant.now().plusSeconds(600));
        when(refreshTokenRepository.findByTokenHash(oldHash)).thenReturn(Optional.of(oldTokenDoc));

        User user = new User("bob@example.com", "encoded_pass", "Bob", null);
        user.setId("user_bob");
        when(userRepository.findById("user_bob")).thenReturn(Optional.of(user));

        AuthService.AuthResult result = authService.refresh(rawOldToken);

        assertNotNull(result);
        assertNotEquals(rawOldToken, result.rawRefreshToken());
        assertNotNull(oldTokenDoc.getRevokedAt()); // old token must be revoked
        verify(refreshTokenRepository, times(2)).save(any(RefreshToken.class));
    }

    @Test
    void testTokenReuseRevokesFamily() {
        String rawCompromisedToken = "compromised-token";
        String hash = jwtService.hashToken(rawCompromisedToken);

        RefreshToken revokedDoc = new RefreshToken("user_bob", hash, "family_123", Instant.now().plusSeconds(600));
        revokedDoc.setRevokedAt(Instant.now().minusSeconds(10)); // already revoked!

        when(refreshTokenRepository.findByTokenHash(hash)).thenReturn(Optional.of(revokedDoc));

        RefreshToken activeSiblingDoc = new RefreshToken("user_bob", "sibling_hash", "family_123", Instant.now().plusSeconds(600));
        when(refreshTokenRepository.findByFamily("family_123")).thenReturn(List.of(revokedDoc, activeSiblingDoc));

        assertThrows(AppException.class, () -> authService.refresh(rawCompromisedToken));
        verify(refreshTokenRepository, times(1)).saveAll(any());
        assertNotNull(activeSiblingDoc.getRevokedAt());
    }
}
