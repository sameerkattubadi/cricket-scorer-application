package com.sameer.cricket.service;

import com.sameer.cricket.dto.AuthRequestDTO;
import com.sameer.cricket.dto.AuthResponseDTO;
import com.sameer.cricket.dto.UserDTO;
import com.sameer.cricket.entity.User;
import com.sameer.cricket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Override
    public AuthResponseDTO signup(AuthRequestDTO request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));

        userRepository.save(user);

        UserDTO userDTO = new UserDTO(
            user.getId(),
            user.getName(),
            user.getEmail()
        );

        return new AuthResponseDTO(null, userDTO);
    }

    @Override
    public AuthResponseDTO login(AuthRequestDTO request) {

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = UUID.randomUUID().toString();
        user.setToken(token);
        userRepository.save(user);

        UserDTO userDTO = new UserDTO(
            user.getId(),
            user.getName(),
            user.getEmail()
        );

        return new AuthResponseDTO(token, userDTO);
    }
}
