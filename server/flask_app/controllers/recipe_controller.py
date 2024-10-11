from flask_app import app
from flask import jsonify, request, session
from flask_app.models.recipe_model import Recipe
from flask_app.models.user_model import User
# from flask_app.models.collection_model import Collection
from flask_app.controllers import validate_model, enforce_login
from recipe_scrapers import scrape_html
from flask_app.util.unit_converter import standardize_units
import requests


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
    return "success", 200

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
        data = request.json
        data["user_id"] = session["id"]
        data["ingredients"] = [standardize_units(ingredient) for ingredient in data["ingredients"]]
    recipe_id = Recipe.create(**data)
    return jsonify({ "id" : recipe_id })

@app.put("/api/recipes/<id>")
@enforce_login
def update_recipe(id):
    data = request.json
    data.pop("id")
    data["ingredients"] = [standardize_units(ingredient) for ingredient in data["ingredients"]]
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



