from ..database.connection import get_connection

# ─────────────────────────────────────────────
# Verificar si un código ya existe
# ─────────────────────────────────────────────

def codigo_existe(codigo: str) -> bool:
    connection = get_connection()
    if not connection:
        # Sin conexión asumimos que podría existir para no generar duplicados
        return True
    try:
        cursor = connection.cursor()
        cursor.execute(
            "SELECT 1 FROM codigo_instituciones WHERE codigo = %s LIMIT 1",
            (codigo,)
        )
        return cursor.fetchone() is not None
    finally:
        cursor.close()
        connection.close()


# ─────────────────────────────────────────────
# Guardar institución y su código (en orden)
# ─────────────────────────────────────────────

def guardar_institucion(datos: dict) -> bool:
    connection = get_connection()
    if not connection:
        return False
    try:
        cursor = connection.cursor()

        # Insertar la universidad
        cursor.execute(
            """
            INSERT INTO instituciones
                (nombre, cct, ciudad, estado, email, telefono)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                datos.get('nombreInstitucion'),
                datos.get('cct'),
                datos.get('ciudad'),
                datos.get('estado'),
                datos.get('correo'),
                datos.get('telefono'),
            )
        )
        institucion_id = cursor.lastrowid

        # Insertar el código asociado a esa institución
        cursor.execute(
            """
            INSERT INTO codigo_instituciones (codigo, institucion_id)
            VALUES (%s, %s)
            """,
            (datos.get('codigoInstitucional'), institucion_id)
        )

        connection.commit()
        return True
    except Exception as ex:
        connection.rollback()
        print(f'Error al guardar institución: {ex}')
        return False
    finally:
        cursor.close()
        connection.close()


# ─────────────────────────────────────────────
# Obtener todas las instituciones registradas
# ─────────────────────────────────────────────

def obtener_todas_instituciones() -> list:
    connection = get_connection()
    
    if not connection:
        return []
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT
                i.institucion_id,
                i.nombre        AS nombreInstitucion,
                i.cct,
                i.ciudad,
                i.estado,
                i.email         AS correo,
                i.telefono,
                ci.codigo       AS codigoInstitucional
            FROM instituciones i
            LEFT JOIN codigo_instituciones ci
                   ON i.institucion_id = ci.institucion_id
            ORDER BY i.institucion_id ASC
            """
        )
        return cursor.fetchall()
    finally:
        cursor.close()
        connection.close()