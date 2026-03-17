# Talento Universitario

Plataforma para recolectar información institucional, perfil educativo y portafolio de experiencia de estudiantes.

## Estructura del proyecto

- **HTML**: Página principal `index.html`, **administrador** `admin.html`, **inicio de sesión** `login.html` (fondo blanco, card centrada) y bloques reutilizables en `partials/` (aside, aside-menu-admin, módulos institucional, perfil académico, portafolio, control-instituciones). Favicon `images/favicon.png`. Diseño responsivo con menú colapsable en móvil.
- **CSS**: `css/styles.css` (global), `css/layout/`, `css/components/`, `css/modules/` (incl. control-instituciones), `css/pages/` (login).
- **JS**: `js/main.js` (plataforma), `js/main-admin.js` (área admin), `js/layout/aside-menu.js`, `js/components/`, `js/modules/` (incl. informacion-institucional-admin.js, control-instituciones.js).

## Cómo probar

Abrir las páginas con un servidor local para que los partials se carguen por `fetch` (evitar abrir los HTML directamente por file://). Por ejemplo:

```bash
# Con Python 3
python3 -m http.server 8000

# O con Node (npx serve)
npx serve .
```

Luego visitar: `http://localhost:8000`, `http://localhost:8000/admin.html` (área administrador), `http://localhost:8000/login.html` (inicio de sesión) o `http://localhost:8000/informacion-institucional.html`.

## Área de administrador

En `admin.html` el menú lateral solo tiene **Información Institucional** y **Control de Instituciones**. No hay barra de progreso ni step indicator. En Control de Instituciones se listan las instituciones guardadas en memoria (`window.__adminInstituciones`); se puede editar (modal) o eliminar cada una. Solo frontend; en el futuro el acceso estará restringido al usuario administrador.

## Datos

Los datos de los formularios se guardan **solo en memoria** (`window.__talentoStore` en la plataforma, `window.__adminInstituciones` en admin) durante la sesión. No se usa `localStorage` ni se persiste nada al cerrar o recargar la página; la barra de progreso y el step indicator reflejan únicamente lo completado en esa sesión. Con el backend, los datos se enviarán y guardarán en base de datos.
