package com.example.myapp.dto.auth;

import com.example.myapp.model.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String name;
    private String email;
    private Role role;
}
