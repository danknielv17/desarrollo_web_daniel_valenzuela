/****************************************************
 * GESTIÓN DE ACTIVIDADES RECREATIVAS
 * Archivo principal de JavaScript
 ****************************************************/

// ===== ACTIVIDADES DE EJEMPLO LISTADO =====
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

// ===== FUNCIONES DE NAVEGACIÓN =====
function volverAPortada() {
    window.location.href = 'index.html';
}

function volverAlListado() {
    window.location.href = 'listado.html';
}

function mostrarDetalleActividad(id) {
    window.location.href = `informacion-actividad.html?id=${id}`;
}

// ===== MANEJO DE VISUALIZACIÓN =====
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

function cargarDetalleActividad() {
    const detalleDiv = document.getElementById('detalle-actividad');
    if (!detalleDiv) return;

    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));

    if (id) {
        const actividad = actividadesEjemplo.find(a => a.id === id);

        if (actividad) {
            detalleDiv.innerHTML = `
                <h3>${actividad.tema}</h3>
                <p><strong>Inicio:</strong> ${actividad.inicio}</p>
                <p><strong>Término:</strong> ${actividad.termino || '-'}</p>
                <p><strong>Comuna:</strong> ${actividad.comuna}</p>
                <p><strong>Sector:</strong> ${actividad.sector}</p>
                <p><strong>Organizador:</strong> ${actividad.organizador}</p>
                <div class="galeria">
                    ${actividad.fotos.map(foto => `
                        <img src="img/${foto}" alt="Foto actividad"
                            width="320" height="240"
                            onclick="ampliarFoto('img/${foto}')">
                    `).join('')}
                </div>
            `;
        } else {
            detalleDiv.innerHTML = '<p>No se encontró la actividad solicitada.</p>';
        }
    } else {
        detalleDiv.innerHTML = '<p>No se especificó una actividad para mostrar.</p>';
    }
}

// ===== MANEJO DE REGIONES Y COMUNAS =====
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

function llenarComunas(regionNumero) {
    const comunaSelect = document.getElementById('comuna');
    if (!comunaSelect) return;

    comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';

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

function inicializarSelectorRegion() {
    const regionSelect = document.getElementById('region');
    if (regionSelect) {
        regionSelect.addEventListener('change', function() {
            llenarComunas(this.value);
        });
    }
}

// ===== MANEJO DE FORMULARIO =====
function inicializarContactarPor() {
    const contactarPor = document.getElementById('contactar-por');
    if (contactarPor) {
        contactarPor.addEventListener('change', function() {
            const contactoExtra = document.getElementById('contacto-extra');

            if (this.value) { // Si se seleccionó cualquier opción (no está vacío)
                let placeholder = '';
                let label = '';

                // Label y placeholder según la red social seleccionada
                switch(this.value) {
                    case 'whatsapp':
                        label = 'Número de WhatsApp:';
                        placeholder = 'Ej: +569.12345678';
                        break;
                    case 'telegram':
                        label = 'Usuario de Telegram:';
                        placeholder = 'Ej: @usuario';
                        break;
                    case 'x':
                        label = 'Usuario de X (Twitter):';
                        placeholder = 'Ej: @usuario';
                        break;
                    case 'instagram':
                        label = 'Usuario de Instagram:';
                        placeholder = 'Ej: @usuario';
                        break;
                    case 'tiktok':
                        label = 'Usuario de TikTok:';
                        placeholder = 'Ej: @usuario';
                        break;
                    case 'otra':
                        label = 'Especifique contacto:';
                        placeholder = 'Usuario/URL red socual';
                        break;
                }

                contactoExtra.innerHTML = `
                    <label for="otro-contacto">${label}</label>
                    <input type="text" id="otro-contacto" name="otro-contacto"
                           minlength="4" maxlength="50" 
                           placeholder="${placeholder}" required>
                `;
            } else {
                // Si no se ha seleccionado ninguna opción, limpiar el contenedor
                contactoExtra.innerHTML = '';
            }
        });
    }
}

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
        });
    }
}

function confirmarEnvio(confirmado) {
    const mensaje = document.getElementById('mensaje-confirmacion');
    if (confirmado) {
        alert('¡Hemos recibido su información! Muchas gracias y suerte en su actividad.')
        mensaje.innerHTML = `
            <div class="exito">
                <p>¡Hemos recibido su información!</p>
                <button onclick="volverAPortada()">Volver a la Portada</button>
            </div>
        `;
        document.getElementById('form-actividad').reset();
    } else {
        mensaje.innerHTML = '';
    }
}

