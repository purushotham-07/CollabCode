package com.collabcode.auth;

import com.collabcode.auth.model.User;
import com.collabcode.auth.service.JwtService;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "accessTokenExpirationMs", 60000L);
        ReflectionTestUtils.setField(jwtService, "refreshTokenExpirationMs", 3600000L);
        jwtService.init();
    }

    @Test
    void testGenerateAndValidateAccessToken() {
        User user = new User("alice@example.com", "hashedpass", "Alice Smith", "https://avatar.com/alice.png");
        user.setId("user_123");
        user.setRoles(Set.of("ROLE_USER", "ROLE_ADMIN"));

        String token = jwtService.generateAccessToken(user);
        assertNotNull(token);
        assertTrue(jwtService.isTokenValid(token));

        Claims claims = jwtService.validateAndParseClaims(token);
        assertEquals("user_123", claims.getSubject());
        assertEquals("alice@example.com", claims.get("email"));
        assertEquals("Alice Smith", claims.get("name"));
    }

    @Test
    void testHashTokenProducesConsistentSha256() {
        String rawToken = "my-secret-token-12345";
        String hash1 = jwtService.hashToken(rawToken);
        String hash2 = jwtService.hashToken(rawToken);

        assertNotNull(hash1);
        assertEquals(hash1, hash2);
        assertEquals(64, hash1.length()); // 256 bits = 64 hex chars
    }

    @Test
    void testInvalidTokenThrowsException() {
        assertFalse(jwtService.isTokenValid("invalid.token.structure"));
    }
}
