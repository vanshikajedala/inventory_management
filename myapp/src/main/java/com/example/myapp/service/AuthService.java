package com.example.myapp.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.myapp.dto.auth.AuthRequest;
import com.example.myapp.dto.auth.AuthResponse;
import com.example.myapp.dto.auth.SignupRequest;
import com.example.myapp.exception.NotFoundException;
import com.example.myapp.model.AppUser;
import com.example.myapp.model.enums.Role;
import com.example.myapp.repository.AppUserRepository;
import com.example.myapp.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        AppUser user = new AppUser();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        AppUser saved = userRepository.save(user);
        String token = jwtService.generateToken(saved.getEmail());
        return new AuthResponse(token, saved.getName(), saved.getEmail(), saved.getRole());
    }

    public AuthResponse login(AuthRequest request) {
        AppUser user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole());
    }
}
