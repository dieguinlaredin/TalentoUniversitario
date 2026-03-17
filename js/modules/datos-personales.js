function basePath() {
  var path = window.location.pathname || '/';
  var i = path.lastIndexOf('/');
  return window.location.origin + (i >= 0 ? path.substring(0, i + 1) : '/');
}

var MESES_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function formatearFechaActual() {
  var d = new Date();
  return d.getDate() + ' de ' + MESES_ES[d.getMonth()] + ', ' + d.getFullYear();
}

var CARRERAS_STORAGE_KEY = 'talento_carreras_por_codigo';

function llenarSelectCarreras(selectEl, carreras) {
  if (!selectEl || selectEl.tagName !== 'SELECT') return;
  selectEl.innerHTML = '<option value="">Selecciona una carrera</option>';
  if (!Array.isArray(carreras) || !carreras.length) return;
  for (var i = 0; i < carreras.length; i++) {
    var item = carreras[i];
    var nombre = item && item.nombre ? item.nombre : String(item);
    var val = item && item.nombre ? item.nombre : String(item);
    if (!val) continue;
    var opt = document.createElement('option');
    opt.value = val;
    opt.textContent = nombre;
    selectEl.appendChild(opt);
  }
}

function cargarCarreras(selectEl, codigoInstitucional, institucionId) {
  // Intenta cargar desde localStorage (modo admin), si no hay, pide al backend.
  if (!selectEl) return;

  var carreras = [];
  if (codigoInstitucional) {
    try {
      var raw = localStorage.getItem(CARRERAS_STORAGE_KEY);
      var data = raw ? JSON.parse(raw) : {};
      carreras = data[codigoInstitucional] || [];
    } catch (e) {
      carreras = [];
    }
  }

  if (carreras && carreras.length) {
    llenarSelectCarreras(selectEl, carreras);
    return;
  }

  // Fallback: pedir al backend.
  if (!institucionId) return;
  fetch('/api/carreras?institucion_id=' + encodeURIComponent(institucionId))
    .then(function (res) {
      if (!res.ok) return res.json().then(function (err) { throw err; });
      return res.json();
    })
    .then(function (json) {
      if (json && json.ok && Array.isArray(json.carreras)) {
        llenarSelectCarreras(selectEl, json.carreras);
      }
    })
    .catch(function () {
      // No hacemos nada; el select queda con la opción por defecto.
    });
}

window.initModuloDatosPersonales = function () {
  var form = document.getElementById('form-datos-personales');
  if (!form) return;

  var carreraSelect = form.nombreCarrera || document.getElementById('nombre-carrera');
  var codigoInst = window.__institucionUsuario && window.__institucionUsuario.codigoInstitucional;
  var storedUser = null;
  try {
    storedUser = JSON.parse(sessionStorage.getItem('usuarioActual') || 'null');
  } catch (err) {
    storedUser = null;
  }
  var institucionId = storedUser && storedUser.institucion_id;

  cargarCarreras(carreraSelect, codigoInst, institucionId);

  var base = basePath();
  var iconDate = document.querySelector('.form-field__icon--date');
  if (iconDate && iconDate.tagName === 'IMG') {
    iconDate.src = base + 'images/calendario.png';
  }

  var store = window.__talentoStore && window.__talentoStore.datosPersonales;
  if (store) {
    if (form.nombreCompleto) form.nombreCompleto.value = store.nombreCompleto || '';
    if (form.disponibilidad) form.disponibilidad.value = store.disponibilidad || '';
    if (form.nombreCarrera) form.nombreCarrera.value = store.nombreCarrera || '';
    if (form.nivel) form.nivel.value = store.nivel || '';
    if (form.promedio) form.promedio.value = store.promedio || '';
    if (form.tipoPeriodo) form.tipoPeriodo.value = store.tipoPeriodo || '';
    if (form.numeroPeriodo) form.numeroPeriodo.value = store.numeroPeriodo || '';
  }
  var display = document.getElementById('fecha-actualizacion-display');
  var hiddenInput = document.getElementById('fecha-actualizacion');
  if (display && hiddenInput) {
    var fechaValor = store && store.fechaActualizacion;
    if (!fechaValor) {
      var ahora = new Date();
      fechaValor = ahora.toISOString();
    }
    hiddenInput.value = fechaValor;
    var d = new Date(fechaValor);
    if (!isNaN(d.getTime())) {
      display.textContent = d.getDate() + ' de ' + MESES_ES[d.getMonth()] + ', ' + d.getFullYear();
    } else {
      display.textContent = formatearFechaActual();
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var storedUser = null;
    try {
      storedUser = JSON.parse(sessionStorage.getItem('usuarioActual') || 'null');
    } catch (err) {
      storedUser = null;
    }

    if (!storedUser || !storedUser.usuario_id) {
      alert('No se encontró la información del usuario. Vuelve a iniciar sesión.');
      return;
    }

    var data = {
      usuario_id: storedUser.usuario_id,
      institucion_id: storedUser.institucion_id,
      nombreCompleto: form.nombreCompleto && form.nombreCompleto.value,
      disponibilidad: form.disponibilidad && form.disponibilidad.value,
      nombreCarrera: form.nombreCarrera && form.nombreCarrera.value,
      nivel: form.nivel && form.nivel.value,
      promedio: form.promedio && form.promedio.value,
      tipoPeriodo: form.tipoPeriodo && form.tipoPeriodo.value,
      numeroPeriodo: form.numeroPeriodo && form.numeroPeriodo.value
    };

    fetch('/api/perfil-academico', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    .then(function (response) {
      if (!response.ok) {
        return response.json().then(function (err) {
          throw err;
        });
      }
      return response.json();
    })

    .then(function () {
      if (window.__talentoStore) {
        window.__talentoStore.datosPersonales = data;
      }

      document.dispatchEvent(new Event('perfilGuardado'));
    })

    .catch(function (error) {
      console.error('Error:', error);
      alert(error && error.mensaje ? error.mensaje : 'Error al guardar el perfil académico');
    });
  });
};
