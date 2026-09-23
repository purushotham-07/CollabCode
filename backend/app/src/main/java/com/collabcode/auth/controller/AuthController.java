package com.collabcode.auth.controller;

import com.collabcode.auth.dto.*;
import com.collabcode.auth.service.AuthService;
import com.collabcode.auth.service.GoogleOAuthService;
import com.collabcode.common.exception.AppException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final String REFRESH_TOKEN_COOKIE = "refreshToken";

    private final AuthService authService;
    private final GoogleOAuthService googleOAuthService;

    public AuthController(AuthService authService, GoogleOAuthService googleOAuthService) {
        this.authService = authService;
        this.googleOAuthService = googleOAuthService;
    }

    @PostMapping("/register")
    public ResponseEntity<TokenResponse> register(@Valid @RequestBody RegisterRequest request,
                                                  HttpServletResponse response) {
        AuthService.AuthResult result = authService.register(request);
        attachRefreshTokenCookie(response, result.rawRefreshToken(), Duration.ofDays(7));
        return ResponseEntity.status(HttpStatus.CREATED).body(result.tokenResponse());
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request,
                                               HttpServletResponse response) {
        AuthService.AuthResult result = authService.login(request);
        attachRefreshTokenCookie(response, result.rawRefreshToken(), Duration.ofDays(7));
        return ResponseEntity.ok(result.tokenResponse());
    }


    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(HttpServletRequest request,
                                                 HttpServletResponse response,
                                                 @CookieValue(name = REFRESH_TOKEN_COOKIE, required = false) String cookieRefreshToken) {
        String tokenToUse = cookieRefreshToken;
        if (tokenToUse == null || tokenToUse.isBlank()) {
            // Check authorization header fallback or custom header
            tokenToUse = request.getHeader("X-Refresh-Token");
        }

        if (tokenToUse == null || tokenToUse.isBlank()) {
            throw new AppException("Refresh token is required", HttpStatus.UNAUTHORIZED);
        }

        AuthService.AuthResult result = authService.refresh(tokenToUse);
        attachRefreshTokenCookie(response, result.rawRefreshToken(), Duration.ofDays(7));
        return ResponseEntity.ok(result.tokenResponse());
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request,
                                                      HttpServletResponse response,
                                                      @CookieValue(name = REFRESH_TOKEN_COOKIE, required = false) String cookieRefreshToken) {
        String tokenToUse = cookieRefreshToken != null ? cookieRefreshToken : request.getHeader("X-Refresh-Token");
        authService.logout(tokenToUse);
        clearRefreshTokenCookie(response);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(@AuthenticationPrincipal String userId) {
        if (userId == null) {
            throw new AppException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(authService.getCurrentUser(userId));
    }

    @GetMapping("/oauth2/google/url")
    public ResponseEntity<Map<String, Object>> getGoogleOAuthUrl(@RequestParam(required = false) String redirectUri) {
        boolean configured = googleOAuthService.isConfigured();
        if (!configured) {
            return ResponseEntity.ok(Map.of(
                    "configured", false,
                    "url", ""
            ));
        }

        String url = googleOAuthService.getAuthorizationUrl(redirectUri);
        return ResponseEntity.ok(Map.of(
                "configured", true,
                "url", url
        ));
    }

    @PostMapping("/oauth2/google/callback")
    public ResponseEntity<TokenResponse> googleCallback(@Valid @RequestBody GoogleAuthRequest request,
                                                        HttpServletResponse response) {
        AuthService.AuthResult result = googleOAuthService.authenticateWithCode(request.code(), request.redirectUri());
        attachRefreshTokenCookie(response, result.rawRefreshToken(), Duration.ofDays(7));
        return ResponseEntity.ok(result.tokenResponse());
    }

    private void attachRefreshTokenCookie(HttpServletResponse response, String refreshToken, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE, refreshToken)
                .httpOnly(true)
                .secure(false) // In production set to true for HTTPS
                .path("/api/auth")
                .maxAge(maxAge)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearRefreshTokenCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(false)
                .path("/api/auth")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
