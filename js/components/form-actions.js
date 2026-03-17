/**
 * Form Actions - Descartar y Siguiente (avanza al siguiente módulo sin validar)
 * La navegación por el menú lateral siempre está permitida.
 */

window.initFormActions = function () {
  var content = document.getElementById('content-block');
  if (!content) return;
  var form = content.querySelector('form[id^="form-"]');
  var btnDescartar = content.querySelector('.btn-descartar');
  var btnAnterior = content.querySelector('.btn-anterior');
  var btnRegresar = content.querySelector('.btn-regresar');

  if (btnDescartar && form) {
    btnDescartar.onclick = function () {
      form.reset();
    };
  }
  if (btnAnterior && typeof window.loadModule === 'function') {
    btnAnterior.onclick = function () {
      window.loadModule('institucional');
    };
  }
  if (btnRegresar && typeof window.loadModule === 'function') {
    btnRegresar.onclick = function () {
      window.loadModule('perfil-academico');
    };
  }

  if (form && typeof window.loadModule === 'function') {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var formId = form.id;
      if (formId === 'form-institucional') {
        window.loadModule('perfil-academico');
      } else if (formId === 'form-datos-personales') {
        window.loadModule('portafolio');
      } else if (formId === 'form-portafolio') {
        if (typeof window.loadRegistroCompletado === 'function') {
          window.loadRegistroCompletado();
        } else {
          window.loadModule('institucional');
        }
      }
    });
  }
};
