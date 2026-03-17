from ..queries.login_queries import (
    get_usuario_by_email,
    get_institucion_by_codigo,
    crear_usuario
)

def login_service(email, passwd, codigo):
    
    if not email or not passwd:
        return _err('Correo y contraseña son obligatorios.')

    usuario = get_usuario_by_email(email)

    # ── 2. FLUJO ADMIN  (sin código) ─────────────────────────────────────
    if not codigo:
        if not usuario:
            return _err('Credenciales incorrectas.')
        if usuario['rol'] != 'admin':
            return _err('Se requiere código institucional para estudiantes.')
        if usuario['passwd'] != passwd:
            return _err('Credenciales incorrectas.')

        return {
            'ok': True,
            'accion': 'login_admin',
            'mensaje': 'Bienvenido, administrador.',
            'data': {'email': usuario['email']}
        }

    # ── 3. FLUJO ESTUDIANTE  (con código) ────────────────────────────────
    institucion = get_institucion_by_codigo(codigo)
    if not institucion:
        return _err('El código institucional no es válido.')

    if usuario:
        if usuario['passwd'] != passwd:
            return _err('Los datos ingresados son incorrectos.')

        return {
            'ok': True,
            'accion': 'login_estudiante',
            'mensaje': f'Bienvenido de nuevo.',
            'data': {
                'usuario_id': usuario['usuario_id'],
                'email': usuario['email'],
                'institucion': institucion
            }
        }

    return {
        'ok': True,
        'accion': 'registro_pendiente',
        'mensaje': '¿Deseas crear una cuenta con estos datos?',
        'data': {
            'email': email,
            'passwd': passwd,
            'institucion': institucion
        }
    }


def registrar_service(email, passwd, codigo):
    
    if not email or not passwd or not codigo:
        return _err('Faltan datos para el registro.')

    if get_usuario_by_email(email):
        return _err('Este correo ya está registrado. Inicia sesión.')

    institucion = get_institucion_by_codigo(codigo)
    if not institucion:
        return _err('El código institucional no es válido.')

    nuevo_id = crear_usuario(email, passwd)
    if not nuevo_id:
        return _err('No se pudo crear la cuenta. Intenta más tarde.')

    return {
        'ok': True,
        'accion': 'login_estudiante',
        'mensaje': 'Cuenta creada exitosamente.',
        'data': {
            'usuario_id': nuevo_id,
            'email': email,
            'institucion': institucion
        }
    }


# ─────────────────────────────────────────────
#  Helper interno
# ─────────────────────────────────────────────
def _err(mensaje):
    return {'ok': False, 'accion': 'error', 'mensaje': mensaje, 'data': {}}