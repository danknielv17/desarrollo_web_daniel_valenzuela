package com.actividad.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "actividad")
public class Actividad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 200)
    private String nombre;

    @Column(name = "descripcion", nullable = false, length = 500)
    private String descripcion;

    @Column(name = "dia_hora_inicio", nullable = false)
    private LocalDateTime diaHoraInicio;

    @Column(name = "dia_hora_termino")
    private LocalDateTime diaHoraTermino;

    @Column(name = "comuna_id")
    private Integer comunaId;

    @Column(name = "sector", length = 100)
    private String sector;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "celular", length = 15)
    private String celular;

    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Nota> notas;

    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ActividadTema> temas;

    // Constructores
    public Actividad() {}

    public Actividad(String nombre, String descripcion, LocalDateTime diaHoraInicio,
                    LocalDateTime diaHoraTermino, Integer comunaId, String sector,
                    String email, String celular) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.diaHoraInicio = diaHoraInicio;
        this.diaHoraTermino = diaHoraTermino;
        this.comunaId = comunaId;
        this.sector = sector;
        this.email = email;
        this.celular = celular;
    }

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDateTime getDiaHoraInicio() { return diaHoraInicio; }
    public void setDiaHoraInicio(LocalDateTime diaHoraInicio) { this.diaHoraInicio = diaHoraInicio; }

    public LocalDateTime getDiaHoraTermino() { return diaHoraTermino; }
    public void setDiaHoraTermino(LocalDateTime diaHoraTermino) { this.diaHoraTermino = diaHoraTermino; }

    public Integer getComunaId() { return comunaId; }
    public void setComunaId(Integer comunaId) { this.comunaId = comunaId; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCelular() { return celular; }
    public void setCelular(String celular) { this.celular = celular; }

    public List<Nota> getNotas() { return notas; }
    public void setNotas(List<Nota> notas) { this.notas = notas; }

    public List<ActividadTema> getTemas() { return temas; }
    public void setTemas(List<ActividadTema> temas) { this.temas = temas; }

    // Métodos helper para compatibilidad con Thymeleaf
    public LocalDateTime getFechaInicio() { return diaHoraInicio; }
    public LocalDateTime getFechaTermino() { return diaHoraTermino; }

    public String getTipo() {
        if (temas != null && !temas.isEmpty()) {
            ActividadTema primerTema = temas.get(0);
            return primerTema.getTemaCompleto();
        }
        return "Sin tema";
    }

    public String getLugar() { return sector != null ? sector : ""; }
    public String getDireccion() { return ""; } // Valor por defecto
}
