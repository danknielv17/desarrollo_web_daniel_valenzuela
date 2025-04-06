// ===== MANEJO DE FORMULARIO =====

// Manejar selección de "contactar por"
function inicializarContactarPor() {
    const contactarPor = document.getElementById('contactar-por');
    if (contactarPor) {
        contactarPor.addEventListener('change', function() {
            const contactoExtra = document.getElementById('contacto-extra');
            if (this.value === 'otra') {
                contactoExtra.innerHTML = `
                    <label for="otro-contacto">Especifique contacto:</label>
                    <input type="text" id="otro-contacto" name="otro-contacto"
                           minlength="4" maxlength="50" required>
                `;
            } else {
                contactoExtra.innerHTML = '';
            }
        });
    }
}

// Manejar selección de tema "otro"
function inicializarTemaActividad() {
    const temaActividad = document.getElementById('tema-actividad');
    if (temaActividad) {
        temaActividad.addEventListener('change', function() {
            const temaExtra = document.getElementById('tema-extra');
            if (this.value === 'otro') {
                temaExtra.innerHTML = `
                    <label for="otro-tema">Especifique tema:</label>
                    <input type="text" id="otro-tema" name="otro-tema"
                           minlength="3" maxlength="15" required>
                `;
            } else {
                temaExtra.innerHTML = '';
            }
        });
    }
}

// Manejar fotos (limita la cantidad de inputs creados a 5)
function inicializarManejoDeFotos() {
    const btnAgregarFoto = document.getElementById('agregar-foto');
    if (btnAgregarFoto) {
        let photoCount = 1;
        btnAgregarFoto.addEventListener('click', function() {
            if (photoCount < 5) {
                const contenedorFotos = document.getElementById('contenedor-fotos');
                const nuevoInput = document.createElement('input');
                nuevoInput.type = 'file';
                nuevoInput.name = 'foto-actividad[]';
                nuevoInput.accept = '.jpg,.png,.jpeg,.gif';
                contenedorFotos.appendChild(nuevoInput);
                photoCount++;
            }
            if (photoCount === 5) {
            }
        });
    }
}

// Manejo del envío del formulario
function inicializarFormulario() {
    const formActividad = document.getElementById('form-actividad');
    if (formActividad) {
        formActividad.addEventListener('submit', function(e) {
            e.preventDefault();

            // 1. Validar teléfono
            const telefono = document.getElementById('telefono-organizador').value;
            if (telefono && !validarTelefono(telefono)) {
                alert('Formato de teléfono inválido. Use +NNN.NNNNNNNN');
                return;
            }

            // 2. Validar fechas
            const inicio = document.getElementById('inicio-actividad').value;
            const termino = document.getElementById('termino-actividad').value;
            if (!validarRangoFechas(inicio, termino)) {
                alert('La fecha/hora de inicio debe ser anterior a la de término.');
                return;
            }

            // 3. Validar longitud de "otro contacto" si aplica
            const otroContacto = document.getElementById('otro-contacto');
            if (otroContacto) {
                const valor = otroContacto.value.trim();
                if (!validarLongitud(valor, 4, 50)) {
                    alert('El contacto adicional debe tener entre 4 y 50 caracteres.');
                    return;
                }
            }

            // 4. Validar longitud de "otro tema" si aplica
            const otroTema = document.getElementById('otro-tema');
            if (otroTema) {
                const valor = otroTema.value.trim();
                if (!validarLongitud(valor, 3, 15)) {
                    alert('El tema adicional debe tener entre 3 y 15 caracteres.');
                    return;
                }
            }

            // 5. Validar cantidad de fotos
            const fotos = document.querySelectorAll('input[type="file"][name="foto-actividad[]"]');
            if (!validarCantidadFotos(fotos)) {
                alert('Solo puedes subir hasta 5 fotos.');
                return;
            }

            // Confirmación
            document.getElementById('mensaje-confirmacion').innerHTML = `
                <div class="confirmacion">
                    <p>¿Está seguro que desea agregar esta actividad?</p>
                    <button onclick="confirmarEnvio(true)">Sí, estoy seguro</button>
                    <button onclick="confirmarEnvio(false)">No, quiero volver</button>
                </div>
            `;
        });
    }
}


function confirmarEnvio(confirmado) {
    const mensaje = document.getElementById('mensaje-confirmacion');
    if (confirmado) {
        mensaje.innerHTML = `
            <div class="exito">
                <p>¡Hemos recibido su información! Muchas gracias y suerte en su actividad.</p>
                <button onclick="volverAPortada()">Volver a la Portada</button>
            </div>
        `;
        document.getElementById('form-actividad').reset();
    } else {
        mensaje.innerHTML = '';
    }
}

