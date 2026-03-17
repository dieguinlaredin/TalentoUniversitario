(function () {

  (function cargarInstitucionDesdeSession() {
    try {
      var raw = sessionStorage.getItem('institucionUsuario');
      if (raw) {
        window.__institucionUsuario = JSON.parse(raw);
      }
    } catch (e) {
      window.__institucionUsuario = {};
    }
  })();

  window.__talentoStore = {
    institucional: {},
    datosPersonales: {},
    portafolio: {}
  };

  var asideContainer = document.getElementById('aside-container');
  var contentBlock = document.getElementById('content-block');

  var MODULES = {
    institucional: 'partials/modulo-institucional-lectura.html',
    'perfil-academico': 'partials/modulo-perfil-academico.html',
    portafolio: 'partials/modulo-portafolio.html'
  };

  function getBasePath() {
    var path = window.location.pathname || '/';
    var i = path.lastIndexOf('/');
    return window.location.origin + (i >= 0 ? path.substring(0, i + 1) : '/');
  }

  function loadPartial(url, container, callback) {
    if (!container) return;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          container.innerHTML = xhr.responseText;
          if (typeof callback === 'function') callback(container);
        }
      }
    };
    xhr.send();
  }

  window.currentModule = 'institucional';

  function onContentInput() {
    if (typeof window.updateProgressBar === 'function' && window.currentModule) {
      window.updateProgressBar(window.currentModule);
    }
  }

  window.loadModule = function (moduleName) {
    var url = MODULES[moduleName];
    if (!url || !contentBlock) return;
    window.currentModule = moduleName;
    loadPartial(url, contentBlock, function () {
      var stepContainer = document.getElementById('step-indicator-container');
      if (stepContainer) {
        loadPartial('partials/step-indicator.html', stepContainer, function () {
          if (typeof window.initStepIndicator === 'function') {
            window.initStepIndicator(moduleName);
          }
        });
      }
      if (typeof window.initFormActions === 'function') {
        window.initFormActions();
      }
      if (moduleName === 'institucional' && typeof window.initModuloInstitucionalLectura === 'function') {
        window.initModuloInstitucionalLectura();
      }
      if (moduleName === 'perfil-academico' && typeof window.initModuloDatosPersonales === 'function') {
        window.initModuloDatosPersonales();
      }
      if (moduleName === 'portafolio' && typeof window.initModuloPortafolio === 'function') {
        window.initModuloPortafolio();
      }
      if (typeof window.setActiveModule === 'function') {
        window.setActiveModule(moduleName);
      }
      if (typeof window.updateProgressBar === 'function') {
        window.updateProgressBar(moduleName);
      }
      if (contentBlock) {
        contentBlock.removeEventListener('input', onContentInput);
        contentBlock.removeEventListener('change', onContentInput);
        contentBlock.addEventListener('input', onContentInput);
        contentBlock.addEventListener('change', onContentInput);
      }
    });
  };

  // Listeners de disparadores
  document.addEventListener('institucionGuardada', function () {
    if (typeof window.loadModule === 'function') {
      window.loadModule('perfil-academico');
    }
  });
  document.addEventListener('perfilGuardado', function () {
    if (typeof window.loadModule === 'function') {
      window.loadModule('portafolio');
    }
  });
  document.addEventListener('portafolioGuardado', function () {
    if (typeof window.loadRegistroCompletado === 'function') {
      window.loadRegistroCompletado();
    }
  });

  function initNavigation() {
    if (!asideContainer) return;
    asideContainer.addEventListener('click', function (e) {
      var link = e.target.closest('[data-module]');
      if (!link) return;
      e.preventDefault();
      var module = link.getAttribute('data-module');
      if (module) {
        loadModule(module);
        if (typeof window.closeAsideMenu === 'function') window.closeAsideMenu();
      }
    });
  }

  window.loadRegistroCompletado = function () {
    if (!contentBlock) return;
    loadPartial('partials/registro-completado.html', contentBlock, function () {
      var base = getBasePath();
      var icon = document.getElementById('registro-completado-icon');
      var img = document.getElementById('registro-completado-image');
      if (icon && icon.tagName === 'IMG') icon.src = base + 'images/completado.png';
      if (img && img.tagName === 'IMG') img.src = base + 'images/final.png';
    });
  };

  if (asideContainer) {
    loadPartial('partials/aside-menu.html', asideContainer, function () {
      if (typeof window.initAsideMenu === 'function') {
        window.initAsideMenu();
      }
      initNavigation();
      loadModule('institucional');
    });
  } else if (contentBlock) {
    window.currentModule = 'institucional';
    loadModule('institucional');
  }
})();