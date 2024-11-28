from flask_app import app
from flask import jsonify, request, session
from flask_app.models import Recipe, Collection
from flask_app.util import (
    upload_image,
    delete_image,
    parse_recipe,
    convert_to_list,
    validate_model, 
    enforce_login,
    enforce_owner
)


@app.get("/api/recipes")
@enforce_login
def get_all_recipes():
    limit = request.args.get("limit")
    offset = request.args.get("offset")
    all_recipes = Recipe.retrieve_all(user_id=session["id"], limit=limit, offset=offset)
    return jsonify([r.as_json(populate=["collections"]) for r in all_recipes])


@app.get("/api/collections")
@enforce_login
def get_all_collections():
    all_collections = Collection.retrieve_all(user_id=session["id"])
    return jsonify([c.as_json(populate=["recipes"]) for c in all_collections])


@app.get("/api/collections/<id>")
@enforce_login
def get_collection(id):
    one_collection = Collection.retrieve_one(id=id)
    return jsonify(one_collection.as_json(populate=["recipes"]))

# TODO utilize validate_model decorator
@app.post("/api/collections")
@enforce_login
def create_collection():
    data = {**request.json}
    data["user_id"] = session["id"]
    collection_id = Collection.create(**data)
    return jsonify({"id": collection_id})


@app.post("/api/collection-has-recipes")
@enforce_login
def add_recipe_to_collection():
    data = {**request.json}
    one_collection = Collection.retrieve_one(id=data["collection_id"])
    if one_collection.user_id == session["id"]:
        one_collection.add(data["recipe_id"])
    return "success", 200


@app.delete("/api/collection-has-recipes")
@enforce_login
def remove_recipe_from_collection():
    data = {**request.json}
    one_collection = Collection.retrieve_one(id=data["collection_id"])
    if one_collection.user_id == session["id"]:
        one_collection.remove(data["recipe_id"])
    return "success", 200

@app.patch("/api/collections/<id>")
@enforce_owner(Collection)
@enforce_login
def update_collection(from_db, id):
    from_db.update(**request.json)
    return "success", 200


@app.delete("/api/collections/<id>")
@enforce_owner(Collection)
@enforce_login
def delete_collection(from_db, id):
    print("COLLECTION TO DELETE", from_db)
    from_db.delete()
    return "success", 200


@app.get("/api/recipes/<id>")
def get_recipe(id):
    one_recipe = Recipe.retrieve_one(id=id)
    return jsonify(one_recipe.as_json(populate=["collections"]))


@app.delete("/api/recipes/<id>")
@enforce_owner(Recipe)
@enforce_login
def delete_recipe(from_db, id):
    from_db.delete()
    delete_image(id)
    return "success", 200

# TODO re-write so that can work with validate_model decorator
@app.post("/api/recipes")
@enforce_login
def create_recipe():
    match request.args:
        case {"extract": _}:
            try:
                data = parse_recipe(
                    request.json.get("url"), 
                    request.headers.get("User-Agent")
                )
            except Exception as e:
                return jsonify({"error": "extraction failed"}), 400
        case {"save": _}:
            recipe = Recipe.retrieve_one(id=request.json.get("id"))
            if recipe and recipe.user_id != session["id"]:
                data = recipe.as_json()
                data.pop("id")
            else:
                return jsonify({"error": "invalid recipe id"}), 400
        case _:
            data = {**request.form}
            if "collections" in data:
                data.pop("collections")
            data["ingredients"] = convert_to_list(data, "ingredients")
            data["instructions"] = convert_to_list(data, "instructions")
            if request.files.get("image"):
                data["image"] = request.files.get("image")
    data["user_id"] = session["id"]
    image = data["image"]
    data["image"] = ""
    recipe_id = Recipe.create(**data)
    if request.content_type != "application/json":
        for cid in request.form.getlist("collections"):
            Collection.add(collection_id=cid,recipe_id=recipe_id)
    image_url = upload_image(image, recipe_id)
    Recipe.update(id=recipe_id, image=image_url)
    return jsonify({"id": recipe_id})

# TODO utilize validate_model decorator
@app.put("/api/recipes/<id>")
@enforce_owner(Recipe)
@enforce_login
def update_recipe(from_db, id):
    data = {**request.form}
    img = None
    if "collections" in data:
        data.pop("collections")
        new_collections = set(request.form.getlist("collections"))
        old_collections = set(c.id for c in from_db.collections)
        diff = old_collections.symmetric_difference(new_collections)
        for cid in diff:
            if cid in old_collections:
                Collection.remove(collection_id=cid,recipe_id=id)
            else:
                Collection.add(collection_id=cid,recipe_id=id)
    else:
        for c in from_db.collections:
            Collection.remove(collection_id=c.id, recipe_id=from_db.id)

    if request.files.get("image"):
        img = request.files.get("image")
    elif "image" in data and from_db.image != data["image"]:
        img = data.image
    if img:
        data["image"] = upload_image(img, id)
    if "id" in data:
        data.pop("id")
    data["ingredients"] = convert_to_list(data, "ingredients")
    data["instructions"] = convert_to_list(data,"instructions")
    from_db.update(**data)
    return "success", 200