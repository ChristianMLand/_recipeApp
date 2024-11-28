from . import Model, collection_model, user_model, BaseModel
from flask_app.config.db_connection import connect
from dataclasses import dataclass

from datetime import datetime


# @dataclass
@Model("recipes")
class Recipe:
    id: int
    title: str
    servings: int
    time: int
    ingredients: list[str]
    instructions: list[str]
    image: str
    user_id: int
    created_at: datetime
    updated_at: datetime

    @property
    def creator(self):
        return user_model.User.retrieve_one(id=self.user_id)

    @classmethod
    def retrieve_all(cls, limit=None, offset=None, **data):
        query = f"""
                SELECT recipes.* FROM recipes
                {"WHERE " + cls.format_data(" AND ", data) if data else ""}
                ORDER BY recipes.updated_at DESC
                """
                # {"LIMIT " + limit if limit != None else ""}
                # {"OFFSET " + offset if offset != None else ""};
        rows = connect().run_query(query, data)
        return [cls(**row) for row in rows] if rows else []

    @property
    def collections(self):
        query = f"""
                SELECT collections.* FROM collections
                JOIN collection_has_recipes
                ON collection_has_recipes.collection_id = collections.id
                JOIN recipes
                ON collection_has_recipes.recipe_id = recipes.id
                WHERE recipes.id = '{self.id}';
                """
        rows = connect().run_query(query)
        return [collection_model.Collection(**row) for row in rows] if rows else []

    @staticmethod
    def validate(**data):
        errors = {}
        return errors
