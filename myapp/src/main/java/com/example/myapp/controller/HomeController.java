package com.example.myapp.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
                "message", "Simple Inventory Manager API",
                "version", "1.0.0",
                "auth", "/api/auth/login, /api/auth/signup");
    }
}
