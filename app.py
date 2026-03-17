from flask import Flask, send_from_directory
from backend.routes.login_endpoints import auth_bp
from backend.routes.estudiante_endpoints import estudiante_bp
from backend.routes.instituciones_routes import instituciones_bp

import os

app = Flask(__name__, static_folder='.', static_url_path='')
app.secret_key = 'secret_key'

app.register_blueprint(auth_bp)
app.register_blueprint(estudiante_bp)
app.register_blueprint(instituciones_bp)

@app.route('/')
def login():
    return send_from_directory('.', 'login.html')

@app.route('/index')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/admin')
def admin():
    return send_from_directory('.', 'admin.html')

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)