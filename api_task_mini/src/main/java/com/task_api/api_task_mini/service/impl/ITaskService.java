package com.task_api.api_task_mini.service.impl;

import java.util.Set;

import com.task_api.api_task_mini.dto.CreateTask;
import com.task_api.api_task_mini.dto.UpdateTask;
import com.task_api.api_task_mini.dto.ViewTask;

public interface ITaskService {

    // metodo para crear 
    public void crearTarea(CreateTask task);
    // metodo para traer lista entera
    public Set<ViewTask> listaTareas();
    // metodo para traer pot id
    public ViewTask tareaById(long id);
    // metodo para editar 
    public void crearEditar(UpdateTask dto);
    // metodo para eliminar
    public void deleteTarea(Long id);
}
