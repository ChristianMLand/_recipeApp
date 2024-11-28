import psycopg2
from psycopg2.extras import RealDictCursor
import os
from colorama import Fore

class MySQLConnection:
    def __init__(self):
        self.connection = psycopg2.connect(
            os.getenv("DB_URI"),
            cursor_factory = RealDictCursor,
        )
        self.connection.autocommit = True
    def run_query(self, query:str, data:dict=None):
        with self.connection.cursor() as cursor:
            try:
                formatted = '\n'.join(x.strip() for x in cursor.mogrify(query, data).decode("utf-8").splitlines())
                print(f"Running query: {Fore.LIGHTYELLOW_EX}{formatted}")
                cursor.execute(formatted, data)
                stripped_query = formatted.strip().lower()
                if stripped_query.startswith("select"):
                    return cursor.fetchone() if "limit 1" in stripped_query else cursor.fetchall()
                elif stripped_query.startswith("insert"):
                    return cursor.fetchone()
            except Exception as e:
                print(f"PostgreSQL query failed: {Fore.LIGHTRED_EX}{e}")
                return False
            finally:
                self.connection.close()

def connect() -> MySQLConnection:
    return MySQLConnection()