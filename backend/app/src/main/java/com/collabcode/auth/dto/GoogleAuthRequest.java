package com.collabcode.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record GoogleAuthRequest(
    @NotBlank(message = "Authorization code is required")
    String code,

    String redirectUri
) {}
