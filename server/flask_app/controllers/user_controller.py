from flask_app import app
from flask import jsonify, request, session, render_template
from flask_app.models.user_model import User
from flask_app.controllers import validate_model, enforce_login

@app.get("/ping")
def ping():
    return "pong", 200

@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")

@app.get("/api/auth")
@enforce_login
def get_logged_user():
    logged_user = User.retrieve_one(id=session["id"])
    return jsonify(logged_user.as_json())

@app.post("/api/auth")
@validate_model(User)
def register():
    logged_user = None
    if request.args.get("login"):
        logged_user = User.retrieve_one(email=request.json["login_email"].lower())
        session["id"] = logged_user.id
    else:
        user_data = {**request.json, "email": request.json["email"].lower()}
        session["id"] = User.create(**user_data)
        logged_user = User.retrieve_one(id=session["id"])
    return jsonify(logged_user.as_json())

@app.delete("/api/auth")
@enforce_login
def logout():
    session.clear()
    return "success", 200