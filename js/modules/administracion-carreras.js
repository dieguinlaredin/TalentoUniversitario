/**
 * Administración de carreras - Por institución. Solo frontend.
 * Sincroniza carreras a localStorage para que el estudiante las vea en Perfil académico.
 */

var STORAGE_KEY = 'talento_carreras_por_codigo';

function syncCarrerasToStorage() {
  var list = window.__adminInstituciones || [];
  var data = {};
  for (var i = 0; i < list.length; i++) {
    var inst = list[i];
    var codigo = inst.codigoInstitucional;
    if (codigo) {
      data[codigo] = inst.carreras || [];
    }
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
}
window.syncCarrerasToStorage = syncCarrerasToStorage;

function getInstitucionSeleccionada() {
  var select = document.getElementById('admin-carreras-institucion');
  if (!select || !select.value) return null;
  var list = window.__adminInstituciones || [];
  for (var i = 0; i < list.length; i++) {
    if (String(list[i].id) === String(select.value)) return list[i];
  }
  return null;
}

function escapeHtml(str) {
  if (str == null) return '';
  var s = String(str);
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderCarreras() {
  var inst = getInstitucionSeleccionada();
  var content = document.getElementById('admin-carreras-content');
  var emptyEl = document.getElementById('admin-carreras-empty');
  var tableWrap = document.getElementById('admin-carreras-table-wrap');
  var tbody = document.getElementById('admin-carreras-lista');
  var titulo = document.getElementById('admin-carreras-institucion-nombre');

  if (!content || !tbody) return;

  if (!inst) {
    content.style.display = 'none';
    return;
  }

  content.style.display = 'block';
  if (titulo) titulo.textContent = inst.nombreInstitucion || 'Institución';
  inst.carreras = inst.carreras || [];
  var carreras = inst.carreras;

  if (carreras.length === 0) {
    if (emptyEl) emptyEl.style.display = 'block';
    if (tableWrap) tableWrap.style.display = 'none';
    tbody.innerHTML = '';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (tableWrap) tableWrap.style.display = 'block';
  tbody.innerHTML = '';

  for (var i = 0; i < carreras.length; i++) {
    var c = carreras[i];
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + escapeHtml(c.nombre) + '</td>' +
      '<td>' + escapeHtml(c.nivel || '') + '</td>' +
      '<td><div class="control-instituciones__actions">' +
      '<button type="button" class="btn btn--secondary control-instituciones__btn btn-editar-carrera" data-id="' + escapeHtml(c.id) + '">Editar</button> ' +
      '<button type="button" class="btn btn--secondary control-instituciones__btn btn-eliminar-carrera" data-id="' + escapeHtml(c.id) + '">Eliminar</button>' +
      '</div></td>';
    tbody.appendChild(tr);
  }

  tbody.querySelectorAll('.btn-editar-carrera').forEach(function (btn) {
    btn.addEventListener('click', function () {
      abrirModalCarrera(btn.getAttribute('data-id'), true);
    });
  });
  tbody.querySelectorAll('.btn-eliminar-carrera').forEach(function (btn) {
    btn.addEventListener('click', function () {
      eliminarCarrera(btn.getAttribute('data-id'));
    });
  });
}

function abrirModalCarrera(carreraId, esEditar) {
  var modal = document.getElementById('modal-carrera');
  var title = document.getElementById('modal-carrera-title');
  var form = document.getElementById('form-carrera');
  var idInput = document.getElementById('carrera-id-edit');
  var nombreInput = document.getElementById('carrera-nombre');
  var nivelSelect = document.getElementById('carrera-nivel');
  if (!modal || !form || !nombreInput) return;

  idInput.value = esEditar ? (carreraId || '') : '';
  title.textContent = esEditar ? 'Editar carrera' : 'Agregar carrera';
  nombreInput.value = '';
  if (nivelSelect) nivelSelect.value = '';

  if (esEditar && carreraId) {
    var inst = getInstitucionSeleccionada();
    if (inst && inst.carreras) {
      for (var i = 0; i < inst.carreras.length; i++) {
        if (String(inst.carreras[i].id) === String(carreraId)) {
          nombreInput.value = inst.carreras[i].nombre || '';
          if (nivelSelect) nivelSelect.value = inst.carreras[i].nivel || '';
          break;
        }
      }
    }
  }

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function cerrarModalCarrera() {
  var modal = document.getElementById('modal-carrera');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function eliminarCarrera(carreraId) {
  if (!confirm('¿Eliminar esta carrera?')) return;
  var inst = getInstitucionSeleccionada();
  if (!inst || !inst.carreras) return;
  for (var i = 0; i < inst.carreras.length; i++) {
    if (String(inst.carreras[i].id) === String(carreraId)) {
      inst.carreras.splice(i, 1);
      break;
    }
  }
  syncCarrerasToStorage();
  renderCarreras();
}

window.initAdministracionCarreras = function () {
  var selectInst = document.getElementById('admin-carreras-institucion');
  var btnAgregar = document.getElementById('admin-carreras-btn-agregar');
  var list = window.__adminInstituciones || [];

  if (!selectInst) return;

  selectInst.innerHTML = '<option value="">Selecciona una institución</option>';
  for (var i = 0; i < list.length; i++) {
    var inst = list[i];
    inst.carreras = inst.carreras || [];
    var opt = document.createElement('option');
    opt.value = inst.id || '';
    opt.textContent = inst.nombreInstitucion || 'Sin nombre';
    selectInst.appendChild(opt);
  }

  selectInst.addEventListener('change', function () {
    renderCarreras();
  });

  if (btnAgregar) {
    btnAgregar.onclick = function () {
      if (!getInstitucionSeleccionada()) {
        alert('Selecciona primero una institución.');
        return;
      }
      abrirModalCarrera(null, false);
    };
  }

  var modal = document.getElementById('modal-carrera');
  var form = document.getElementById('form-carrera');
  var btnCerrar = document.getElementById('modal-carrera-close');
  var btnCancelar = document.getElementById('modal-carrera-cancelar');
  var backdrop = document.getElementById('modal-carrera-backdrop');

  function closeModal() {
    cerrarModalCarrera();
  }
  if (btnCerrar) btnCerrar.addEventListener('click', closeModal);
  if (btnCancelar) btnCancelar.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var inst = getInstitucionSeleccionada();
      if (!inst) return;
      inst.carreras = inst.carreras || [];
      var idInput = document.getElementById('carrera-id-edit');
      var nombreInput = document.getElementById('carrera-nombre');
      var nivelSelect = document.getElementById('carrera-nivel');
      var nombre = (nombreInput && nombreInput.value) ? nombreInput.value.trim() : '';
      var nivel = (nivelSelect && nivelSelect.value) ? nivelSelect.value : '';
      if (!nombre) {
        alert('Escribe el nombre de la carrera.');
        return;
      }
      if (!nivel) {
        alert('Selecciona el nivel.');
        return;
      }
      var idEdit = idInput && idInput.value;
      if (idEdit) {
        for (var j = 0; j < inst.carreras.length; j++) {
          if (String(inst.carreras[j].id) === String(idEdit)) {
            inst.carreras[j].nombre = nombre;
            inst.carreras[j].nivel = nivel;
            break;
          }
        }
      } else {
        inst.carreras.push({ id: 'carrera_' + Date.now(), nombre: nombre, nivel: nivel });
      }
      syncCarrerasToStorage();
      cerrarModalCarrera();
      renderCarreras();
    });
  }

  renderCarreras();
};
