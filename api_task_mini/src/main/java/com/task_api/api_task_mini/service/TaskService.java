package com.task_api.api_task_mini.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.task_api.api_task_mini.dto.CreateTask;
import com.task_api.api_task_mini.dto.UpdateTask;
import com.task_api.api_task_mini.dto.ViewTask;
import com.task_api.api_task_mini.model.Task;
import com.task_api.api_task_mini.repository.TaskRepository;
import com.task_api.api_task_mini.repository.UserRepository;
import com.task_api.api_task_mini.service.impl.ITaskService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService implements ITaskService {

    private final TaskRepository taskRepo;
    private final UserRepository userRepo;
    public void crearTarea(CreateTask task) {
        Task newTask = Task.builder()
            .titulo(task.getTitulo())
            .descripcion(task.getDescripcion())
            .fechaCreada(LocalDateTime.now())
            .fechaLimite(task.getFechaLimite())
            .completado(false)
            .usuario(userRepo.findUserByUsername(getCurrentUsername()).orElseThrow(()-> new RuntimeException("Usuario no encontrado")))
            .build();
        taskRepo.save(newTask);
    }

    @Override
    public Set<ViewTask> listaTareas() {
        Set<Task>listaTareas = new HashSet<>();
        listaTareas = taskRepo.findAllTasksByUsuario(userRepo.findUserByUsername(getCurrentUsername())
        .orElseThrow(()->new RuntimeException("Usuario para abuscar en la lista no encontrado")));
        // creo la lista que voy a mostrar
        Set<ViewTask> listaVisualTask = new HashSet<>();

        for(Task task:listaTareas){
            ViewTask viewTask = ViewTask.builder()
                .id(task.getId())
                .titulo(task.getTitulo())
                .descripcion(task.getDescripcion())
                .fechaLimite(task.getFechaLimite())
                .build();
            listaVisualTask.add(viewTask);
        }
        return listaVisualTask;
    }

    @Override
    public ViewTask tareaById(long id) {
        Task task = new Task();
        task = taskRepo.findById(id).orElseThrow(()-> new RuntimeException("Tarea no encontrada por el id"));
        ViewTask viewTask = ViewTask.builder()
            .id(task.getId())
            .titulo(task.getTitulo())
            .descripcion(task.getDescripcion())
            .fechaLimite(task.getFechaLimite())
            .build();
        return viewTask;
    }

    @Override
    public void crearEditar(UpdateTask dto) {
        Task taskBd =taskRepo.findById(dto.getId())
        .orElseThrow(()-> new RuntimeException("Usuario no encontrado"));

        String username = getCurrentUsername();
        if(!taskBd.getUsuario().getUsername().equals(username)){
            throw new RuntimeException("No tienes pinches permisos para editar esta tarea pt");
        }

        taskBd.setTitulo(dto.getTitulo());
        taskBd.setDescripcion(dto.getDescripcion());
        taskBd.setFechaLimite(dto.getFechaLimite());
        taskBd.setCompletado(dto.isCompletado());
        
        taskRepo.save(taskBd);
        
    }


    @Override
    public void deleteTarea(Long id) {
        taskRepo.deleteById(id);
    }


    public String getCurrentUsername() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    return auth.getName(); // suele ser el email o username
    }
}
