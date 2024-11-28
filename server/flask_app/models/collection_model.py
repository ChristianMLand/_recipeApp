from . import Model, recipe_model, user_model
from flask_app.config.db_connection import connect

@Model("collections")
class Collection:
    id: int
    title: str
    user_id: int

    @property
    def creator(self):
        return user_model.User.retrieve_one(id=self.user_id)

    @property
    def recipes(self):
        query = f"""
                SELECT recipes.* FROM collections
                JOIN collection_has_recipes
                ON collection_has_recipes.collection_id = collections.id
                JOIN recipes
                ON collection_has_recipes.recipe_id = recipes.id
                WHERE collections.id = '{self.id}';
                """
        rows = connect().run_query(query)
        return [recipe_model.Recipe(**row) for row in rows] if rows else []

    @classmethod
    def add(cls, **data):
        query = f"""
                INSERT INTO collection_has_recipes
                (collection_id, recipe_id)
                VALUES
                (%(collection_id)s, %(recipe_id)s);
                """
        return connect().run_query(query, data)

    @classmethod
    def remove(cls, **data):
        query = f"""
                DELETE FROM collection_has_recipes
                WHERE collection_id=%(collection_id)s AND recipe_id=%(recipe_id)s;
                """
        return connect().run_query(query, data)

    @staticmethod
    def validate(**data):
        errors = {}
        return errors
