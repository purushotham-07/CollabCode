package com.collabcode.auth.service;

import com.collabcode.auth.model.User;
import com.collabcode.auth.repository.UserRepository;
import com.collabcode.common.exception.AppException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@Service
public class GoogleOAuthService {

    private static final Logger log = LoggerFactory.getLogger(GoogleOAuthService.class);

    @Value("${google.client-id:}")
    private String clientId;

    @Value("${google.client-secret:}")
    private String clientSecret;

    @Value("${google.redirect-uri:http://localhost/auth/callback}")
    private String defaultRedirectUri;

    private final UserRepository userRepository;
    private final AuthService authService;
    private final RestTemplate restTemplate;

    public GoogleOAuthService(UserRepository userRepository,
                              AuthService authService,
                              RestTemplateBuilder restTemplateBuilder) {
        this.userRepository = userRepository;
        this.authService = authService;
        this.restTemplate = restTemplateBuilder.build();
    }

    private String cleanValue(String val) {
        if (val == null) return "";
        val = val.trim();
        if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length() - 1).trim();
        }
        return val;
    }

    public String getClientId() {
        return cleanValue(clientId);
    }

    public String getClientSecret() {
        return cleanValue(clientSecret);
    }

    public boolean isConfigured() {
        return !getClientId().isBlank() && !getClientSecret().isBlank();
    }

    public String getAuthorizationUrl(String customRedirectUri) {
        if (!isConfigured()) {
            throw new AppException("Google OAuth is not configured on this server.", HttpStatus.NOT_IMPLEMENTED);
        }

        String redirectUri = (customRedirectUri != null && !customRedirectUri.isBlank()) ? customRedirectUri : defaultRedirectUri;

        return UriComponentsBuilder.fromHttpUrl("https://accounts.google.com/o/oauth2/v2/auth")
                .queryParam("client_id", getClientId())
                .queryParam("redirect_uri", redirectUri)
                .queryParam("response_type", "code")
                .queryParam("scope", "openid email profile")
                .queryParam("access_type", "offline")
                .queryParam("prompt", "select_account")
                .toUriString();
    }

    public AuthService.AuthResult authenticateWithCode(String code, String customRedirectUri) {
        if (!isConfigured()) {
            throw new AppException("Google OAuth is not configured on this server.", HttpStatus.NOT_IMPLEMENTED);
        }

        String redirectUri = (customRedirectUri != null && !customRedirectUri.isBlank()) ? customRedirectUri : defaultRedirectUri;

        // 1. Exchange code for Google Access Token
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", getClientId());
        body.add("client_secret", getClientSecret());
        body.add("code", code);
        body.add("grant_type", "authorization_code");
        body.add("redirect_uri", redirectUri);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(
                    "https://oauth2.googleapis.com/token", request, Map.class);

            if (!tokenResponse.getStatusCode().is2xxSuccessful() || tokenResponse.getBody() == null) {
                throw new AppException("Failed to exchange authorization code with Google", HttpStatus.BAD_REQUEST);
            }

            String googleAccessToken = (String) tokenResponse.getBody().get("access_token");

            // 2. Fetch User Profile
            HttpHeaders userHeaders = new HttpHeaders();
            userHeaders.setBearerAuth(googleAccessToken);
            HttpEntity<Void> userRequest = new HttpEntity<>(userHeaders);

            ResponseEntity<Map> userInfoResponse = restTemplate.exchange(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    HttpMethod.GET,
                    userRequest,
                    Map.class
            );

            Map userInfo = userInfoResponse.getBody();
            if (userInfo == null) {
                throw new AppException("Failed to retrieve Google user profile", HttpStatus.BAD_REQUEST);
            }

            String googleId = (String) userInfo.get("sub");
            String email = ((String) userInfo.get("email")).toLowerCase().trim();
            String name = (String) userInfo.get("name");
            String picture = (String) userInfo.get("picture");

            // 3. Upsert User in MongoDB
            User user = userRepository.findByGoogleId(googleId)
                    .or(() -> userRepository.findByEmail(email))
                    .orElseGet(() -> {
                        User newUser = new User(email, null, name != null ? name : email, picture);
                        newUser.setGoogleId(googleId);
                        return newUser;
                    });

            if (user.getGoogleId() == null) {
                user.setGoogleId(googleId);
            }
            if (user.getAvatarUrl() == null && picture != null) {
                user.setAvatarUrl(picture);
            }

            user = userRepository.save(user);

            // 4. Issue JWT Pair via AuthService
            return authService.handleOAuthSuccess(user);

        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            log.error("Google OAuth token exchange failed with HTTP status {}: {}", e.getStatusCode(), e.getResponseBodyAsString());
            String errorDetail = e.getResponseBodyAsString();
            if (errorDetail == null || errorDetail.isBlank()) {
                errorDetail = e.getMessage();
            }
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new AppException("Google Client Authentication Failed (401 Unauthorized). The GOOGLE_CLIENT_SECRET configured in Render does not match the Client Secret for " + getClientId() + " in Google Cloud Console.", HttpStatus.BAD_REQUEST);
            }
            throw new AppException("Google authentication failed: " + errorDetail, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("Google OAuth token exchange or profile fetch failed: {}", e.getMessage());
            throw new AppException("Google authentication failed: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
