from flask_app import app
from flask import jsonify, request, session, render_template
from flask_app.models import User
from flask_app.util import validate_model, enforce_login

@app.get("/ping")
def ping():
    return "pong", 200

@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")

@app.get("/api/auth")
@enforce_login
def get_logged_user():
    session.modified = True
    logged_user = User.retrieve_one(id=session["id"])
    return jsonify(logged_user)

# TODO password recovery feature
'''
when someone requests new password, should send email to their provided email with a link attached
link should be a salted hash of their id
clicking link takes them to a form to reset their password
'''

# TODO think about how email authentication could be done by sending a verification email
'''
would probably create a user in the db with a flag for enabled/disabled
would not send back user id or object with the response
then attempt to send an email to their provided email with a link to verify
if they verify within x amount of time by clicking the attached link, the user their flag updated to enabled
link would probably just be an endpoint with their newly created user-id (maybe salted hashed?)
if a user already has flag enabled, and then visits link, should give a message they already verified (or just redirect?)
if the user is still disabled after x amount of time, delete the user from db
'''
@app.post("/api/auth")
@validate_model(User)
def register():
    logged_user = None
    session.clear()
    if request.args.get("login"):
        logged_user = User.retrieve_one(email=request.json["login_email"].lower())
        session["id"] = logged_user.id
    else:
        user_data = {**request.json, "email": request.json["email"].lower()}
        session["id"] = User.create(**user_data)
        logged_user = User.retrieve_one(id=session["id"])
    session.permanent = True
    return jsonify(logged_user)

@app.delete("/api/auth")
@enforce_login
def logout():
    session.clear()
    return "success", 200