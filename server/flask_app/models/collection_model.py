from . import base_model, recipe_model
from dataclasses import dataclass
# from datetime import datetime

@dataclass
class Collection(base_model.Model):
    id : int
    title : str
    user_id : int
    table = "collections"

    # @property
    # def recipes(self) -> list[recipe_model.Recipe]:
    #     pass
    #     return [entry.recipe for entry in Entries.retrieve_all(collection_id=self.id)]
    
    @staticmethod
    def validate(**data):
        errors = {}
        return errors