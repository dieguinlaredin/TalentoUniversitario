import mysql.connector
from mysql.connector import Error

def get_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='JazielSQL',
            database='talento_universitario'
        )
        return connection
    except Error as ex:
        print("Error conectando a la base de datos: ", ex)
        return None