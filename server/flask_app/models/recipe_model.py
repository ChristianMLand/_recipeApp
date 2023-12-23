from . import base_model
from dataclasses import dataclass
# from datetime import datetime

@dataclass
class Recipe(base_model.Model):
    id : int
    title : str
    servings : int
    time : int
    ingredients : list[str]
    instructions : list[str]
    image : str
    user_id : int
    table = "recipes"

    # @classmethod
    # def create(cls, **data):
    #     # handle creation
    #     return super().create(**data)
    
    @staticmethod
    def validate(**data):
        errors = {}
        return errors