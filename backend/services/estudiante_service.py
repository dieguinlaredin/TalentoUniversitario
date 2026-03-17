from ..queries.estudiante_queries import (
    get_estudiante_by_usuario_id,
    get_carrera_id_by_nombre,
    crear_estudiante,
    actualizar_estudiante,
    actualizar_portafolio
)


def guardar_perfil_academico_service(payload):

    usuario_id = payload.get('usuario_id')
    nombre = (payload.get('nombreCompleto') or '').strip()
    disponibilidad = (payload.get('disponibilidad') or '').strip()
    nombre_carrera = (payload.get('nombreCarrera') or '').strip()
    nivel = (payload.get('nivel') or '').strip()
    promedio = payload.get('promedio')
    tipo_periodo = (payload.get('tipoPeriodo') or '').strip()
    numero_periodo = payload.get('numeroPeriodo')

    if not usuario_id:
        return _err('No se encontró el identificador del usuario.')
    if not nombre:
        return _err('El nombre completo es obligatorio.')
    if not disponibilidad:
        return _err('La disponibilidad es obligatoria.')
    if not nombre_carrera:
        return _err('La carrera es obligatoria.')
    if not nivel:
        return _err('El nivel es obligatorio.')
    if not promedio:
        return _err('El promedio es obligatorio.')
    if not tipo_periodo:
        return _err('El tipo de periodo es obligatorio.')
    if not numero_periodo:
        return _err('El número de periodo es obligatorio.')

    # Normalizar tipos
    try:
        promedio = float(promedio)
    except TypeError:
        return _err('El promedio debe ser un número válido.')

    try:
        numero_periodo = int(numero_periodo)
    except TypeError:
        return _err('El número de periodo debe ser un número entero válido.')

    disponibilidad_bool = True if disponibilidad.lower() in ('1', 'true', 'disponible', 'si', 'sí') else False

    carrera_id = get_carrera_id_by_nombre(nombre_carrera)
    if carrera_id is None:
        return _err('La carrera seleccionada no existe en el sistema.')

    estudiante = get_estudiante_by_usuario_id(usuario_id)
    if estudiante:
        ok = actualizar_estudiante(
            usuario_id=usuario_id,
            nombre=nombre,
            promedio=promedio,
            tipo_periodo=tipo_periodo,
            periodo_numero=numero_periodo,
            disponibilidad=disponibilidad_bool,
            carrera_id=carrera_id
        )
    else:
        institucion_id = payload.get('institucion_id')
        if not institucion_id:
            return _err('No se pudo determinar la institución del estudiante.')
        ok = crear_estudiante(
            usuario_id=usuario_id,
            nombre=nombre,
            promedio=promedio,
            tipo_periodo=tipo_periodo,
            periodo_numero=numero_periodo,
            disponibilidad=disponibilidad_bool,
            carrera_id=carrera_id,
            institucion_id=institucion_id,
            portafolio_url=None
        )

    if not ok:
        return _err('No se pudo guardar el perfil académico. Intenta de nuevo.')

    return {'ok': True, 'mensaje': 'Perfil académico guardado correctamente.', 'data': {}}


def guardar_portafolio_service(payload):
    usuario_id = payload.get('usuario_id')
    url = (payload.get('urlPortafolio') or '').strip() or None

    if not usuario_id:
        return _err('No se encontró el identificador del usuario.')

    estudiante = get_estudiante_by_usuario_id(usuario_id)
    if not estudiante:
        return _err('Primero debes completar tu perfil académico.')

    ok = actualizar_portafolio(usuario_id, url)
    if not ok:
        return _err('No se pudo guardar la URL del portafolio. Intenta de nuevo.')

    return {'ok': True, 'mensaje': 'URL de portafolio guardada correctamente.', 'data': {}}


def _err(mensaje):
    return {'ok': False, 'accion': 'error', 'mensaje': mensaje, 'data': {}}