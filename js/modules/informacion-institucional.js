window.initModuloInstitucionalLectura = function () {
  var form = document.getElementById('form-institucional-lectura');
  if (!form) return;

  var data = window.__institucionUsuario || {};
  var nombreEl = document.getElementById('lectura-nombre-institucion');
  var cctEl = document.getElementById('lectura-cct');
  var correoEl = document.getElementById('lectura-correo');
  var telefonoEl = document.getElementById('lectura-telefono');
  var estadoEl = document.getElementById('lectura-estado');
  var ciudadEl = document.getElementById('lectura-ciudad');

  if (nombreEl) nombreEl.value = data.nombreInstitucion || '';
  if (cctEl) cctEl.value = data.cct || '';
  if (correoEl) correoEl.value = data.correo || '';
  if (telefonoEl) telefonoEl.value = data.telefono || '';
  if (estadoEl) estadoEl.value = data.estado || '';
  if (ciudadEl) ciudadEl.value = data.ciudad || '';

  if (window.__talentoStore && data && Object.keys(data).length) {
    window.__talentoStore.institucional = {
      nombreInstitucion: data.nombreInstitucion,
      cct: data.cct,
      correo: data.correo,
      telefono: data.telefono,
      estado: data.estado,
      ciudad: data.ciudad
    };
  }

  var btnContinuar = document.getElementById('btn-continuar-institucional');
  if (btnContinuar && typeof window.loadModule === 'function') {
    btnContinuar.onclick = function () {
      window.loadModule('perfil-academico');
    };
  }
};

function actualizarCiudades(estadoSelect, ciudadSelect) {
  var estadoVal = estadoSelect && estadoSelect.value;
  ciudadSelect.innerHTML = '';
  ciudadSelect.disabled = true;
  if (!estadoVal) {
    var opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'Selecciona primero un estado';
    ciudadSelect.appendChild(opt);
    return;
  }
  var ciudades = window.ESTADOS_CIUDADES_MEXICO && window.ESTADOS_CIUDADES_MEXICO[estadoVal];
  if (!ciudades || !ciudades.length) {
    var opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'Sin ciudades cargadas';
    ciudadSelect.appendChild(opt);
    return;
  }
  ciudadSelect.disabled = false;
  var opt0 = document.createElement('option');
  opt0.value = '';
  opt0.textContent = 'Selecciona una ciudad';
  ciudadSelect.appendChild(opt0);
  for (var i = 0; i < ciudades.length; i++) {
    var opt = document.createElement('option');
    opt.value = ciudades[i];
    opt.textContent = ciudades[i];
    ciudadSelect.appendChild(opt);
  }
}

window.initModuloInstitucional = function () {
  var form = document.getElementById('form-institucional');
  if (!form) return;

  var estadoSelect = document.getElementById('estado');
  var ciudadSelect = document.getElementById('ciudad');

  if (estadoSelect && ciudadSelect && window.ESTADOS_CIUDADES_MEXICO) {
    estadoSelect.addEventListener('change', function () {
      actualizarCiudades(estadoSelect, ciudadSelect);
    });
    actualizarCiudades(estadoSelect, ciudadSelect);
    try {
      var data = window.__talentoStore && window.__talentoStore.institucional;
      if (data) {
        if (form.nombreInstitucion) form.nombreInstitucion.value = data.nombreInstitucion || '';
        if (form.cct) form.cct.value = data.cct || '';
        if (form.correo) form.correo.value = data.correo || '';
        if (form.telefono) form.telefono.value = data.telefono || '';
        if (data.estado) {
          estadoSelect.value = data.estado;
          actualizarCiudades(estadoSelect, ciudadSelect);
          if (data.ciudad) ciudadSelect.value = data.ciudad;
        }
      }
    } catch (e) {}
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // detiene flujo normal

    var data = {
      nombreInstitucion: form.nombreInstitucion && form.nombreInstitucion.value,
      cct: form.cct && form.cct.value,
      correo: form.correo && form.correo.value,
      telefono: form.telefono && form.telefono.value,
      ciudad: form.ciudad && form.ciudad.value,
      estado: form.estado && form.estado.value
    };

    fetch('/api/instituciones', {
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

    .then(function (responseData) {
      // Guardo en memoria para mantener consistencia
      if (window.__talentoStore) {
        window.__talentoStore.institucional = data;
        window.__talentoStore.institucional.id = responseData.id;
      }

      // Evento disparado
      document.dispatchEvent(new Event('institucionGuardada'));

    })

    .catch(function (error) {
      console.error('Error:', error);
      alert('Error al guardar la institución');
    });
  });
};
