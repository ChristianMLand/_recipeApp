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

    # @property
    # def collections(self) -> list[Collection]:
    #     pass
    #     return [entry.collection for entry in Entries.retrieve_all(recipe_id=self.id)]
    
    @staticmethod
    def validate(**data):
        errors = {}
        return errors