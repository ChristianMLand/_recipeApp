from flask_app import bcrypt
from . import Model, recipe_model, collection_model
# from datetime import datetime
import re

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')

@Model("users")
class User:
    id : int
    username : str
    email : str
    password : str

    @classmethod
    def create(cls, **data):
        data['password'] = bcrypt.generate_password_hash(data['password']).decode("utf-8")
        data.pop("confirm_password")
        return super().create(**data)

    @property
    def created_recipes(self):
        return recipe_model.Recipe.retrieve_all(user_id=self.id)

    @property
    def created_collections(self):
        return collection_model.Collection.retrieve_all(user_id=self.id)
    
    @staticmethod
    def validate(**data):
        errors = {}
        user = User.retrieve_one(email = data['email'] if 'email' in data else data['login_email'])

        if "username" in data and len(data["username"]) < 2:
            errors["username"] = "Username should be at least 2 characters"
        if "email" in data and not EMAIL_REGEX.match(data['email']):
            errors["email"] = "Email format is invalid"
        elif "email" in data and user:
            errors['email'] = "Email is already in use"
        if 'password' in data and len(data['password']) < 8:
            errors['password'] = 'Password should be at least 8 characters'
        elif 'confirm_password' in data and 'password' in data and data['password'] != data['confirm_password']:
            errors['confirm_password'] = 'Passwords do not match'

        if "login_email" in data and not (user and bcrypt.check_password_hash(user.password, data['login_password'])):
            errors['login_password'] = 'Invalid Credentials'

        return errors