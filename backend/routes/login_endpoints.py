from flask import Blueprint, request, jsonify
from ..services.login_service import login_service, registrar_service

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/login', methods=['POST'])
def login():
    body = request.get_json(silent=True)
    
    if not body:
        return jsonify({'ok': False, 'accion': 'error',
                        'mensaje': 'Cuerpo de la petición inválido.'}), 400

    correo  = (body.get('correo') or '').strip()
    passwd  = body.get('contrasena') or ''
    codigo  = (body.get('codigoInstitucional') or '').strip()

    resultado = login_service(correo, passwd, codigo)

    status = 200 if resultado['ok'] else 401
    return jsonify(resultado), status


@auth_bp.route('/api/registro', methods=['POST'])
def registro():
    body = request.get_json(silent=True)
    
    if not body:
        return jsonify({'ok': False, 'accion': 'error',
                        'mensaje': 'Cuerpo de la petición inválido.'}), 400

    correo  = (body.get('correo') or '').strip()
    passwd  = body.get('contrasena') or ''
    codigo  = (body.get('codigoInstitucional') or '').strip()

    resultado = registrar_service(correo, passwd, codigo)

    status = 201 if resultado['ok'] else 400
    return jsonify(resultado), status