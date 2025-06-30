package com.actividad.controller;

import com.actividad.dto.ActividadConNotaDTO;
import com.actividad.model.Actividad;
import com.actividad.model.Nota;
import com.actividad.repository.ActividadRepository;
import com.actividad.repository.NotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@Controller
@RequestMapping("/actividades")
public class ActividadController {

    @Autowired
    private ActividadRepository actividadRepository;

    @Autowired
    private NotaRepository notaRepository;

    // Página principal de evaluaciones - muestra actividades terminadas
    @GetMapping("/evaluaciones")
    public String mostrarEvaluaciones(Model model) {
        try {
            System.out.println("=== MOSTRANDO EVALUACIONES ===");

            // Obtener actividades terminadas (fecha de término anterior a la actual)
            LocalDateTime fechaActual = LocalDateTime.now();
            List<Actividad> actividadesTerminadas = actividadRepository.findActividadesTerminadas(fechaActual);

            System.out.println("Actividades terminadas encontradas: " + actividadesTerminadas.size());

            List<ActividadConNotaDTO> actividades = new ArrayList<>();

            for (Actividad actividad : actividadesTerminadas) {
                try {
                    // Calcular promedio de notas
                    Double promedio = notaRepository.findPromedioNotasByActividadId(actividad.getId());
                    Long cantidadNotas = notaRepository.countNotasByActividadId(actividad.getId());

                    // Crear DTO con datos seguros
                    LocalDate fechaInicio = actividad.getDiaHoraInicio() != null ?
                        actividad.getDiaHoraInicio().toLocalDate() : LocalDate.now().minusDays(1);
                    LocalDate fechaTermino = actividad.getDiaHoraTermino() != null ?
                        actividad.getDiaHoraTermino().toLocalDate() : fechaInicio.plusDays(1);
                    LocalTime horaInicio = actividad.getDiaHoraInicio() != null ?
                        actividad.getDiaHoraInicio().toLocalTime() : LocalTime.of(10, 0);
                    LocalTime horaTermino = actividad.getDiaHoraTermino() != null ?
                        actividad.getDiaHoraTermino().toLocalTime() : LocalTime.of(11, 0);

                    ActividadConNotaDTO dto = new ActividadConNotaDTO(
                        actividad.getId(),
                        actividad.getNombre() != null ? actividad.getNombre() : "Sin nombre",
                        actividad.getDescripcion() != null ? actividad.getDescripcion() : "Sin descripción",
                        fechaInicio,
                        fechaTermino,
                        horaInicio,
                        horaTermino,
                        "actividad", // tipo
                        actividad.getSector() != null ? actividad.getSector() : "Sin especificar",
                        "Sin especificar", // dirección
                        actividad.getComunaId(),
                        promedio,
                        cantidadNotas
                    );

                    actividades.add(dto);
                    System.out.println("DTO creado para actividad " + actividad.getId() + " - Promedio: " +
                        (promedio != null ? String.format("%.2f", promedio) : "-"));

                } catch (Exception e) {
                    System.out.println("Error procesando actividad " + actividad.getId() + ": " + e.getMessage());
                }
            }

            System.out.println("Total DTOs creados: " + actividades.size());
            model.addAttribute("actividades", actividades);
            return "evaluaciones";

        } catch (Exception e) {
            System.out.println("ERROR CRÍTICO en evaluaciones: " + e.getMessage());
            e.printStackTrace();

            // En caso de error, mostrar lista vacía
            model.addAttribute("actividades", new ArrayList<ActividadConNotaDTO>());
            return "evaluaciones";
        }
    }

