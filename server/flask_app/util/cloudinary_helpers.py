import cloudinary
import cloudinary.uploader


def upload_image(image, recipe_id):
    upload_result = cloudinary.uploader.upload(
        image,
        public_id=recipe_id,
        upload_preset="minify-recipe-thumb",
    )
    return upload_result["secure_url"]


def delete_image(image_id):
    cloudinary.uploader.destroy(image_id, resource_type="image")