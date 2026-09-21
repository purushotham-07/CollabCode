package com.collabcode.auth.dto;

public record TokenResponse(
    String accessToken,
    String tokenType,
    long expiresInSeconds,
    UserDto user
) {
    public static TokenResponse of(String accessToken, long expiresInMs, UserDto user) {
        return new TokenResponse(accessToken, "Bearer", expiresInMs / 1000, user);
    }
}
