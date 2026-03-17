import mysql.connector
from mysql.connector import Error

def get_connection():
    try:
        connection = mysql.connector.connect(
            host="mysql.railway.internal",
            user="root",
            password="yuuiRhHjXpeORsxKmWtwNjIwanAtDPwS",
            database="railway",
            port=3306
        )

        return connection

    except Error as ex:
        print("Error conectando a la base de datos:", ex)
        return None
