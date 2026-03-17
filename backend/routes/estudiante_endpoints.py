from flask import Blueprint, request, jsonify
from ..services.estudiante_service import (
    guardar_perfil_academico_service,
    guardar_portafolio_service
)
from ..queries.estudiante_queries import get_carreras_por_institucion


estudiante_bp = Blueprint('estudiante', __name__)

@estudiante_bp.route('/api/perfil-academico', methods=['POST'])
def perfil_academico():
    body = request.get_json(silent=True)
    
    if not body:
        return jsonify({'ok': False, 'accion': 'error',
                        'mensaje': 'Cuerpo de la petición inválido.'}), 400

    resultado = guardar_perfil_academico_service(body)
    status = 200 if resultado['ok'] else 400
    return jsonify(resultado), status


@estudiante_bp.route('/api/carreras', methods=['GET'])
def carreras():
    institucion_id = request.args.get('institucion_id')
    
    if not institucion_id:
        return jsonify({'ok': False, 'mensaje': 'institucion_id es requerido.'}), 400

    try:
        institucion_id = int(institucion_id)
    except ValueError:
        return jsonify({'ok': False, 'mensaje': 'institucion_id inválido.'}), 400

    carreras = get_carreras_por_institucion(institucion_id)
    return jsonify({'ok': True, 'carreras': carreras}), 200


@estudiante_bp.route('/api/portafolio', methods=['POST'])
def portafolio():
    body = request.get_json(silent=True)
    
    if not body:
        return jsonify({'ok': False, 'accion': 'error',
                        'mensaje': 'Cuerpo de la petición inválido.'}), 400

    resultado = guardar_portafolio_service(body)
    status = 200 if resultado['ok'] else 400
    return jsonify(resultado), status
