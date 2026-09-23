package com.collabcode.auth.service;

import com.collabcode.auth.dto.LoginRequest;
import com.collabcode.auth.dto.RegisterRequest;
import com.collabcode.auth.dto.TokenResponse;
import com.collabcode.auth.dto.UserDto;
import com.collabcode.auth.model.RefreshToken;
import com.collabcode.auth.model.User;
import com.collabcode.auth.repository.RefreshTokenRepository;
import com.collabcode.auth.repository.UserRepository;
import com.collabcode.common.exception.AppException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public record AuthResult(TokenResponse tokenResponse, String rawRefreshToken) {}

    public AuthService(UserRepository userRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResult register(RegisterRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new AppException("An account with this email already exists.", HttpStatus.CONFLICT);
        }

        String hashedPassword = passwordEncoder.encode(request.password());
        User user = new User(normalizedEmail, hashedPassword, request.displayName().trim(), null);
        user = userRepository.save(user);

        return createAuthResult(user, UUID.randomUUID().toString());
    }

    public AuthResult login(LoginRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password."));

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password.");
        }

        return createAuthResult(user, UUID.randomUUID().toString());
    }


    @Transactional
    public AuthResult refresh(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            throw new AppException("Refresh token is missing", HttpStatus.UNAUTHORIZED);
        }

        String hash = jwtService.hashToken(rawRefreshToken);
        RefreshToken tokenDoc = refreshTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> new AppException("Invalid refresh token", HttpStatus.UNAUTHORIZED));

        // Detect refresh token reuse! If token is already revoked, an attacker or compromised client reused it.
        if (tokenDoc.isRevoked()) {
            log.warn("Refresh token reuse detected for user {} in family {}! Invalidating entire token family.",
                    tokenDoc.getUserId(), tokenDoc.getFamily());
            revokeTokenFamily(tokenDoc.getFamily());
            throw new AppException("Invalid refresh token. Token family revoked.", HttpStatus.UNAUTHORIZED);
        }

        if (tokenDoc.isExpired()) {
            throw new AppException("Refresh token expired", HttpStatus.UNAUTHORIZED);
        }

        User user = userRepository.findById(tokenDoc.getUserId())
                .orElseThrow(() -> new AppException("User not found", HttpStatus.UNAUTHORIZED));

        // Mark old token as revoked
        tokenDoc.setRevokedAt(Instant.now());
        refreshTokenRepository.save(tokenDoc);

        // Issue new token in the same rotation family
        String newRawToken = jwtService.generateRefreshTokenRaw();
        String newHash = jwtService.hashToken(newRawToken);
        Instant expiresAt = Instant.now().plusMillis(jwtService.getRefreshTokenExpirationMs());

        RefreshToken newTokenDoc = new RefreshToken(user.getId(), newHash, tokenDoc.getFamily(), expiresAt);
        refreshTokenRepository.save(newTokenDoc);

        String accessToken = jwtService.generateAccessToken(user);
        TokenResponse response = TokenResponse.of(accessToken, newRawToken, jwtService.getAccessTokenExpirationMs(), UserDto.from(user));

        return new AuthResult(response, newRawToken);
    }

    public void logout(String rawRefreshToken) {
        if (rawRefreshToken != null && !rawRefreshToken.isBlank()) {
            String hash = jwtService.hashToken(rawRefreshToken);
            refreshTokenRepository.findByTokenHash(hash).ifPresent(token -> {
                revokeTokenFamily(token.getFamily());
            });
        }
    }

    public UserDto getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        return UserDto.from(user);
    }

    public AuthResult handleOAuthSuccess(User user) {
        return createAuthResult(user, UUID.randomUUID().toString());
    }

    private AuthResult createAuthResult(User user, String family) {
        String accessToken = jwtService.generateAccessToken(user);
        String rawRefreshToken = jwtService.generateRefreshTokenRaw();
        String hash = jwtService.hashToken(rawRefreshToken);
        Instant expiresAt = Instant.now().plusMillis(jwtService.getRefreshTokenExpirationMs());

        RefreshToken refreshToken = new RefreshToken(user.getId(), hash, family, expiresAt);
        refreshTokenRepository.save(refreshToken);

        TokenResponse tokenResponse = TokenResponse.of(accessToken, rawRefreshToken, jwtService.getAccessTokenExpirationMs(), UserDto.from(user));
        return new AuthResult(tokenResponse, rawRefreshToken);
    }

    private void revokeTokenFamily(String family) {
        List<RefreshToken> familyTokens = refreshTokenRepository.findByFamily(family);
        Instant now = Instant.now();
        for (RefreshToken token : familyTokens) {
            token.setRevokedAt(now);
        }
        refreshTokenRepository.saveAll(familyTokens);
    }
}
