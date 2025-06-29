package com.actividad.repository;

import com.actividad.model.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Integer> {

    @Query("SELECT a FROM Actividad a WHERE a.diaHoraTermino < :fechaActual")
    List<Actividad> findActividadesTerminadas(@Param("fechaActual") LocalDateTime fechaActual);
}
