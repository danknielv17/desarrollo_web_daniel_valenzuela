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
import java.time.LocalDate;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Controller
@RequestMapping("/actividades")
public class ActividadController {

    @Autowired
    private ActividadRepository actividadRepository;

    @Autowired
    private NotaRepository notaRepository;

    // Página principal que muestra las actividades terminadas
    @GetMapping("/evaluaciones")
    public String mostrarEvaluaciones(Model model) {
        List<ActividadConNotaDTO> actividades = actividadRepository.findActividadesTerminadasConNotas(LocalDate.now());
        model.addAttribute("actividades", actividades);
        return "evaluaciones";
    }

    // API REST para obtener actividades terminadas (para llamadas asíncronas)
    @GetMapping("/api/terminadas")
    @ResponseBody
    public ResponseEntity<List<ActividadConNotaDTO>> obtenerActividadesTerminadas() {
        List<ActividadConNotaDTO> actividades = actividadRepository.findActividadesTerminadasConNotas(LocalDate.now());
        return ResponseEntity.ok(actividades);
    }

    // API REST para agregar una nueva nota a una actividad
    @PostMapping("/api/notas")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> agregarNota(@RequestBody @Valid Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            Long actividadId = Long.valueOf(request.get("actividadId").toString());
            Integer valorNota = Integer.valueOf(request.get("nota").toString());

            // Validar que la nota esté entre 1 y 7
            if (valorNota < 1 || valorNota > 7) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "La nota debe estar entre 1 y 7");
                return ResponseEntity.badRequest().body(error);
            }

            // Buscar la actividad
            Optional<Actividad> actividadOpt = actividadRepository.findById(actividadId);
            if (!actividadOpt.isPresent()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Actividad no encontrada");
                return ResponseEntity.badRequest().body(error);
            }

            Actividad actividad = actividadOpt.get();

            // Verificar que la actividad esté terminada
            if (!actividad.getFechaTermino().isBefore(LocalDate.now())) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Solo se pueden evaluar actividades terminadas");
                return ResponseEntity.badRequest().body(error);
            }

            // Crear y guardar la nueva nota
            Nota nuevaNota = new Nota(valorNota, actividad);
            notaRepository.save(nuevaNota);

            // Calcular el nuevo promedio
            Double promedio = notaRepository.findPromedioNotasByActividadId(actividadId);
            Long cantidadNotas = notaRepository.countNotasByActividadId(actividadId);

            response.put("success", true);
            response.put("promedio", promedio != null ? String.format("%.2f", promedio) : "-");
            response.put("cantidadNotas", cantidadNotas);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error interno del servidor: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    // API REST para obtener el promedio actualizado de una actividad
    @GetMapping("/api/{id}/promedio")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> obtenerPromedio(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();

        try {
            Double promedio = notaRepository.findPromedioNotasByActividadId(id);
            Long cantidadNotas = notaRepository.countNotasByActividadId(id);

            response.put("promedio", promedio != null ? String.format("%.2f", promedio) : "-");
            response.put("cantidadNotas", cantidadNotas);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error al obtener el promedio");
            return ResponseEntity.internalServerError().body(error);
        }
    }
}
