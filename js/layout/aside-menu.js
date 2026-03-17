/**
 * Aside Menu - Ítem activo, widget de progreso con porcentaje por campos completados
 */

var PROGRESS_CONFIG = {
  institucional: { next: 'Perfil Académico', nextModule: 'perfil-academico' },
  'perfil-academico': { next: 'Portafolio', nextModule: 'portafolio' },
  portafolio: { next: 'Portafolio completo', nextModule: null }
};

var TOTAL_FIELDS = 15; /* 6 institucional + 8 perfil académico + 1 portafolio */

function countFilledFromObject(obj) {
  if (!obj || typeof obj !== 'object') return 0;
  var n = 0;
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var v = obj[key];
      if (v !== undefined && v !== null && String(v).trim() !== '') n++;
    }
  }
  return n;
}

function countFormFields(form) {
  if (!form) return 0;
  var n = 0;
  var inputs = form.querySelectorAll('input, select, textarea');
  for (var i = 0; i < inputs.length; i++) {
    var el = inputs[i];
    if (el.name && el.type !== 'hidden') {
      if ((el.value || '').trim() !== '') n++;
    }
  }
  return n;
}

function getCompletedFieldsCount(moduleName) {
  var store = window.__talentoStore;
  if (!store) return 0;
  var filled = 0;
  var content = document.getElementById('content-block');
  var form = content ? content.querySelector('form[id^="form-"]') : null;
  try {
    if (moduleName === 'institucional' && form) {
      filled += countFormFields(form);
    } else {
      filled += countFilledFromObject(store.institucional);
    }
    if (moduleName === 'perfil-academico' && form) {
      filled += countFormFields(form);
    } else {
      filled += countFilledFromObject(store.datosPersonales);
    }
    if (moduleName === 'portafolio') {
      filled += countFilledFromObject(store.portafolio);
      if (form) filled += countFormFields(form);
    } else {
      filled += countFilledFromObject(store.portafolio);
    }
  } catch (e) {}
  return filled > TOTAL_FIELDS ? TOTAL_FIELDS : filled;
}

window.updateProgressBar = function (moduleName) {
  var aside = document.getElementById('aside-menu');
  if (!aside) return;
  var progressBar = document.getElementById('progress-bar');
  var progressPercent = document.getElementById('progress-percent');
  var progressNext = document.getElementById('progress-next');
  var filled = getCompletedFieldsCount(moduleName);
  var percent = Math.round((filled / TOTAL_FIELDS) * 100);
  if (percent > 100) percent = 100;
  if (progressBar) progressBar.style.width = percent + '%';
  if (progressPercent) progressPercent.textContent = percent + '%';
  if (progressNext) {
    var config = PROGRESS_CONFIG[moduleName] || PROGRESS_CONFIG.institucional;
    if (config.nextModule) {
      progressNext.innerHTML = 'Siguiente: <a href="#" data-module="' + config.nextModule + '">' + config.next + '</a>';
    } else {
      progressNext.textContent = config.next;
    }
  }
};

function openAsideMenu(open) {
  var aside = document.getElementById('aside-menu');
  var overlay = document.getElementById('aside-overlay');
  var toggle = document.getElementById('aside-toggle');
  if (!aside) return;
  if (open) {
    aside.classList.add('open');
    if (overlay) overlay.classList.add('is-visible');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('aside-open');
  } else {
    aside.classList.remove('open');
    if (overlay) overlay.classList.remove('is-visible');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('aside-open');
  }
}

window.closeAsideMenu = function () {
  openAsideMenu(false);
};

window.initAsideMenu = function () {
  setActiveModule('institucional');

  var aside = document.getElementById('aside-menu');
  var toggle = document.getElementById('aside-toggle');
  var overlay = document.getElementById('aside-overlay');
  var closeBtn = document.getElementById('aside-close');

  if (toggle && aside) {
    toggle.addEventListener('click', function () {
      var isOpen = aside.classList.toggle('open');
      if (overlay) overlay.classList.toggle('is-visible', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('aside-open', isOpen);
    });
  }
  if (overlay && aside) {
    overlay.addEventListener('click', function () {
      openAsideMenu(false);
    });
  }
  if (closeBtn && aside) {
    closeBtn.addEventListener('click', function () {
      openAsideMenu(false);
    });
  }
};

window.setActiveModule = function (moduleName) {
  var aside = document.getElementById('aside-menu');
  if (!aside) return;

  var links = aside.querySelectorAll('.aside-menu__link');

  links.forEach(function (link) {
    var mod = link.getAttribute('data-module');
    if (mod === moduleName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  updateProgressBar(moduleName);
};
