package com.actividad.repository;

import com.actividad.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Long> {

    @Query("SELECT AVG(CAST(n.nota AS double)) FROM Nota n WHERE n.actividad.id = :actividadId")
    Double findPromedioNotasByActividadId(@Param("actividadId") Long actividadId);

    @Query("SELECT COUNT(n) FROM Nota n WHERE n.actividad.id = :actividadId")
    Long countNotasByActividadId(@Param("actividadId") Long actividadId);
}