    // API REST para agregar una nueva nota a una actividad
    @PostMapping("/api/notas")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> agregarNota(@RequestBody @Valid Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("=== AGREGANDO NOTA ===");
            System.out.println("Request recibido: " + request);

            // Extraer datos del request
            Integer actividadId = Integer.valueOf(request.get("actividadId").toString());
            Integer valorNota = Integer.valueOf(request.get("nota").toString());

            System.out.println("Actividad ID: " + actividadId + ", Nota: " + valorNota);

            // Validar que la nota esté entre 1 y 7
            if (valorNota < 1 || valorNota > 7) {
                response.put("error", "La nota debe estar entre 1 y 7");
                return ResponseEntity.badRequest().body(response);
            }

            // Buscar la actividad
            Optional<Actividad> actividadOpt = actividadRepository.findById(actividadId);
            if (!actividadOpt.isPresent()) {
                response.put("error", "Actividad no encontrada");
                return ResponseEntity.badRequest().body(response);
            }

            Actividad actividad = actividadOpt.get();

            // Verificar que la actividad esté terminada
            if (actividad.getDiaHoraTermino() == null ||
                !actividad.getDiaHoraTermino().isBefore(LocalDateTime.now())) {
                response.put("error", "Solo se pueden evaluar actividades terminadas");
                return ResponseEntity.badRequest().body(response);
            }

            // Crear y guardar la nueva nota
            Nota nuevaNota = new Nota(valorNota, actividad);
            notaRepository.save(nuevaNota);

            System.out.println("Nota guardada exitosamente con ID: " + nuevaNota.getId());

            // Calcular el nuevo promedio
            Double promedio = notaRepository.findPromedioNotasByActividadId(actividadId);
            Long cantidadNotas = notaRepository.countNotasByActividadId(actividadId);

            String promedioStr = promedio != null ? String.format("%.2f", promedio) : "-";

            System.out.println("Nuevo promedio: " + promedioStr + " (basado en " + cantidadNotas + " notas)");

            response.put("success", true);
            response.put("promedio", promedioStr);
            response.put("cantidadNotas", cantidadNotas);

            return ResponseEntity.ok(response);

        } catch (NumberFormatException e) {
            System.out.println("Error de formato de número: " + e.getMessage());
            response.put("error", "Formato de datos inválido");
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            System.out.println("Error interno: " + e.getMessage());
            e.printStackTrace();
            response.put("error", "Error interno del servidor: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // API REST para obtener el promedio actualizado de una actividad
    @GetMapping("/api/{id}/promedio")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> obtenerPromedio(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();

        try {
            Double promedio = notaRepository.findPromedioNotasByActividadId(id);
            Long cantidadNotas = notaRepository.countNotasByActividadId(id);

            response.put("promedio", promedio != null ? String.format("%.2f", promedio) : "-");
            response.put("cantidadNotas", cantidadNotas);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("error", "Error al obtener el promedio");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // API REST para obtener actividades terminadas (para llamadas asíncronas)
    @GetMapping("/api/terminadas")
    @ResponseBody
    public ResponseEntity<List<ActividadConNotaDTO>> obtenerActividadesTerminadas() {
        try {
            LocalDateTime fechaActual = LocalDateTime.now();
            List<Actividad> actividadesTerminadas = actividadRepository.findActividadesTerminadas(fechaActual);
            List<ActividadConNotaDTO> result = new ArrayList<>();

            for (Actividad actividad : actividadesTerminadas) {
                Double promedio = notaRepository.findPromedioNotasByActividadId(actividad.getId());
                Long cantidadNotas = notaRepository.countNotasByActividadId(actividad.getId());

                LocalDate fechaInicio = actividad.getDiaHoraInicio() != null ?
                    actividad.getDiaHoraInicio().toLocalDate() : LocalDate.now().minusDays(1);
                LocalDate fechaTermino = actividad.getDiaHoraTermino() != null ?
                    actividad.getDiaHoraTermino().toLocalDate() : fechaInicio.plusDays(1);
                LocalTime horaInicio = actividad.getDiaHoraInicio() != null ?
                    actividad.getDiaHoraInicio().toLocalTime() : LocalTime.of(10, 0);
                LocalTime horaTermino = actividad.getDiaHoraTermino() != null ?
                    actividad.getDiaHoraTermino().toLocalTime() : LocalTime.of(11, 0);

                ActividadConNotaDTO dto = new ActividadConNotaDTO(
                    actividad.getId(),
                    actividad.getNombre(),
                    actividad.getDescripcion(),
                    fechaInicio,
                    fechaTermino,
                    horaInicio,
                    horaTermino,
                    "actividad", // Tipo por defecto
                    actividad.getSector() != null ? actividad.getSector() : "Sin especificar",
                    "Sin especificar", // Dirección por defecto
                    actividad.getComunaId(),
                    promedio,
                    cantidadNotas
                );

                result.add(dto);
            }

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            System.out.println("Error obteniendo actividades terminadas: " + e.getMessage());
            return ResponseEntity.internalServerError().body(new ArrayList<>());
        }
    }
}

