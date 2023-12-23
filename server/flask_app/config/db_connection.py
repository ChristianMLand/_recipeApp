import psycopg2
import psycopg2.extras
import os

class MySQLConnection:
    def __init__(self):
        self.connection = psycopg2.connect(
            os.getenv("DB_URI"),
            cursor_factory = psycopg2.extras.RealDictCursor,
        )
        self.connection.autocommit = True
    def run_query(self, query:str, data:dict=None):
        with self.connection.cursor() as cursor:
            try:
                combined_query = cursor.mogrify(query, data)
                print("Running Query:", combined_query)
                cursor.execute(query, data)
                stripped_query = combined_query.decode("utf-8").lower().strip()
                # do structured pattern matching here instead?
                if stripped_query.startswith("select"):
                    return cursor.fetchone() if "limit 1" in stripped_query else cursor.fetchall()
                elif stripped_query.startswith("insert"):
                    return cursor.fetchone()
            except Exception as e:
                print("PostgresQL query has failed: ", e)
                return False
            finally:
                self.connection.close()

def connect() -> MySQLConnection:
    return MySQLConnection()