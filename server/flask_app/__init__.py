from flask import Flask 
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os
import cloudinary
from colorama import init

init(autoreset=True)

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

CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)
cloudinary.config(secure=True)

from flask_app.models.base_model import ModelProvider

app.json_provider_class = ModelProvider
app.json = ModelProvider(app)