// ===== MANEJO DEL LISTADO DE ACTIVIDADES =====
const actividadesEjemplo = [
    {
        id: 1,
        inicio: '2025-03-28 12:00',
        termino: '2025-03-28 14:00',
        comuna: 'Santiago',
        sector: 'Beauchef 850, terraza',
        tema: 'Escuela de Boxeo',
        fotos: ['boxeo1.jpg', 'boxeo2.jpeg'],
        organizador: 'Juan Pérez'
    },
    {
        id: 2,
        inicio: '2025-03-29 19:00',
        termino: '2025-03-29 20:00',
        comuna: 'Ñuñoa',
        sector: 'Plaza',
        tema: 'Cómo deshidratar fruta',
        fotos: ['deshidratacion1.jpg', 'deshidratacion2.jpg', 'deshidratacion3.jpg'],
        organizador: 'María Gómez'
    },
    {
        id: 3,
        inicio: '2025-03-30 18:00',
        termino: null,
        comuna: 'Santiago',
        sector: 'Parque O\'higgins',
        tema: 'Música Urbana',
        fotos: ['musica1.jpg', "musica2.jpg"],
        organizador: 'Pedro López'
    },
    {
        id: 4,
        inicio: '2025-04-01 15:00',
        termino: '2025-04-01 17:00',
        comuna: 'Las Condes',
        sector: 'Gimnasio',
        tema: 'Clase de Yoga',
        fotos: ['yoga.jpg', 'yoga2.jpg'],
        organizador: 'Carlos Rodríguez'
    },
    {
        id: 5,
        inicio: '2025-03-30 11:00',
        termino: '2025-03-30 13:00',
        comuna: 'Santiago',
        sector: 'Beauchef 850, canchas',
        tema: 'Reunión G.O.',
        fotos: ['furs.jpg'],
        organizador: 'Grupo Beauchef Furs'
    }
];

function mostrarDetalleActividad(id) {
    const actividad = actividadesEjemplo.find(a => a.id === id);
    const detalle = document.getElementById('detalle-actividad');

    if (!actividad) {
        console.error(`No se encontró actividad con id ${id}`);
        return;
    }

    detalle.innerHTML = `
        <h3>Detalle de la Actividad</h3>
        <p><strong>Inicio:</strong> ${actividad.inicio}</p>
        <p><strong>Término:</strong> ${actividad.termino || '-'}</p>
        <p><strong>Comuna:</strong> ${actividad.comuna}</p>
        <p><strong>Sector:</strong> ${actividad.sector}</p>
        <p><strong>Tema:</strong> ${actividad.tema}</p>
        <p><strong>Organizador:</strong> ${actividad.organizador}</p>
        <div class="galeria">
            ${actividad.fotos.map(foto => `
                <img src="img/${foto}" alt="Foto actividad"
                     width="320" height="240"
                     onclick="ampliarFoto('img/${foto}')">
            `).join('')}
        </div>
        <button onclick="volverAlListado()">Volver al Listado</button>
        <button onclick="volverAPortada()">Volver a la Portada</button>
    `;
    detalle.style.display = 'block';
}

// ===== MANEJO DE REGIONES Y COMUNAS =====

// Función para llenar el selector de regiones
function llenarRegiones() {
    const regionSelect = document.getElementById('region');
    if (regionSelect && region_comuna && region_comuna.regiones) {
        region_comuna.regiones.forEach(region => {
            const opcion = document.createElement('option');
            opcion.value = region.numero;
            opcion.textContent = region.nombre;
            regionSelect.appendChild(opcion);
        });
    }
}

// Función para llenar el selector de comunas según la región seleccionada
function llenarComunas(regionNumero) {
    const comunaSelect = document.getElementById('comuna');
    if (!comunaSelect) return;

    comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>'; // Limpiar opciones previas

    if (region_comuna && region_comuna.regiones) {
        const regionSeleccionada = region_comuna.regiones.find(region => region.numero == regionNumero);
        if (regionSeleccionada) {
            regionSeleccionada.comunas.forEach(comuna => {
                const opcion = document.createElement('option');
                opcion.value = comuna.id;
                opcion.textContent = comuna.nombre;
                comunaSelect.appendChild(opcion);
            });
        }
    }
}

// Inicializar selector de regiones
function inicializarSelectorRegion() {
    const regionSelect = document.getElementById('region');
    if (regionSelect) {
        regionSelect.addEventListener('change', function() {
            llenarComunas(this.value);
        });
    }
}

// ===== FUNCIONES DE NAVEGACIÓN =====
function volverAPortada() {
    window.location.href = 'index.html';
}

function volverAlListado() {
    const detalle = document.getElementById('detalle-actividad');
    if (detalle) {
        detalle.style.display = 'none';
    }
}

function ampliarFoto(url) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay-foto';
    overlay.innerHTML = `
        <div class="foto-ampliada">
            <img src="${url}" alt="Foto ampliada" width="800" height="600">
            <button onclick="this.parentElement.parentElement.remove()">Cerrar</button>
        </div>
    `;
    document.body.appendChild(overlay);
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // Precargar fecha/hora en formulario
    const ahora = new Date();
    const inicioActividad = document.getElementById('inicio-actividad');
    if (inicioActividad) {
        inicioActividad.value = ahora.toISOString().slice(0, 16);
    }

    const terminoActividad = document.getElementById('termino-actividad');
    if (terminoActividad) {
        const termino = new Date(ahora.getTime() + 3*60*60*1000);
        terminoActividad.value = termino.toISOString().slice(0, 16);
    }

    // Inicializar formulario
    inicializarContactarPor();
    inicializarTemaActividad();
    inicializarManejoDeFotos();
    inicializarFormulario();

    // Cargar regiones y comunas
    llenarRegiones();
    inicializarSelectorRegion();

    // Inicializar botón "Agregar Actividad"
    const btnAgregarActividad = document.getElementById('btn-agregar-actividad');
    if (btnAgregarActividad) {
        btnAgregarActividad.addEventListener('click', function() {
            const seccionInformar = document.getElementById('informar-actividad');
            if (seccionInformar) {
                seccionInformar.style.display = 'block';
                seccionInformar.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});