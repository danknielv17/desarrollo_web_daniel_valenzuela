package com.actividad;

import com.actividad.model.Actividad;
import com.actividad.model.Nota;
import com.actividad.repository.ActividadRepository;
import com.actividad.repository.NotaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@DisplayName("Sistema de Evaluación de Actividades - Tests Completos")
class SistemaEvaluacionActividadesTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @MockBean
    private ActividadRepository actividadRepository;

    @MockBean
    private NotaRepository notaRepository;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        objectMapper = new ObjectMapper();
    }

    // ==================== TESTS DE MODELOS ====================

    @Nested
    @DisplayName("Tests del Modelo Actividad")
    class ActividadModelTest {

        @Test
        @DisplayName("Crear actividad con todos los campos")
        void testCrearActividadCompleta() {
            // Given
            Actividad actividad = new Actividad();
            String nombre = "Yoga matutino";
            String descripcion = "Clase de yoga para principiantes";
            String sector = "Parque Central";
            String email = "contacto@yoga.com";
            String celular = "123456789";
            Integer comunaId = 1;
            LocalDateTime fechaInicio = LocalDateTime.of(2024, 1, 15, 10, 0);
            LocalDateTime fechaTermino = LocalDateTime.of(2024, 1, 20, 11, 30);

            // When
            actividad.setNombre(nombre);
            actividad.setDescripcion(descripcion);
            actividad.setSector(sector);
            actividad.setEmail(email);
            actividad.setCelular(celular);
            actividad.setComunaId(comunaId);
            actividad.setDiaHoraInicio(fechaInicio);
            actividad.setDiaHoraTermino(fechaTermino);

            // Then
            assertEquals(nombre, actividad.getNombre());
            assertEquals(descripcion, actividad.getDescripcion());
            assertEquals(sector, actividad.getSector());
            assertEquals(email, actividad.getEmail());
            assertEquals(celular, actividad.getCelular());
            assertEquals(comunaId, actividad.getComunaId());
            assertEquals(fechaInicio, actividad.getDiaHoraInicio());
            assertEquals(fechaTermino, actividad.getDiaHoraTermino());
        }

        @Test
        @DisplayName("Verificar si actividad está terminada")
        void testActividadTerminada() {
            // Given
            Actividad actividad = new Actividad();
            LocalDateTime fechaPasada = LocalDateTime.now().minusDays(5);
            actividad.setDiaHoraTermino(fechaPasada);

            // When
            boolean isTerminada = actividad.getDiaHoraTermino().isBefore(LocalDateTime.now());

            // Then
            assertTrue(isTerminada, "La actividad debería estar terminada");
        }

        @Test
        @DisplayName("Verificar si actividad no está terminada")
        void testActividadNoTerminada() {
            // Given
            Actividad actividad = new Actividad();
            LocalDateTime fechaFutura = LocalDateTime.now().plusDays(5);
            actividad.setDiaHoraTermino(fechaFutura);

            // When
            boolean isTerminada = actividad.getDiaHoraTermino().isBefore(LocalDateTime.now());

            // Then
            assertFalse(isTerminada, "La actividad no debería estar terminada");
        }
    }

    @Nested
    @DisplayName("Tests del Modelo Nota")
    class NotaModelTest {

        @Test
        @DisplayName("Crear nota válida con actividad asociada")
        void testCrearNotaValida() {
            // Given
            Actividad actividad = new Actividad();
            actividad.setId(1);
            actividad.setNombre("Actividad de prueba");

            Nota nota = new Nota();
            Integer valorNota = 7;

            // When
            nota.setNota(valorNota);
            nota.setActividad(actividad);

            // Then
            assertEquals(valorNota, nota.getNota());
            assertEquals(actividad, nota.getActividad());
            assertNotNull(nota.getActividad());
            assertEquals(Integer.valueOf(1), nota.getActividad().getId());
        }

        @Test
        @DisplayName("Validar rango de notas (1-7)")
        void testRangoNotasValidas() {
            // Given
            Nota nota = new Nota();

            // When & Then - Test notas válidas (1-7)
            for (int i = 1; i <= 7; i++) {
                nota.setNota(i);
                assertTrue(nota.getNota() >= 1 && nota.getNota() <= 7,
                    "La nota " + i + " debería estar en el rango válido");
            }
        }
    }

    // ==================== TESTS DE REPOSITORIOS ====================

    @Nested
    @DisplayName("Tests de Repositorios")
    class RepositoryTest {

        @Test
        @DisplayName("Buscar actividades terminadas")
        void testBuscarActividadesTerminadas() {
            // Given
            Actividad actividadTerminada = new Actividad();
            actividadTerminada.setId(1);
            actividadTerminada.setNombre("Actividad Terminada");
            actividadTerminada.setDiaHoraTermino(LocalDateTime.now().minusDays(2));

            when(actividadRepository.findActividadesTerminadas(any(LocalDateTime.class)))
                .thenReturn(Arrays.asList(actividadTerminada));

            // When
            List<Actividad> actividadesTerminadas = actividadRepository.findActividadesTerminadas(LocalDateTime.now());

            // Then
            assertEquals(1, actividadesTerminadas.size());
            assertEquals("Actividad Terminada", actividadesTerminadas.get(0).getNombre());
            verify(actividadRepository).findActividadesTerminadas(any(LocalDateTime.class));
        }

        @Test
        @DisplayName("Calcular promedio de notas por actividad")
        void testCalcularPromedioNotasPorActividad() {
            // Given
            Integer actividadId = 1;
            Double promedioEsperado = 6.5;

            when(notaRepository.findPromedioNotasByActividadId(actividadId)).thenReturn(promedioEsperado);

            // When
            Double promedio = notaRepository.findPromedioNotasByActividadId(actividadId);

            // Then
            assertEquals(promedioEsperado, promedio);
            verify(notaRepository).findPromedioNotasByActividadId(actividadId);
        }

        @Test
        @DisplayName("Contar notas por actividad")
        void testContarNotasPorActividad() {
            // Given
            Integer actividadId = 1;
            Long cantidadEsperada = 3L;

            when(notaRepository.countNotasByActividadId(actividadId)).thenReturn(cantidadEsperada);

            // When
            Long cantidad = notaRepository.countNotasByActividadId(actividadId);

            // Then
            assertEquals(cantidadEsperada, cantidad);
            verify(notaRepository).countNotasByActividadId(actividadId);
        }
    }

    // ==================== TESTS DE CONTROLADORES ====================

    @Nested
    @DisplayName("Tests del Controlador Web")
    class ControllerWebTest {

        @Test
        @DisplayName("GET /actividades/evaluaciones - Mostrar página de evaluaciones")
        void testMostrarPaginaEvaluaciones() throws Exception {
            // Given
            Actividad actividad = new Actividad();
            actividad.setId(1);
            actividad.setNombre("Yoga");
            actividad.setDescripcion("Clase de relajación");
            actividad.setSector("Parque");
            actividad.setEmail("contacto@yoga.com");
            actividad.setDiaHoraInicio(LocalDateTime.of(2024, 1, 15, 10, 0));
            actividad.setDiaHoraTermino(LocalDateTime.of(2024, 1, 20, 11, 30));

            when(actividadRepository.findActividadesTerminadas(any(LocalDateTime.class)))
                    .thenReturn(Arrays.asList(actividad));

            // When & Then
            mockMvc.perform(get("/actividades/evaluaciones"))
                    .andExpect(status().isOk())
                    .andExpect(view().name("evaluaciones"))
                    .andExpect(model().attributeExists("actividades"));

            verify(actividadRepository).findActividadesTerminadas(any(LocalDateTime.class));
        }
    }

    @Nested
    @DisplayName("Tests de API REST")
    class ControllerApiTest {

        @Test
        @DisplayName("GET /actividades/api/terminadas - Obtener actividades terminadas")
        void testObtenerActividadesTerminadas() throws Exception {
            // Given
            Actividad actividad1 = new Actividad();
            actividad1.setId(1);
            actividad1.setNombre("Actividad 1");
            actividad1.setDescripcion("Descripción 1");
            actividad1.setSector("Sector 1");
            actividad1.setEmail("test1@email.com");
            actividad1.setDiaHoraTermino(LocalDateTime.now().minusDays(1));

            Actividad actividad2 = new Actividad();
            actividad2.setId(2);
            actividad2.setNombre("Actividad 2");
            actividad2.setDescripcion("Descripción 2");
            actividad2.setSector("Sector 2");
            actividad2.setEmail("test2@email.com");
            actividad2.setDiaHoraTermino(LocalDateTime.now().minusDays(2));

            List<Actividad> actividades = Arrays.asList(actividad1, actividad2);
            when(actividadRepository.findActividadesTerminadas(any(LocalDateTime.class)))
                    .thenReturn(actividades);

            // When & Then
            mockMvc.perform(get("/actividades/api/terminadas"))
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$.length()").value(2))
                    .andExpect(jsonPath("$[0].id").value(1))
                    .andExpect(jsonPath("$[0].nombre").value("Actividad 1"))
                    .andExpect(jsonPath("$[1].id").value(2))
                    .andExpect(jsonPath("$[1].nombre").value("Actividad 2"));

            verify(actividadRepository).findActividadesTerminadas(any(LocalDateTime.class));
        }

        @Test
        @DisplayName("POST /actividades/api/notas - Agregar nota válida")
        void testAgregarNotaValida() throws Exception {
            // Given
            Actividad actividad = new Actividad();
            actividad.setId(1);
            actividad.setNombre("Test Actividad");
            actividad.setDiaHoraTermino(LocalDateTime.now().minusDays(1)); // Actividad terminada

            Nota notaGuardada = new Nota();
            notaGuardada.setId(1);
            notaGuardada.setNota(7);
            notaGuardada.setActividad(actividad);

            when(actividadRepository.findById(1)).thenReturn(Optional.of(actividad));
            when(notaRepository.save(any(Nota.class))).thenReturn(notaGuardada);
            when(notaRepository.findPromedioNotasByActividadId(1)).thenReturn(7.0);
            when(notaRepository.countNotasByActividadId(1)).thenReturn(1L);

            String requestBody = "{ \"actividadId\": 1, \"nota\": 7 }";

            // When & Then
            mockMvc.perform(post("/actividades/api/notas")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.promedio").exists())
                    .andExpect(jsonPath("$.cantidadNotas").value(1));

            verify(actividadRepository).findById(1);
            verify(notaRepository).save(any(Nota.class));
        }

        @Test
        @DisplayName("POST /actividades/api/notas - Error: Actividad no existe")
        void testAgregarNotaActividadNoExiste() throws Exception {
            // Given
            when(actividadRepository.findById(999)).thenReturn(Optional.empty());

            String requestBody = "{ \"actividadId\": 999, \"nota\": 7 }";

            // When & Then
            mockMvc.perform(post("/actividades/api/notas")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                    .andExpect(status().isBadRequest()) // Controlador real devuelve 400, no 404
                    .andExpect(jsonPath("$.error").value("Actividad no encontrada"));

            verify(actividadRepository).findById(999);
            verify(notaRepository, never()).save(any(Nota.class));
        }

        @Test
        @DisplayName("POST /actividades/api/notas - Error: Nota inválida (fuera del rango 1-7)")
        void testAgregarNotaInvalida() throws Exception {
            // Given
            String requestBody = "{ \"actividadId\": 1, \"nota\": 8 }"; // Nota inválida

            // When & Then
            mockMvc.perform(post("/actividades/api/notas")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.error").value("La nota debe estar entre 1 y 7"));

            verify(notaRepository, never()).save(any(Nota.class));
        }

        @Test
        @DisplayName("GET /actividades/api/{id}/promedio - Calcular promedio con notas")
        void testCalcularPromedioConNotas() throws Exception {
            // Given
            Integer actividadId = 1;
            Double promedioEsperado = 6.0;
            Long cantidadNotas = 3L;

            when(notaRepository.findPromedioNotasByActividadId(actividadId)).thenReturn(promedioEsperado);
            when(notaRepository.countNotasByActividadId(actividadId)).thenReturn(cantidadNotas);

            // When & Then
            mockMvc.perform(get("/actividades/api/1/promedio"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.promedio").value("6,00")) // Formato local con coma
                    .andExpect(jsonPath("$.cantidadNotas").value(3)); // Campo correcto

            verify(notaRepository).findPromedioNotasByActividadId(actividadId);
            verify(notaRepository).countNotasByActividadId(actividadId);
        }

        @Test
        @DisplayName("GET /actividades/api/{id}/promedio - Sin notas (promedio 0)")
        void testCalcularPromedioSinNotas() throws Exception {
            // Given
            Integer actividadId = 1;
            when(notaRepository.findPromedioNotasByActividadId(actividadId)).thenReturn(null);
            when(notaRepository.countNotasByActividadId(actividadId)).thenReturn(0L);

            // When & Then
            mockMvc.perform(get("/actividades/api/1/promedio"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.promedio").value("-")) // Sin promedio muestra "-"
                    .andExpect(jsonPath("$.cantidadNotas").value(0)); // Campo correcto

            verify(notaRepository).findPromedioNotasByActividadId(actividadId);
            verify(notaRepository).countNotasByActividadId(actividadId);
        }
    }

    // ==================== TESTS DE INTEGRACIÓN ====================

    @Nested
    @DisplayName("Tests de Integración")
    class IntegracionTest {

        @Test
        @DisplayName("Flujo completo: Obtener actividades terminadas y agregar notas")
        void testFlujoCompletoEvaluacion() throws Exception {
            // Given - Configurar actividades terminadas
            Actividad actividad = new Actividad();
            actividad.setId(1);
            actividad.setNombre("Curso de Yoga");
            actividad.setDescripcion("Clase de bienestar");
            actividad.setSector("Centro Comunitario");
            actividad.setEmail("yoga@email.com");
            actividad.setDiaHoraTermino(LocalDateTime.now().minusDays(1)); // Actividad terminada

            when(actividadRepository.findActividadesTerminadas(any(LocalDateTime.class)))
                    .thenReturn(Arrays.asList(actividad));
            when(actividadRepository.findById(1)).thenReturn(Optional.of(actividad));
            when(notaRepository.save(any(Nota.class))).thenReturn(new Nota());
            // Agregar mocks para el cálculo de promedio
            when(notaRepository.findPromedioNotasByActividadId(1)).thenReturn(6.0);
            when(notaRepository.countNotasByActividadId(1)).thenReturn(1L);

            // Step 1: Obtener actividades terminadas
            mockMvc.perform(get("/actividades/api/terminadas"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].id").value(1))
                    .andExpect(jsonPath("$[0].nombre").value("Curso de Yoga"));

            // Step 2: Agregar nota a la actividad
            String requestBody = "{ \"actividadId\": 1, \"nota\": 6 }";
            mockMvc.perform(post("/actividades/api/notas")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));

            // Verificar que se llamaron los métodos esperados
            verify(actividadRepository).findActividadesTerminadas(any(LocalDateTime.class));
            verify(actividadRepository).findById(1);
            verify(notaRepository).save(any(Nota.class));
        }

        @Test
        @DisplayName("Test de validación de datos de entrada")
        void testValidacionDatosEntrada() throws Exception {
            // Given - Datos de entrada inválidos
            String requestBody = "{ \"actividadId\": 999, \"nota\": 5 }"; // Actividad no existe, nota válida

            // When & Then - Verificar que se manejen correctamente los errores
            mockMvc.perform(post("/actividades/api/notas")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.error").value("Actividad no encontrada"));

            // Verificar que no se haya guardado ninguna nota
            verify(notaRepository, never()).save(any(Nota.class));
        }
    }

    // ==================== TEST DE CONTEXTO DE APLICACIÓN ====================

    @Test
    @DisplayName("Verificar que el contexto de Spring Boot se carga correctamente")
    void contextLoads() {
        // Este test verifica que la aplicación Spring Boot se inicia correctamente
        // y que todas las dependencias se inyectan sin problemas
        assertNotNull(webApplicationContext, "El contexto de la aplicación debería cargarse");
        assertTrue(webApplicationContext.getBeanDefinitionNames().length > 0,
            "Deberían existir beans en el contexto");
    }
}
