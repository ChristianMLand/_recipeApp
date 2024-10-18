from flask_app import app
from flask import jsonify, request, session
from flask_app.models.recipe_model import Recipe
from flask_app.models.user_model import User
# from flask_app.models.collection_model import Collection
from flask_app.controllers import validate_model, enforce_login
from recipe_scrapers import scrape_html
from flask_app.util.unit_converter import standardize_units
import requests
import cloudinary
import cloudinary.uploader
# from cloudinary.utils import cloudinary_url
# from cloudinary import CloudinaryImage


@app.get("/api/recipes")
@enforce_login
def get_all_recipes():
    # TODO add pagination?
    all_recipes = Recipe.retrieve_all(user_id=session["id"])
    return jsonify([recipe.as_json() for recipe in all_recipes])

# @app.get("/api/collections")
# @enforce_login
# def get_all_collections():
#     all_collections = Collection.retrieve_all(user_id=session["id"])
#     return jsonify([collection.as_json() for collection in all_collections])

# not enforcing login so that way we can share links to uploaded recipes
@app.get("/api/recipes/<id>")
def get_recipe(id):
    one_recipe = Recipe.retrieve_one(id=id)
    # print(one_recipe)
    return jsonify(one_recipe.as_json())

@app.delete("/api/recipes/<id>")
@enforce_login
def delete_recipe(id):
    Recipe.delete(id=id)
    cloudinary.uploader.destroy(id, resource_type = "image")
    return "success", 200


#TODO refactor and cleanup api logic into services


@app.post("/api/recipes")
@enforce_login
def create_recipe():
    if request.args.get("extract"):
        try:
            url = request.json.get("url")
            user = User.retrieve_one(id=session["id"])
            html = requests.get(url, headers={"User-Agent": f"Recipe Saver {user.username}"}).content
            scraper = scrape_html(html, org_url=url, wild_mode=True)
            # print(scraper.ingredients())
            
            data = {
                "user_id" : session["id"],
                "title" : scraper.title(),
                "time" : scraper.total_time() if scraper.total_time() <= 1440 else 0,
                "servings" : scraper.yields().split(" ")[0],
                "ingredients" : [standardize_units(ingredient) for ingredient in scraper.ingredients()],
                "instructions" : scraper.instructions_list(),
                "image" : scraper.image()
            }
        except Exception as e:
            print("Extraction failed: ", e)
            return jsonify({ "error": "extraction failed"}), 400
    else:
        data = {**request.form}
        data["user_id"] = session["id"]
        data["ingredients"] = [standardize_units(ing) for ing in data["ingredients"].replace('\r','\n').split("\n") if ing != ""]
        data["instructions"] = [ins for ins in data["instructions"].replace('\r','\n').split("\n") if ins != ""]
        if request.files.get("image"):
            data["image"] = request.files.get("image")
    tmp = data["image"]
    data["image"] = ""
    recipe_id = Recipe.create(**data)
    try:
        upload_result = cloudinary.uploader.upload(
            tmp,
            public_id=recipe_id,
            transformation=[
                {"width": 750, "height": 750, "crop": "auto", "gravity": "auto"},
                {"quality":"auto"},
                {"fetch_format":"auto"}
            ]
        )
        Recipe.update(id=recipe_id, image=upload_result["secure_url"])
        print("Successfully uploaded", upload_result["secure_url"])
    except Exception as e:
        print(f"Error:", e)
    return jsonify({ "id" : recipe_id })

@app.put("/api/recipes/<id>")
@enforce_login
def update_recipe(id):
    data = {**request.form}
    print(f"Data: {data}")
    from_db = Recipe.retrieve_one(id=id)
    img = None
    if request.files.get("image"):
        img = request.files.get("image")
    elif "image" in data and from_db.image != data["image"]:
        img = data.image
    if img:
        try:
            upload_result = cloudinary.uploader.upload(
                img,
                public_id=id,
                transformation=[
                    {"width": 750, "height": 750, "crop": "auto", "gravity": "auto"},
                    {"quality":"auto"},
                    {"fetch_format":"auto"}
                ]
            )
            data["image"] = upload_result["secure_url"]
            print("Successfully uploaded", upload_result["secure_url"])
        except Exception as e:
            print(f"Error:", e)
            return "failure", 400
    if "id" in data:
        data.pop("id")
    data["ingredients"] = [standardize_units(ing) for ing in data["ingredients"].replace('\r','\n').split("\n") if ing]
    data["instructions"] = [ins for ins in data["instructions"].replace('\r','\n').split("\n") if ins]
    Recipe.update(id=id, **data)
    return "success", 200


# @app.patch("/api/recipes/<id>")
# @enforce_login
# def add_recipe_to_collections(id):

#     pass

# @app.post("/api/collections")
# @enforce_login
# def create_collection():
#     pass

# @app.patch("/api/collections/<id>")
# @enforce_login
# def update_collection(id):
#     pass



