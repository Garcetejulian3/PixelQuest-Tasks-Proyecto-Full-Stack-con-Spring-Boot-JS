package com.task_api.api_task_mini.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.task_api.api_task_mini.dto.AuthResponse;
import com.task_api.api_task_mini.dto.LoginRequest;
import com.task_api.api_task_mini.dto.RegisterRequest;
import com.task_api.api_task_mini.model.Role;
import com.task_api.api_task_mini.model.UserEntity;
import com.task_api.api_task_mini.repository.UserRepository;
import com.task_api.api_task_mini.service.impl.IUserEntityService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserEntityService implements IUserEntityService {

    private final UserRepository userRepo;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    // REGISTRA un nuevo usuario
    @Override
    public AuthResponse register(RegisterRequest request) {
        // CREA el nuevo usuario
        UserEntity user = UserEntity.builder()
            .username(request.getUsername())
            .password(passwordEncoder.encode(request.getPassword()))
            .firstname(request.getFirstname())
            .lastname(request.getLastname())
            .country(request.getCountry())
            .role(Role.USER)
            .build();

        // GUARDO en la db 
        userRepo.save(user);

        // GENERO el token
        String token = jwtService.getToken(user);

        // DEVUELVO la respuesta 
        return AuthResponse.builder()
            .token(token)
            .build();  
    }


    // AUTENTICA el usuario
    @Override
    public AuthResponse login(LoginRequest request) {
        // VALIDAR credenciales y lanzar excepcion si falla 
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(), 
                request.getPassword()
            )
        );

        // SI PASA las credenciales son correctas 
        UserDetails user = userRepo.findUserByUsername(request.getUsername()).orElseThrow();

        // GENERA el token
        String token = jwtService.getToken(user);

        // DEVUELVO la respuesta
        return AuthResponse.builder()
            .token(token)
            .build();
    }
}
