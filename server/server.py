import os
from flask_app import app
from flask_app.controllers import recipe_controller, user_controller

if __name__ == "__main__":
    app.run(
        port=os.getenv("PORT"), 
        debug=os.getenv("MODE") == "dev",
        # host='192.168.1.6'
    )