function inicializarFormulario() {
    const formActividad = document.getElementById('form-actividad');
    if (formActividad) {
        formActividad.addEventListener('submit', function(e) {
            e.preventDefault();

            // 1. Validar nombre organizador
            const nombreOrganizador = document.getElementById('nombre-organizador').value;
            if (!validarNombre(nombreOrganizador)) {
                alert('El nombre del organizador debe tener al menos 4 caracteres y solo puede contener letras.');
                return;
            }

            // 2. Validar email
            const email = document.getElementById('email-organizador').value;
            if (!validarEmail(email)) {
                alert('El email es obligatorio y debe tener un formato válido.');
                return;
            }

            // 3. Validar teléfono
            const telefono = document.getElementById('telefono-organizador').value;
            if (telefono && !validarTelefono(telefono)) {
                alert('Formato de teléfono inválido. Use +NNN.NNNNNNNN');
                return;
            }

            // 4. Validar fechas
            // Validar que la fecha de inicio existe y tiene formato válido
            const inicio = document.getElementById('inicio-actividad').value;
            if (!validarFormatoFecha(inicio)) {
                alert('La fecha de inicio es obligatoria y debe tener un formato válido (YYYY-MM-DD HH:MM).');
                return;
            }

            // Validar la fecha de término si está presente
            const termino = document.getElementById('termino-actividad').value;
            if (termino && !validarFormatoFecha(termino)) {
                alert('La fecha de término debe tener un formato válido (YYYY-MM-DD HH:MM).');
                return;
            }

            // Validar rango de fechas
            if (termino && !validarRangoFechas(inicio, termino)) {
                alert('La fecha/hora de inicio debe ser anterior a la de término.');
                return;
            }

            // 5. Validar longitud de "otro contacto" si aplica
            const otroContacto = document.getElementById('otro-contacto');
            if (otroContacto) {
                const valor = otroContacto.value.trim();
                if (!validarLongitud(valor, 4, 50)) {
                    alert('El contacto adicional debe tener entre 4 y 50 caracteres.');
                    return;
                }
            }

            // 6. Validar longitud de "otro tema" si aplica
            const otroTema = document.getElementById('otro-tema');
            if (otroTema) {
                const valor = otroTema.value.trim();
                if (!validarLongitud(valor, 3, 15)) {
                    alert('El tema adicional debe tener entre 3 y 15 caracteres.');
                    return;
                }
            }

            // 7. Validar cantidad de fotos
            const fotos = document.querySelectorAll('input[type="file"][name="foto-actividad[]"]');
            if (!validarCantidadFotos(fotos, 1, 5)) {
                if (fotos.length === 0 || [...fotos].every(input => input.files.length === 0)) {
                    alert('Debe subir al menos una foto.');
                } else {
                    alert('Solo se permiten hasta 5 fotos.');
                }
                return;
            }

            // 8. Validar región y comuna
            const region = document.getElementById('region').value;
            if (!region) {
                alert('Debe seleccionar una región.');
                return;
            }

            const comuna = document.getElementById('comuna').value;
            if (!comuna) {
                alert('Debe seleccionar una comuna.');
                return;
            }

            // Confirmación
            document.getElementById('mensaje-confirmacion').innerHTML = `
                <div class="confirmacion">
                    <p>¿Está seguro que desea agregar esta actividad?</p>
                    <button onclick="confirmarEnvio(true)">Sí, estoy seguro</button>
                    <button onclick="confirmarEnvio(false)">No, no estoy seguro, quiero volver al formulario</button>
                </div>
            `;
        });
    }
}

function inicializarBtnAgregarActividad() {
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
}

function precargarFechas() {
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
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // Precarga de datos en formularios
    precargarFechas();

    // Inicialización de formularios
    inicializarContactarPor();
    inicializarTemaActividad();
    inicializarManejoDeFotos();
    inicializarFormulario();
    inicializarBtnAgregarActividad();

    // Inicialización de selector de regiones
    llenarRegiones();
    inicializarSelectorRegion();

    // Carga de detalles de actividad
    cargarDetalleActividad();
});