function basePath() {
  var path = window.location.pathname || '/';
  var i = path.lastIndexOf('/');
  return window.location.origin + (i >= 0 ? path.substring(0, i + 1) : '/');
}

window.initModuloPortafolio = function () {
  var form = document.getElementById('form-portafolio');
  if (!form) return;

  var base = basePath();
  var hintIcon = document.querySelector('.form-field__hint-icon');
  if (hintIcon && hintIcon.tagName === 'IMG') {
    hintIcon.src = base + 'images/recomendacion.png';
  }

  var store = window.__talentoStore && window.__talentoStore.portafolio;
  if (store && form.urlPortafolio) form.urlPortafolio.value = store.urlPortafolio || '';
  
  function isValidUrl(value) {
    if (!value) return true; // campo opcional
    try {
      var url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (e) {
      return false;
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

    var url = form.urlPortafolio && form.urlPortafolio.value ? form.urlPortafolio.value.trim() : '';

    if (url && !isValidUrl(url)) {
      alert('Ingresa una URL válida (debe empezar con http:// o https://).');
      return;
    }

    var data = {
      usuario_id: storedUser.usuario_id,
      urlPortafolio: url
    };

    fetch('/api/portafolio', {
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
        window.__talentoStore.portafolio = data;
      }

      document.dispatchEvent(new Event('portafolioGuardado'));
    })

    .catch(function (error) {
      console.error('Error:', error);
      alert(error && error.mensaje ? error.mensaje : 'Error al guardar el url del portafolio');
    });
  });
};
