function escapeHtml(str) {
  if (str == null) return '';
  var s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function actualizarCiudadesModal(estadoSelect, ciudadSelect, ciudadVal) {
  if (!estadoSelect || !ciudadSelect) return;
  var estadoVal = estadoSelect.value;
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
  if (ciudadVal) ciudadSelect.value = ciudadVal;
}

function renderLista(list) {
  var tbody = document.getElementById('lista-instituciones');
  var emptyEl = document.getElementById('control-instituciones-empty');
  var tableWrap = document.getElementById('control-instituciones-table-wrap');

  if (!tbody || !emptyEl || !tableWrap) return;

  if (!list || list.length === 0) {
    emptyEl.style.display = 'block';
    tableWrap.style.display = 'none';
    tbody.innerHTML = '';
    return;
  }

  emptyEl.style.display = 'none';
  tableWrap.style.display = 'block';
  tbody.innerHTML = '';

  for (var i = 0; i < list.length; i++) {
    var inst = list[i];
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + escapeHtml(inst.nombreInstitucion) + '</td>' +
      '<td>' + escapeHtml(inst.cct) + '</td>' +
      '<td>' + escapeHtml(inst.correo) + '</td>' +
      '<td>' + escapeHtml(inst.telefono) + '</td>' +
      '<td>' + escapeHtml(inst.ciudad) + '</td>' +
      '<td>' + escapeHtml(inst.estado) + '</td>' +
      '<td>' + escapeHtml(inst.codigoInstitucional) + '</td>' +
      '<td><div class="control-instituciones__actions">' +
      '<button type="button" class="btn btn--secondary control-instituciones__btn btn-editar" data-id="' + (inst.institucion_id || '') + '">Editar</button> ' +
      '<button type="button" class="btn btn--secondary control-instituciones__btn btn-eliminar" data-id="' + (inst.institucion_id || '') + '">Eliminar</button>' +
      '</div></td>';
    tbody.appendChild(tr);
  }

  tbody.querySelectorAll('.btn-editar').forEach(function (btn) {
    btn.addEventListener('click', function () {
      abrirModalEditar(btn.getAttribute('data-id'), list);
    });
  });
  tbody.querySelectorAll('.btn-eliminar').forEach(function (btn) {
    btn.addEventListener('click', function () {
      eliminarInstitucion(btn.getAttribute('data-id'));
    });
  });
}

function cargarInstituciones() {
  fetch('/api/instituciones')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.ok) {
        renderLista(data.instituciones);
      }
    })
    .catch(function () {
      console.error('Error al cargar instituciones.');
    });
}

function abrirModalEditar(id, list) {
  var modal = document.getElementById('modal-editar-institucion');
  var inst = null;
  for (var i = 0; i < list.length; i++) {
    if (String(list[i].institucion_id) === String(id)) {
      inst = list[i];
      break;
    }
  }
  if (!inst || !modal) return;

  document.getElementById('editar-institucion-id').value = inst.institucion_id || '';
  document.getElementById('editar-nombre').value = inst.nombreInstitucion || '';
  document.getElementById('editar-cct').value = inst.cct || '';
  document.getElementById('editar-correo').value = inst.correo || '';
  document.getElementById('editar-telefono').value = inst.telefono || '';

  var estadoSelect = document.getElementById('editar-estado');
  var ciudadSelect = document.getElementById('editar-ciudad');
  estadoSelect.value = inst.estado || '';
  actualizarCiudadesModal(estadoSelect, ciudadSelect, inst.ciudad || '');

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function cerrarModalEditar() {
  var modal = document.getElementById('modal-editar-institucion');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function eliminarInstitucion(id) {
  if (!confirm('¿Eliminar esta institución del registro?')) return;
  fetch('/api/instituciones/' + id, { method: 'DELETE' })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.ok) {
        cargarInstituciones();
      } else {
        alert(data.mensaje || 'Error al eliminar.');
      }
    })
    .catch(function () {
      alert('Error de red al eliminar.');
    });
}

window.initControlInstituciones = function () {
  cargarInstituciones();

  var modal = document.getElementById('modal-editar-institucion');
  var formEditar = document.getElementById('form-editar-institucion');
  var btnCerrar = document.getElementById('modal-editar-close');
  var btnCancelar = document.getElementById('modal-editar-cancelar');
  var backdrop = document.getElementById('modal-editar-backdrop');
  var estadoSelect = document.getElementById('editar-estado');
  var ciudadSelect = document.getElementById('editar-ciudad');

  if (btnCerrar) btnCerrar.addEventListener('click', cerrarModalEditar);
  if (btnCancelar) btnCancelar.addEventListener('click', cerrarModalEditar);
  if (backdrop) backdrop.addEventListener('click', cerrarModalEditar);

  if (estadoSelect && ciudadSelect && window.ESTADOS_CIUDADES_MEXICO) {
    estadoSelect.addEventListener('change', function () {
      actualizarCiudadesModal(estadoSelect, ciudadSelect);
    });
  }

  if (formEditar) {
    formEditar.addEventListener('submit', function (e) {
      e.preventDefault();
      var id = document.getElementById('editar-institucion-id').value;
      var payload = {
        nombreInstitucion: document.getElementById('editar-nombre').value,
        cct: document.getElementById('editar-cct').value,
        correo: document.getElementById('editar-correo').value,
        telefono: document.getElementById('editar-telefono').value,
        estado: document.getElementById('editar-estado').value,
        ciudad: document.getElementById('editar-ciudad').value,
      };
      fetch('/api/instituciones/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.ok) {
            cerrarModalEditar();
            cargarInstituciones();
          } else {
            alert(data.mensaje || 'Error al editar.');
          }
        })
        .catch(function () {
          alert('Error de red al editar.');
        });
    });
  }
};