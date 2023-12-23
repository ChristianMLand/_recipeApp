from flask import request, session, jsonify
from functools import wraps

def validate_model(cls):
    def inner(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            error = cls.validate(**request.json)
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