package com.task_api.api_task_mini.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.task_api.api_task_mini.model.Task;
import com.task_api.api_task_mini.model.UserEntity;
@Repository
public interface TaskRepository extends JpaRepository<Task,Long>{

    public Task findTaskByTitulo(String titulo);
    public Set<Task>findAllTasksByUsuario(UserEntity user);
}
