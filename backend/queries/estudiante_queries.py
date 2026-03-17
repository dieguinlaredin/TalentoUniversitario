from ..database.connection import get_connection


def get_estudiante_by_usuario_id(usuario_id):
    connection = get_connection()
    
    if not connection:
        return None
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT *
            FROM estudiantes
            WHERE usuario_id = %s
            """,
            (usuario_id,)
        )
        return cursor.fetchone()
    
    finally:
        cursor.close()
        connection.close()


def get_carrera_id_by_nombre(nombre_carrera):
    if not nombre_carrera:
        return None
    
    connection = get_connection()
    
    if not connection:
        return None
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
            SELECT carrera_id
            FROM carreras
            WHERE nombre = %s
            LIMIT 1
            """,
            (nombre_carrera,)
        )
        row = cursor.fetchone()
        return row[0] if row else None
    
    finally:
        cursor.close()
        connection.close()


def get_carreras_por_institucion(institucion_id):
    if not institucion_id:
        return []
    
    connection = get_connection()
    
    if not connection:
        return []
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT carrera_id, nombre, nivel
            FROM carreras
            WHERE institucion_id = %s
            ORDER BY nombre
            """,
            (institucion_id,)
        )
        return cursor.fetchall() or []
    
    finally:
        cursor.close()
        connection.close()


def crear_estudiante(usuario_id, nombre, promedio, tipo_periodo,
                     periodo_numero, disponibilidad, carrera_id,
                     institucion_id, portafolio_url=None):
    
    connection = get_connection()
    
    if not connection:
        return False
    
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
            INSERT INTO estudiantes (
                usuario_id, nombre, promedio, tipo_periodo, periodo_numero,
                disponibilidad, carrera_id, institucion_id, portafolio_url
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                usuario_id, nombre, promedio, tipo_periodo, periodo_numero,
                disponibilidad, carrera_id, institucion_id, portafolio_url
            )
        )
        connection.commit()
        return True
    
    finally:
        cursor.close()
        connection.close()


def actualizar_estudiante(usuario_id, nombre, promedio, tipo_periodo,
                          periodo_numero, disponibilidad, carrera_id):
    
    connection = get_connection()

    if not connection:
        return False
    
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
            UPDATE estudiantes
            SET nombre = %s,
                promedio = %s,
                tipo_periodo = %s,
                periodo_numero = %s,
                disponibilidad = %s,
                carrera_id = %s
            WHERE usuario_id = %s
            """,
            (nombre, promedio, tipo_periodo, periodo_numero,
             disponibilidad, carrera_id, usuario_id)
        )
        connection.commit()
        return cursor.rowcount > 0
    
    finally:
        cursor.close()
        connection.close()


def actualizar_portafolio(usuario_id, url):
    connection = get_connection()

    if not connection:
        return False
    
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
            UPDATE estudiantes
            SET portafolio_url = %s
            WHERE usuario_id = %s
            """,
            (url, usuario_id)
        )
        connection.commit()
        return cursor.rowcount > 0
    
    finally:
        cursor.close()
        connection.close()
