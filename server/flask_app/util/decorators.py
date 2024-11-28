from flask import request, session, jsonify
from functools import wraps

# TODO consider tweaking to work with both request.json and request.form
def validate_model(cls):
    def inner(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            data = request.json if request.content_type == "application/json" else request.form
            error = cls.validate(**data)
            if error:
                return jsonify(error), 400
            return func(*args, **kwargs)
        return wrapper
    return inner

def enforce_login(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if "id" not in session:
            return jsonify({ "error" : "unauthorized" }), 401
        return func(*args,**kwargs)
    return wrapper

def enforce_owner(cls):
    def inner(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            from_db = cls.retrieve_one(**kwargs)
            if from_db.user_id != session["id"]:
                return jsonify({ "error": "unauthorized"}), 403
            return func(from_db, *args, **kwargs)
        return wrapper
    return inner