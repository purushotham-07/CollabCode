package com.collabcode.auth.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record TokenResponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    long expiresInSeconds,
    UserDto user
) {
    public static TokenResponse of(String accessToken, String refreshToken, long expiresInMs, UserDto user) {
        return new TokenResponse(accessToken, refreshToken, "Bearer", expiresInMs / 1000, user);
    }

    public static TokenResponse of(String accessToken, long expiresInMs, UserDto user) {
        return new TokenResponse(accessToken, null, "Bearer", expiresInMs / 1000, user);
    }
}
