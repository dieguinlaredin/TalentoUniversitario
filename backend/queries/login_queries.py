from ..database.connection import get_connection


def get_usuario_by_email(email):
    connection = get_connection()
    
    if not connection:
        return None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT u.usuario_id, u.email, u.passwd, r.nombre AS rol
            FROM usuarios u
            JOIN roles r ON u.rol_id = r.rol_id
            WHERE u.email = %s
            """,
            (email,)
        )
        return cursor.fetchone()
    
    finally:
        cursor.close()
        connection.close()


def get_institucion_by_codigo(codigo):
    connection = get_connection()
    
    if not connection:
        return None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT ci.codigo_id, ci.codigo, i.institucion_id,
                i.nombre, i.cct, i.ciudad, i.estado, i.email, i.telefono
            FROM codigo_instituciones ci
            JOIN instituciones i ON ci.institucion_id = i.institucion_id
            WHERE ci.codigo = %s
            """,
            (codigo,)
        )
        return cursor.fetchone()
    
    finally:
        cursor.close()
        connection.close()


def crear_usuario(email, passwd):
    connection = get_connection()
    
    if not connection:
        return None
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
            INSERT INTO usuarios (email, passwd, rol_id)
            VALUES (%s, %s, 2)
            """,
            (email, passwd)
        )
        connection.commit()
        return cursor.lastrowid
    
    finally:
        cursor.close()
        connection.close()