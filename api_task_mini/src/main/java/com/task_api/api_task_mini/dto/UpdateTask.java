package com.task_api.api_task_mini.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
@Builder
public class UpdateTask {
    private Long id;
    private String titulo;
    private String descripcion;
    private LocalDateTime fechaLimite;
    private boolean completado;
}
