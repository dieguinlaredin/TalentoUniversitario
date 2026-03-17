import os
import mysql.connector

def get_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("MYSQLHOST"),
            port=int(os.getenv("MYSQLPORT", 3306)),
            user=os.getenv("MYSQLUSER"),
            password=os.getenv("MYSQLPASSWORD"),
            database=os.getenv("MYSQLDATABASE"),
            autocommit=True
        )

        print("Conexion exitosa a MySQL")

        return connection

    except Exception as ex:
        print("Error conectando a la base de datos:", ex)
        return None
