(function () {

  var form = document.getElementById('form-login');
  var modal = document.getElementById('modal-confirmar');
  var btnConf = document.getElementById('modal-btn-confirmar');
  var btnCanc = document.getElementById('modal-btn-cancelar');
  var modalEmail = document.getElementById('modal-email');

  if (!form) return;

  var pendiente = null;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var correo = (form.correo.value || '').trim();
    var contrasena = form.contrasena.value || '';
    var codigoInstitucional = (form.codigoInstitucional.value || '').trim();

    if (!correo || !contrasena) {
      mostrarAlerta('Correo y contraseña son obligatorios.');
      return;
    }

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: correo, contrasena: contrasena, codigoInstitucional: codigoInstitucional })
    })
      .then(function (res) { return res.json(); })
      .then(manejarRespuestaLogin)
      .catch(function () {
        mostrarAlerta('Error de conexión. Intenta más tarde.');
      });
  });

  /* ═══════════════════════════════════════════════════════════════════════
     Manejar respuesta del endpoint /api/login
  ═══════════════════════════════════════════════════════════════════════ */
  function manejarRespuestaLogin(resp) {
    switch (resp.accion) {

      case 'login_admin':
        window.location.href = '/admin';
        break;

      case 'login_estudiante':
        guardarInstitucion(resp.data);
        window.location.href = '/index';
        break;

      case 'registro_pendiente':
        pendiente = {
          correo: (form.correo.value || '').trim(),
          contrasena: form.contrasena.value || '',
          codigoInstitucional: (form.codigoInstitucional.value || '').trim()
        };
        if (modalEmail) modalEmail.textContent = pendiente.correo;
        abrirModal();
        break;

      case 'error':
      default:
        mostrarAlerta(resp.mensaje || 'Los datos ingresados son incorrectos.');
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     Modal — Confirmar creación de cuenta
  ═══════════════════════════════════════════════════════════════════════ */
  if (btnConf) {
    btnConf.addEventListener('click', function () {
      if (!pendiente) return;

      fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendiente)
      })
        .then(function (res) { return res.json(); })
        .then(function (resp) {
          cerrarModal();
          if (resp.ok) {
            guardarInstitucion(resp.data);
            window.location.href = '/index';
          } else {
            mostrarAlerta(resp.mensaje || 'No se pudo crear la cuenta.');
          }
        })
        .catch(function () {
          cerrarModal();
          mostrarAlerta('Error de conexión. Intenta más tarde.');
        });
    });
  }

  if (btnCanc) {
    btnCanc.addEventListener('click', function () {
      pendiente = null;
      cerrarModal();
    });
  }

  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        pendiente = null;
        cerrarModal();
      }
    });
  }

  /* ── Helpers ─────────────────────────────────────────────────────────── */

  /**
   * Normaliza los datos de institución que llegan del backend
   * y los guarda en sessionStorage para que main.js los lea al cargar el index.
   */
  function guardarInstitucion(data) {
    if (!data || !data.institucion) return;
    var inst = data.institucion;
    var normalizado = {
      nombreInstitucion: inst.nombre || '',
      cct: inst.cct || '',
      correo: inst.email || '',
      telefono: inst.telefono || '',
      estado: inst.estado || '',
      ciudad: inst.ciudad || ''
    };
    sessionStorage.setItem('institucionUsuario', JSON.stringify(normalizado));
    
    var usuario = {
      usuario_id: data.usuario_id || null,
      email: data.email || ''
    };
    if (inst.institucion_id) {
      usuario.institucion_id = inst.institucion_id;
    }
    sessionStorage.setItem('usuarioActual', JSON.stringify(usuario));
  }

  function abrirModal() { if (modal) modal.classList.add('modal--visible'); }
  function cerrarModal() { if (modal) modal.classList.remove('modal--visible'); }

  function mostrarAlerta(msg) {
    var alerta = document.getElementById('login-alerta');
    if (alerta) {
      alerta.textContent = msg;
      alerta.style.display = 'block';
      setTimeout(function () { alerta.style.display = 'none'; }, 4000);
    } else {
      alert(msg);
    }
  }

})();