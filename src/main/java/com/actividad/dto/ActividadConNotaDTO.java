package com.actividad.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ActividadConNotaDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private LocalDate fechaInicio;
    private LocalDate fechaTermino;
    private LocalTime horaInicio;
    private LocalTime horaTermino;
    private String tipo;
    private String lugar;
    private String direccion;
    private Integer comunaId;
    private String notaPromedio;
    private Long cantidadNotas;

    // Constructores
    public ActividadConNotaDTO() {}

    public ActividadConNotaDTO(Long id, String nombre, String descripcion,
                              LocalDate fechaInicio, LocalDate fechaTermino,
                              LocalTime horaInicio, LocalTime horaTermino,
                              String tipo, String lugar, String direccion,
                              Integer comunaId, Double promedio, Long cantidadNotas) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fechaInicio = fechaInicio;
        this.fechaTermino = fechaTermino;
        this.horaInicio = horaInicio;
        this.horaTermino = horaTermino;
        this.tipo = tipo;
        this.lugar = lugar;
        this.direccion = direccion;
        this.comunaId = comunaId;
        this.notaPromedio = promedio != null ? String.format("%.2f", promedio) : "-";
        this.cantidadNotas = cantidadNotas != null ? cantidadNotas : 0L;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDate getFechaTermino() { return fechaTermino; }
    public void setFechaTermino(LocalDate fechaTermino) { this.fechaTermino = fechaTermino; }

    public LocalTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalTime horaInicio) { this.horaInicio = horaInicio; }

    public LocalTime getHoraTermino() { return horaTermino; }
    public void setHoraTermino(LocalTime horaTermino) { this.horaTermino = horaTermino; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getLugar() { return lugar; }
    public void setLugar(String lugar) { this.lugar = lugar; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public Integer getComunaId() { return comunaId; }
    public void setComunaId(Integer comunaId) { this.comunaId = comunaId; }

    public String getNotaPromedio() { return notaPromedio; }
    public void setNotaPromedio(String notaPromedio) { this.notaPromedio = notaPromedio; }

    public Long getCantidadNotas() { return cantidadNotas; }
    public void setCantidadNotas(Long cantidadNotas) { this.cantidadNotas = cantidadNotas; }
}
