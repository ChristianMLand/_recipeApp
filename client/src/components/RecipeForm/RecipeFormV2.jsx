import { useEffect, useRef, useState, forwardRef } from 'react';
import { Tab, Tabs, ExpandingTextarea, Modal } from '~/components';
import style from './recipeForm.module.css';
import { useIsMobile } from '~/hooks';
import { useNavigate } from 'react-router-dom';

// TODO use sessionStorage (works like localStorage) to keep track of form progress (clear after submitting)
// TODO add preview image button so that it doesnt constantly try to update the image on keypress
// TODO add file image upload instead of just url
const emptyRecipe = {
    title: "",
    servings: "",
    image: "",
    time: "",
    ingredients: "",
    instructions: "",
};

export default forwardRef(function RecipeForm({ initialRecipe, service, onSuccess }, ref) {
    const initializeRecipeState = () => {
        if (initialRecipe) {
            const recipeCopy = structuredClone(initialRecipe);
            recipeCopy.ingredients = recipeCopy.ingredients.join("\n");
            recipeCopy.instructions = recipeCopy.instructions.join("\n\n");
            return recipeCopy;
        } else {
            return emptyRecipe;
        }
    }
    const navigate = useNavigate();
    const cameraInputRef = useRef(null);
    const modalRef = useRef(null);
    const isMobile = useIsMobile();
    const [recipe, setRecipe] = useState(initializeRecipeState);

    const [imageUploadType, setImageUploadType] = useState("url");
    // logic for file upload and image preview
    const fileInputRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState();
    const [preview, setPreview] = useState(); 

    useEffect(() => {
        modalRef.current.close();
        if (!selectedFile) {
            setPreview(recipe?.image ?? initialRecipe?.image);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    // TODO upload file to cloudinary and then set image url to that url
    // TODO make sure to delete image from cloudinary if they change image again
    // TODO also make sure to delete image from cloudinary if they cancel editing/creating
    const handleSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined);
            return;
        }
        setSelectedFile(e.target.files[0]);

        setRecipe(current => ({ ...current, "image": "" }));
    }

    const updateValue = e => {
        const { name, value } = e.target;
        setRecipe(currentRecipe => {
            return { ...currentRecipe, [name]: value };
        });

        if (name === "image") {
            setSelectedFile(null);
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const fdata = new FormData(e.target);
        fdata.set("image", recipe.image || selectedFile)

        // const jData = {
        //     ...recipe,
        //     ingredients: recipe.ingredients.split("\n").filter(ing => ing),
        //     instructions: recipe.instructions.split("\n").filter(ins => ins),
        //     image: recipe?.image || selectedFile
        // }
        const { data, error } = await service(fdata);
        console.log("ERROR", error);
        if (data && !error) onSuccess(data.id);
    }

    return (
        <form ref={ref} className={style.form} onSubmit={handleSubmit}>
            <Modal ref={modalRef}>
                <div>
                    <button type="button" onClick={() => cameraInputRef.current.click()}>Take Picture</button>
                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleSelectFile}
                    />
                    <button type="button" onClick={() => fileInputRef.current.click()}>Upload Photo</button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleSelectFile}
                    />
                </div>
                <hr className={style.divider} data-content="OR" />
                <input
                    placeholder="Paste an image uri"
                    id="image"
                    type="url"
                    defaultValue={recipe.image}
                    onBlur={updateValue}
                    name="image"
                />
            </Modal>
            <div
                onClick={() => modalRef.current.showModal()}
                className={`${style.imgContainer} ${preview || style.empty}`}
            >
                <img src={preview} className={preview ? "" : style.hidden} />
                <i className="fa-solid fa-image" />
                <p>Upload an Image</p>
            </div>
            <label htmlFor='title'>Title: </label>
            <input
                placeholder='Title'
                id='title'
                type="text"
                value={recipe.title}
                onChange={updateValue}
                name="title"
            />
            <label htmlFor='time'>Time in Minutes: </label>
            <input
                placeholder="Time in minutes"
                id="time"
                min={1}
                max={1440}
                type="number"
                value={recipe.time}
                onChange={updateValue}
                name="time"
            />
            <label htmlFor='servings'>Servings: </label>
            <input
                placeholder="Servings"
                id="servings"
                type="number"
                min={1}
                value={recipe.servings}
                onChange={updateValue}
                name="servings"
            />
            {isMobile ?
                <Tabs topOffset={50}>
                    <Tab title="Ingredients">
                        <ExpandingTextarea
                            name="ingredients"
                            value={recipe.ingredients}
                            onChange={updateValue}
                        />
                    </Tab>
                    <Tab title="Instructions">
                        <ExpandingTextarea
                            name="instructions"
                            value={recipe.instructions}
                            onChange={updateValue}
                        />
                    </Tab>
                </Tabs>
                :
                <>
                    <label htmlFor="ingredients">Ingredients: </label>
                    <ExpandingTextarea
                        name="ingredients"
                        value={recipe.ingredients}
                        onChange={updateValue}
                    />
                    <label htmlFor="instructions">Instructions: </label>
                    <ExpandingTextarea
                        name="instructions"
                        value={recipe.instructions}
                        onChange={updateValue}
                    />
                </>
            }
        </form>
    );
});
