import random
import string
from ..queries.institucion_queries import (
    codigo_existe,
    guardar_institucion,
    obtener_todas_instituciones,
)

# ─────────────────────────────────────────────
# Generación de código único
# ─────────────────────────────────────────────

def _generar_codigo_candidato() -> str:
    digitos = ''.join(random.choices(string.digits, k=8))
    return f'INST-{digitos}'


def generar_codigo_unico() -> str:
    while True:
        candidato = _generar_codigo_candidato()
        if not codigo_existe(candidato):
            return candidato


# ─────────────────────────────────────────────
# Registrar institución con código único
# ─────────────────────────────────────────────

def registrar_institucion_service(datos: dict) -> dict:
    campos_requeridos = ['nombreInstitucion', 'cct', 'correo',
                         'telefono', 'ciudad', 'estado']
    
    for campo in campos_requeridos:
        if not datos.get(campo, '').strip():
            return {
                'ok': False,
                'codigo': None,
                'mensaje': f'El campo "{campo}" es obligatorio.',
            }

    codigo = generar_codigo_unico()
    datos['codigoInstitucional'] = codigo

    exito = guardar_institucion(datos)
    if not exito:
        return {
            'ok': False,
            'codigo': None,
            'mensaje': 'Error al guardar la institución en la base de datos.',
        }

    return {
        'ok': True,
        'codigo': codigo,
        'mensaje': 'Institución registrada correctamente.',
    }


# ─────────────────────────────────────────────
# Listar instituciones registradas
# ─────────────────────────────────────────────

def listar_instituciones_service() -> dict:
    instituciones = obtener_todas_instituciones()
    return {
        'ok': True,
        'instituciones': instituciones,
    }