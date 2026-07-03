package com.sameer.cricket.util;

import com.sameer.cricket.entity.User;
import com.sameer.cricket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class TokenHelper {

    @Autowired
    private UserRepository userRepository;

    // Extract user from Authorization header
    // Header format: "Bearer <token>"
    public User getUserFromRequest(
            HttpServletRequest request) {

        String header =
            request.getHeader("Authorization");

        if (header == null
                || !header.startsWith("Bearer ")) {
            throw new RuntimeException(
                "Unauthorized: No token provided");
        }

        String token = header.substring(7);

        return userRepository
            .findByToken(token)
            .orElseThrow(() ->
                new RuntimeException(
                    "Unauthorized: Invalid token"));
    }
}