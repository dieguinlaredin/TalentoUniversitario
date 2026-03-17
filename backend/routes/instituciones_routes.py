from flask import Blueprint, request, jsonify
from ..services.instituciones_service import (
    generar_codigo_unico,
    registrar_institucion_service,
    listar_instituciones_service,
)

instituciones_bp = Blueprint('instituciones', __name__)


@instituciones_bp.route('/api/instituciones', methods=['GET'])
def listar_instituciones():
    resultado = listar_instituciones_service()
    return jsonify(resultado), 200

@instituciones_bp.route('/api/instituciones/preview-codigo', methods=['GET'])
def preview_codigo():
    codigo = generar_codigo_unico()
    return jsonify({'ok': True, 'codigo': codigo}), 200

@instituciones_bp.route('/api/instituciones', methods=['POST'])
def registrar_institucion():
    datos = request.get_json(silent=True)
    if not datos:
        return jsonify({
            'ok': False,
            'codigo': None,
            'mensaje': 'Cuerpo de la petición inválido o vacío.',
        }), 400

    datos_limpios = {k: v.strip() if isinstance(v, str) else v
                     for k, v in datos.items()}

    resultado = registrar_institucion_service(datos_limpios)
    status = 201 if resultado['ok'] else 400
    return jsonify(resultado), status