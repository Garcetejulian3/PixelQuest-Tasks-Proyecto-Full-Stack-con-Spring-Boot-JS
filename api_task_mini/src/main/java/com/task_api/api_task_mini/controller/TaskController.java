package com.task_api.api_task_mini.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.task_api.api_task_mini.dto.CreateTask;
import com.task_api.api_task_mini.dto.UpdateTask;
import com.task_api.api_task_mini.dto.ViewTask;
import com.task_api.api_task_mini.service.TaskService;

import lombok.RequiredArgsConstructor;

import java.util.HashSet;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/task")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskServis;

    @PostMapping("/crear")
    public ResponseEntity<?> crearTask(@RequestBody CreateTask task) {

        if (task.getTitulo()== null || task.getTitulo().isBlank()){
            return ResponseEntity
                .badRequest()
                .body("El titulo no puede estar vacio");
        }

        if (task.getFechaLimite() == null) {
        return ResponseEntity
                .badRequest()
                .body("La fecha límite es obligatoria");
        }

        taskServis.crearTarea(task);
        
        return ResponseEntity.ok("Se creo correctamente");
    }


    @GetMapping("/listar")
    public Set<ViewTask> listarTareas() {
        Set<ViewTask>listaTareas = new HashSet<>();
        listaTareas = taskServis.listaTareas();
        return listaTareas;
    }

    @PutMapping("/edit")
    public ResponseEntity<?> editTarea(@RequestBody UpdateTask dto) {
        if (dto.getTitulo()== null || dto.getTitulo().isBlank()){
            return ResponseEntity
                .badRequest()
                .body("El titulo no puede estar vacio");
        }

        if (dto.getFechaLimite() == null) {
        return ResponseEntity
                .badRequest()
                .body("La fecha límite es obligatoria");
        }

        taskServis.crearEditar(dto);
        return ResponseEntity.ok("Se creo correctamente");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
    taskServis.deleteTarea(id);
    return ResponseEntity.ok("Tarea eliminada correctamente");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerTareaPorId(@PathVariable Long id) {
        ViewTask tarea = taskServis.tareaById(id);
        return ResponseEntity.ok(tarea);
    }
    
    

}
