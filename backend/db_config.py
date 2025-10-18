import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

load_dotenv()

db_config = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", "1234"),
    "database": os.getenv("DB_NAME", "nitc_mp_db")
}

connection_pool = pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **db_config)

def get_db():
    return connection_pool.get_connection()
