from flask import Flask 
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(
    __name__,
    static_url_path='',
    static_folder='../../client/dist',
    template_folder='../../client/dist'
)

app.config.update(
    SECRET_KEY=os.getenv("SECRET_KEY"),
    SESSION_COOKIE_SECURE=True
)

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)