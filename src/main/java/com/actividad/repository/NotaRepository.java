package com.actividad.repository;

import com.actividad.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Integer> {  // Cambiado de Long a Integer

    @Query("SELECT AVG(CAST(n.nota AS double)) FROM Nota n WHERE n.actividad.id = :actividadId")
    Double findPromedioNotasByActividadId(@Param("actividadId") Integer actividadId);  // Cambiado de Long a Integer

    @Query("SELECT COUNT(n) FROM Nota n WHERE n.actividad.id = :actividadId")
    Long countNotasByActividadId(@Param("actividadId") Integer actividadId);  // Cambiado de Long a Integer
}
