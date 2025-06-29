package com.actividad.repository;

import com.actividad.model.Actividad;
import com.actividad.dto.ActividadConNotaDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Long> {

    @Query("SELECT new com.actividad.dto.ActividadConNotaDTO(" +
           "a.id, a.nombre, a.descripcion, a.fechaInicio, a.fechaTermino, " +
           "a.horaInicio, a.horaTermino, a.tipo, a.lugar, a.direccion, a.comunaId, " +
           "AVG(CAST(n.nota AS double)), COUNT(n.nota)) " +
           "FROM Actividad a LEFT JOIN a.notas n " +
           "WHERE a.fechaTermino < :fechaActual " +
           "GROUP BY a.id, a.nombre, a.descripcion, a.fechaInicio, a.fechaTermino, " +
           "a.horaInicio, a.horaTermino, a.tipo, a.lugar, a.direccion, a.comunaId")
    List<ActividadConNotaDTO> findActividadesTerminadasConNotas(LocalDate fechaActual);

    @Query("SELECT a FROM Actividad a WHERE a.fechaTermino < :fechaActual")
    List<Actividad> findActividadesTerminadas(LocalDate fechaActual);
}
