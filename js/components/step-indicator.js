/**
 * Step Indicator - Paso actual; completados = verde + ✓; incompletos (abandonados) = amarillo + !
 */

var EXPECTED_FIELDS = {
  institucional: 6,
  'perfil-academico': 8,
  portafolio: 1
};

var MODULE_BY_STEP = {
  1: 'institucional',
  2: 'perfil-academico',
  3: 'portafolio'
};

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

function getModuleFilledCount(moduleName) {
  var store = window.__talentoStore;
  if (!store) return 0;
  try {
    if (moduleName === 'institucional') return countFilledFromObject(store.institucional);
    if (moduleName === 'perfil-academico') return countFilledFromObject(store.datosPersonales);
    if (moduleName === 'portafolio') return countFilledFromObject(store.portafolio);
  } catch (e) {}
  return 0;
}

function isModuleCompleted(moduleName) {
  var expected = EXPECTED_FIELDS[moduleName];
  return expected != null && getModuleFilledCount(moduleName) >= expected;
}

window.initStepIndicator = function (moduleName) {
  var stepIndicator = document.getElementById('step-indicator');
  if (!stepIndicator) return;

  var items = stepIndicator.querySelectorAll('.step-indicator__item');
  var stepByModule = {
    institucional: 1,
    'perfil-academico': 2,
    portafolio: 3
  };
  var stepNumbers = [1, 2, 3];
  var currentStep = stepByModule[moduleName] || 1;

  items.forEach(function (item, index) {
    var step = index + 1;
    var circle = item.querySelector('.step-indicator__circle');
    item.classList.remove('active', 'completed', 'incomplete');
    if (circle) {
      circle.textContent = stepNumbers[index];
    }
    if (step === currentStep) {
      item.classList.add('active');
    } else if (step < currentStep) {
      var mod = MODULE_BY_STEP[step];
      if (isModuleCompleted(mod)) {
        item.classList.add('completed');
        if (circle) circle.textContent = '\u2713';
      } else {
        item.classList.add('incomplete');
        if (circle) circle.textContent = '!';
      }
    }
  });
};
