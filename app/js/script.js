// ===== VALIDACIONES DEL FORMULARIO =====

// 1. Validar formato de teléfono móvil
function validarTelefono(telefono) {
    const regex = /^\+[0-9]{3}\.[0-9]{8}$/;
    return regex.test(telefono);
}

// 2. Manejar selección de "contactar por"
document.getElementById('contactar-por').addEventListener('change', function() {
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

// 3. Manejar selección de tema "otro"
document.getElementById('tema-actividad').addEventListener('change', function() {
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

// 4. Manejar fotos (máximo 5)
let photoCount = 1;
document.getElementById('agregar-foto').addEventListener('click', function() {
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
        this.disabled = true;
    }
});

// ===== MANEJO DEL FORMULARIO =====
document.getElementById('form-actividad').addEventListener('submit', function(e) {
    e.preventDefault();

    // Validar campos
    const telefono = document.getElementById('telefono-organizador').value;
    if (telefono && !validarTelefono(telefono)) {
        alert('Formato de teléfono inválido. Use +NNN.NNNNNNNN');
        return;
    }

    // Mostrar confirmación
    document.getElementById('mensaje-confirmacion').innerHTML = `
        <div class="confirmacion">
            <p>¿Está seguro que desea agregar esta actividad?</p>
            <button onclick="confirmarEnvio(true)">Sí, estoy seguro</button>
            <button onclick="confirmarEnvio(false)">No, quiero volver</button>
        </div>
    `;
});

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
        fotos: ['boxeo1.jpg', 'boxeo2.jpg'],
        organizador: 'Juan Pérez'
    }
    // Agregar más actividades según ejemplo
];

function mostrarDetalleActividad(id) {
    const actividad = actividadesEjemplo.find(a => a.id === id);
    const detalle = document.getElementById('detalle-actividad');

    detalle.innerHTML = `
        <h3>Detalle de la Actividad</h3>
        <p><strong>Inicio:</strong> ${actividad.inicio}</p>
        <p><strong>Término:</strong> ${actividad.termino || '-'}</p>
        <p><strong>Comuna:</strong> ${actividad.comuna}</p>
        <p><strong>Sector:</strong> ${actividad.sector}</p>
        <p><strong>Tema:</strong> ${actividad.tema}</p>
        <div class="galeria">
            ${actividad.fotos.map(foto => `
                <img src="img/${foto}" alt="Foto actividad" 
                     onclick="ampliarFoto('img/${foto}')">
            `).join('')}
        </div>
        <button onclick="volverAlListado()">Volver al Listado</button>
        <button onclick="volverAPortada()">Volver a la Portada</button>
    `;
    detalle.style.display = 'block';
}

// ===== LLENAR SELECTORES DE REGIÓN Y COMUNA =====

// Función para llenar el selector de regiones
function llenarRegiones() {
    const regionSelect = document.getElementById('region');
    region_comuna.regiones.forEach(region => {
        const opcion = document.createElement('option');
        opcion.value = region.numero;
        opcion.textContent = region.nombre;
        regionSelect.appendChild(opcion);
    });
}

// Función para llenar el selector de comunas según la región seleccionada
function llenarComunas(regionNumero) {
    const comunaSelect = document.getElementById('comuna');
    comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>'; // Limpiar opciones previas

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

// Evento para actualizar las comunas cuando se selecciona una región
document.getElementById('region').addEventListener('change', function() {
    llenarComunas(this.value);
});

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // Precargar regiones al cargar la página
    llenarRegiones();

    // Precargar fecha/hora en formulario
    const ahora = new Date();
    document.getElementById('inicio-actividad').value =
        ahora.toISOString().slice(0, 16);

    const termino = new Date(ahora.getTime() + 3 * 60 * 60 * 1000);
    document.getElementById('termino-actividad').value =
        termino.toISOString().slice(0, 16);
});


// ===== FUNCIONES DE NAVEGACIÓN =====
function volverAPortada() {
    window.location.href = '#portada';
}

function volverAlListado() {
    document.getElementById('detalle-actividad').style.display = 'none';
}

function ampliarFoto(url) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay-foto';
    overlay.innerHTML = `
        <div class="foto-ampliada">
            <img src="${url}" alt="Foto ampliada">
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

    // Cargar regiones y comunas
    cargarRegiones();
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
