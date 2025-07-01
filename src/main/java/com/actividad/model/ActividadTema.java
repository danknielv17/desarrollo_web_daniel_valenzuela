package com.actividad.model;

import jakarta.persistence.*;

@Entity
@Table(name = "actividad_tema")
public class ActividadTema {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "actividad_id", nullable = false)
    private Integer actividadId;

    @Column(name = "tema", nullable = false, length = 100)
    private String tema;

    @Column(name = "glosa_otro", length = 100)
    private String glosaOtro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actividad_id", insertable = false, updatable = false)
    private Actividad actividad;

    // Constructores
    public ActividadTema() {}

    public ActividadTema(Integer actividadId, String tema, String glosaOtro) {
        this.actividadId = actividadId;
        this.tema = tema;
        this.glosaOtro = glosaOtro;
    }

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getActividadId() { return actividadId; }
    public void setActividadId(Integer actividadId) { this.actividadId = actividadId; }

    public String getTema() { return tema; }
    public void setTema(String tema) { this.tema = tema; }

    public String getGlosaOtro() { return glosaOtro; }
    public void setGlosaOtro(String glosaOtro) { this.glosaOtro = glosaOtro; }

    public Actividad getActividad() { return actividad; }
    public void setActividad(Actividad actividad) { this.actividad = actividad; }

    // Método helper para obtener el tema completo
    public String getTemaCompleto() {
        if ("otro".equals(tema) && glosaOtro != null && !glosaOtro.trim().isEmpty()) {
            return glosaOtro;
        }
        return tema;
    }
}
