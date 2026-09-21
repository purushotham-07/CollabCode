package com.collabcode.auth.dto;

import com.collabcode.auth.model.User;

import java.time.Instant;
import java.util.Set;

public record UserDto(
    String id,
    String email,
    String displayName,
    String avatarUrl,
    Set<String> roles,
    Instant createdAt
) {
    public static UserDto from(User user) {
        return new UserDto(
            user.getId(),
            user.getEmail(),
            user.getDisplayName(),
            user.getAvatarUrl(),
            user.getRoles(),
            user.getCreatedAt()
        );
    }
}
