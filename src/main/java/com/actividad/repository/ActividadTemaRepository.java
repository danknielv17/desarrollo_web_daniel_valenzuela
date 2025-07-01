package com.actividad.repository;

import com.actividad.model.ActividadTema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ActividadTemaRepository extends JpaRepository<ActividadTema, Integer> {

    @Query("SELECT at FROM ActividadTema at WHERE at.actividadId = :actividadId")
    List<ActividadTema> findByActividadId(@Param("actividadId") Integer actividadId);

    @Query("SELECT at FROM ActividadTema at WHERE at.actividadId = :actividadId ORDER BY at.id ASC")
    Optional<ActividadTema> findFirstByActividadId(@Param("actividadId") Integer actividadId);
}
