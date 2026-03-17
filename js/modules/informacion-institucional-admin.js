/**
 * Genera un código único por institución. La lógica real se implementará después.
 * @returns {string}
 */

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

window.initModuloInstitucionalAdmin = function () {
  var form = document.getElementById('form-institucional');
  if (!form) return;

  var estadoSelect = document.getElementById('estado');
  var ciudadSelect = document.getElementById('ciudad');

  if (estadoSelect && ciudadSelect && window.ESTADOS_CIUDADES_MEXICO) {
    estadoSelect.addEventListener('change', function () {
      actualizarCiudades(estadoSelect, ciudadSelect);
    });
    actualizarCiudades(estadoSelect, ciudadSelect);
  }

  var inputCodigo = document.getElementById('codigo-institucional-admin');
  var btnGenerarCodigo = document.getElementById('btn-generar-codigo');

  if (inputCodigo && btnGenerarCodigo) {
    btnGenerarCodigo.addEventListener('click', function () {
      if (inputCodigo.value) return;

      btnGenerarCodigo.disabled = true;
      btnGenerarCodigo.textContent = 'Generando…';

      fetch('/api/instituciones/preview-codigo')
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.ok && data.codigo) {
            inputCodigo.value = data.codigo;
            inputCodigo.readOnly = true;
            inputCodigo.classList.add('form-field__input--readonly');
            btnGenerarCodigo.textContent = 'Código generado';
          } else {
            alert('No se pudo obtener un código. Intenta de nuevo.');
            btnGenerarCodigo.disabled = false;
            btnGenerarCodigo.textContent = 'Generar código';
          }
        })
        .catch(function () {
          alert('Error de red al generar el código.');
          btnGenerarCodigo.disabled = false;
          btnGenerarCodigo.textContent = 'Generar código';
        });
    });
  }

  var btnDescartar = form.querySelector('.btn-descartar');
  if (btnDescartar) {
    btnDescartar.onclick = function () {
      form.reset();
      if (inputCodigo) {
        inputCodigo.value = '';
        inputCodigo.readOnly = false;
        inputCodigo.classList.remove('form-field__input--readonly');
      }
      if (btnGenerarCodigo) {
        btnGenerarCodigo.disabled = false;
        btnGenerarCodigo.textContent = 'Generar código';
      }
      if (ciudadSelect) {
        ciudadSelect.innerHTML = '';
        ciudadSelect.disabled = true;
        var opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'Selecciona primero un estado';
        ciudadSelect.appendChild(opt);
      }
    };
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var codigoVal = inputCodigo && inputCodigo.value;
    if (!codigoVal || !codigoVal.trim()) {
      alert('Genera el código institucional antes de guardar.');
      return;
    }

    var payload = {
      nombreInstitucion: (form.nombreInstitucion && form.nombreInstitucion.value) || '',
      cct: (form.cct && form.cct.value) || '',
      correo: (form.correo && form.correo.value) || '',
      telefono: (form.telefono && form.telefono.value) || '',
      ciudad: (form.ciudad && form.ciudad.value) || '',
      estado: (form.estado && form.estado.value) || '',
    };

    fetch('/api/instituciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.ok) {
          form.reset();
          if (inputCodigo) {
            inputCodigo.value = '';
            inputCodigo.readOnly = false;
            inputCodigo.classList.remove('form-field__input--readonly');
          }
          if (btnGenerarCodigo) {
            btnGenerarCodigo.disabled = false;
            btnGenerarCodigo.textContent = 'Generar código';
          }
          if (ciudadSelect) {
            ciudadSelect.innerHTML = '';
            ciudadSelect.disabled = true;
            var opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'Selecciona primero un estado';
            ciudadSelect.appendChild(opt);
          }
          if (typeof window.loadModule === 'function') {
            window.loadModule('control-instituciones');
          }
        } else {
          alert(data.mensaje || 'Error al registrar la institución.');
        }
      })
      .catch(function () {
        alert('Error de red al guardar la institución.');
      });
  });
};