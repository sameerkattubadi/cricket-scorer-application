package com.sameer.cricket.service;

import com.sameer.cricket.dto.AuthRequestDTO;
import com.sameer.cricket.dto.AuthResponseDTO;

public interface AuthService {
    AuthResponseDTO signup(AuthRequestDTO request);
    AuthResponseDTO login(AuthRequestDTO request);
}