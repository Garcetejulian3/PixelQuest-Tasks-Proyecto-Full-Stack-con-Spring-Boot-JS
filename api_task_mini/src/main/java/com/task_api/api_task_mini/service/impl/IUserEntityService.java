package com.task_api.api_task_mini.service.impl;

import com.task_api.api_task_mini.dto.AuthResponse;
import com.task_api.api_task_mini.dto.LoginRequest;
import com.task_api.api_task_mini.dto.RegisterRequest;

public interface IUserEntityService {

    // metodo de registro
    public AuthResponse register(RegisterRequest request);
    // metodo de login 
    public AuthResponse login(LoginRequest request);
}
