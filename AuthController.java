package com.sameer.cricket.controller;

import com.sameer.cricket.dto.AuthRequestDTO;
import com.sameer.cricket.dto.AuthResponseDTO;
import com.sameer.cricket.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @RequestBody AuthRequestDTO request) {
        try {
            AuthResponseDTO response =
                authService.signup(request);

            Map<String, Object> userMap =
                new HashMap<>();
            userMap.put("id",
                response.getUser().getId());
            userMap.put("name",
                response.getUser().getName());
            userMap.put("email",
                response.getUser().getEmail());

            return ResponseEntity.ok(
                Map.of("user", userMap));

        } catch (RuntimeException e) {
            return ResponseEntity
                .badRequest()
                .body(Map.of("message",
                    e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody AuthRequestDTO request) {
        try {
            AuthResponseDTO response =
                authService.login(request);

            Map<String, Object> userMap =
                new HashMap<>();
            userMap.put("id",
                response.getUser().getId());
            userMap.put("name",
                response.getUser().getName());
            userMap.put("email",
                response.getUser().getEmail());

            Map<String, Object> result =
                new HashMap<>();
            result.put("token",
                response.getToken());
            result.put("user", userMap);

            return ResponseEntity.ok(result);

        } catch (RuntimeException e) {
            return ResponseEntity
                .badRequest()
                .body(Map.of("message",
                    e.getMessage()));
        }
    }
}