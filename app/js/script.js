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

// ===== CARGAR REGIONES Y COMUNAS =====
document.addEventListener('DOMContentLoaded', function() {
    // Cargar las regiones en el desplegable
    const regionSelect = document.getElementById('region');
    
    if (regionSelect) {
        // Verificar que exista la variable region_comuna
        if (typeof region_comuna !== 'undefined') {
            // Limpiar el select
            regionSelect.innerHTML = '<option value="">Seleccione una región</option>';
            
            // Agregar cada región como una opción
            region_comuna.regiones.forEach(region => {
                const option = document.createElement('option');
                option.value = region.numero;
                option.textContent = region.nombre;
                regionSelect.appendChild(option);
            });
            
            // Configurar el evento para cargar comunas al seleccionar región
            regionSelect.addEventListener('change', cargarComunas);
        } else {
            console.error('El objeto region_comuna no está disponible');
        }
    }
});

// Función para cargar las comunas según la región seleccionada
function cargarComunas() {
    const regionId = document.getElementById('region').value;
    const comunaSelect = document.getElementById('comuna');
    
    // Limpiar el select de comunas
    comunaSelect.innerHTML = '';
    
    // Si no hay región seleccionada, mostrar mensaje por defecto
    if (!regionId) {
        comunaSelect.innerHTML = '<option value="">Seleccione primero una región</option>';
        return;
    }
    
    // Buscar la región seleccionada
    const regionSeleccionada = region_comuna.regiones.find(r => r.numero == regionId);
    
    // Si no se encuentra la región, mostrar mensaje de error
    if (!regionSeleccionada) {
        comunaSelect.innerHTML = '<option value="">Error al cargar comunas</option>';
        return;
    }
    
    // Agregar opción por defecto
    comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
    
    // Agregar cada comuna de la región como una opción
    regionSeleccionada.comunas.forEach(comuna => {
        const option = document.createElement('option');
        option.value = comuna.id;
        option.textContent = comuna.nombre;
        comunaSelect.appendChild(option);
    });
}

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

// ===== NAVEGACIÓN ENTRE SECCIONES =====
function mostrarSeccion(seccionId) {
    // Ocultar todas las secciones
    const secciones = document.querySelectorAll('main > section');
    secciones.forEach(seccion => {
        seccion.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    const seccionMostrar = document.getElementById(seccionId);
    if (seccionMostrar) {
        seccionMostrar.style.display = 'block';
    }
    
    // Actualizar clase activa en la navegación
    const enlaces = document.querySelectorAll('.nav-link');
    enlaces.forEach(enlace => {
        if (enlace.getAttribute('data-target') === seccionId) {
            enlace.classList.add('active');
        } else {
            enlace.classList.remove('active');
        }
    });
}

// Manejar los clics en los enlaces de navegación
document.addEventListener('DOMContentLoaded', function() {
    // Configurar enlaces de navegación
    const enlaces = document.querySelectorAll('.nav-link');
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            mostrarSeccion(targetId);
            history.pushState(null, null, `#${targetId}`);
        });
    });
    
    // Verificar si hay un hash en la URL al cargar
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1); // Eliminar el # del inicio
        mostrarSeccion(targetId);
    } else {
        // Mostrar la portada por defecto
        mostrarSeccion('portada');
    }

    // Precargar fecha/hora en formulario
    const ahora = new Date();
    document.getElementById('inicio-actividad').value =
        ahora.toISOString().slice(0, 16);

    const termino = new Date(ahora.getTime() + 3*60*60*1000);
    document.getElementById('termino-actividad').value =
        termino.toISOString().slice(0, 16);
        
    // Asegurar que la portada se muestre inicialmente
    if (!window.location.hash) {
        document.getElementById('portada').style.display = 'block';
    }
});

// ===== FUNCIONES DE NAVEGACIÓN =====
function volverAPortada() {
    mostrarSeccion('portada');
    history.pushState(null, null, '#portada');
}

function volverAlListado() {
    document.getElementById('detalle-actividad').style.display = 'none';
    document.getElementById('tabla-actividades').style.display = 'table';
}

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
    
    // Ocultar la tabla de actividades
    document.getElementById('tabla-actividades').style.display = 'none';

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

