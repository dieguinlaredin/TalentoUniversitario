import os
import mysql.connector

def get_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("MYSQLHOST, shuttle.proxy.rlwy.net"),
            port=int(os.getenv("MYSQLPORT", 3306, 15913)),
            user=os.getenv("MYSQLUSER, root"),
            password=os.getenv("MYSQLPASSWORD, yuuIRhHjXpeORsxKmWtwNjlWanAtDPwS"),
            database=os.getenv("MYSQLDATABASE, talento_universitario"),
            autocommit=True
        )

      

        print("Conexion exitosa a MySQL")

        return connection

    except Exception as ex:
        print("Error conectando a la base de datos:", ex)
        return None
