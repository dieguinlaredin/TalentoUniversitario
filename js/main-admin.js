/**
 * Talento Universitario - Área de administrador
 * Solo Información Institucional y Control de Instituciones. Sin barra de progreso ni step indicator.
 * Datos en memoria (window.__adminInstituciones). Solo frontend.
 */

(function () {
  window.__adminInstituciones = [];

  var asideContainer = document.getElementById('aside-container');
  var contentBlock = document.getElementById('content-block');

  var MODULES = {
    institucional: 'partials/modulo-institucional-admin.html',
    'control-instituciones': 'partials/modulo-control-instituciones.html',
    'administracion-carreras': 'partials/modulo-administracion-carreras.html'
  };

  function loadPartial(url, container, callback) {
    if (!container) return;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        container.innerHTML = xhr.responseText;
        if (typeof callback === 'function') callback(container);
      }
    };
    xhr.send();
  }

  window.loadModule = function (moduleName) {
    var url = MODULES[moduleName];
    if (!url || !contentBlock) return;
    loadPartial(url, contentBlock, function () {
      if (moduleName === 'institucional' && typeof window.initModuloInstitucionalAdmin === 'function') {
        window.initModuloInstitucionalAdmin();
      }
      if (moduleName === 'control-instituciones' && typeof window.initControlInstituciones === 'function') {
        window.initControlInstituciones();
      }
      if (moduleName === 'administracion-carreras' && typeof window.initAdministracionCarreras === 'function') {
        window.initAdministracionCarreras();
      }
      if (typeof window.setActiveModule === 'function') {
        window.setActiveModule(moduleName);
      }
    });
  };

  function initNavigation() {
    if (!asideContainer) return;
    asideContainer.addEventListener('click', function (e) {
      var link = e.target.closest('[data-module]');
      if (!link) return;
      e.preventDefault();
      var module = link.getAttribute('data-module');
      if (module && MODULES[module]) {
        loadModule(module);
        if (typeof window.closeAsideMenu === 'function') window.closeAsideMenu();
      }
    });
  }

  if (asideContainer) {
    loadPartial('partials/aside-menu-admin.html', asideContainer, function () {
      if (typeof window.initAsideMenu === 'function') {
        window.initAsideMenu();
      }
      initNavigation();
      loadModule('institucional');
    });
  } else if (contentBlock) {
    loadModule('institucional');
  }
})();
