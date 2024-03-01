import { useEffect, useRef, useState } from 'react';
import { Tab, Tabs, ExpandingTextarea } from '~/components';
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

export default function RecipeForm({ initialRecipe, service, onSuccess }) {
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
    const isMobile = useIsMobile();
    const [recipe, setRecipe] = useState(initializeRecipeState);

    const [imageUploadType, setImageUploadType] = useState("url");
    // logic for file upload and image preview
    const fileInputRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState();
    const [preview, setPreview] = useState();

    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const handleSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined);
            return;
        }
        setSelectedFile(e.target.files[0]);
    }

    

    const updateValue = e => {
        const { name, value } = e.target;
        setRecipe(currentRecipe => {
            return { ...currentRecipe, [name]: value };
        });
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const { data, error } = await service({
            ...recipe,
            ingredients: recipe.ingredients.split("\n").filter(ing => ing),
            instructions: recipe.instructions.split("\n").filter(ins => ins)
        });
        if (data && !error) onSuccess(data.id);
    }

    return (
        <form className={style.form} onSubmit={handleSubmit}>
            { 
                imageUploadType == "url" ? 
                <>
                    <img src={recipe.image || "http://placehold.it/257x200.jpg"} />
                    <label htmlFor='image'>Image URL: </label>
                    <input 
                        placeholder="Image" 
                        id="image" 
                        type="url" 
                        value={recipe.image} 
                        onChange={updateValue} 
                        name="image" 
                    />
                </>
                :
                <>
                    <div className="img__wrap">
                        <img 
                            className="img__img" 
                            src={preview ?? "http://placehold.it/257x200.jpg"} 
                        />
                        <p 
                            onClick={() => fileInputRef.current.click()} 
                            className="img__description_layer"
                        >Upload an Image</p>
                    </div>
                    <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept="image/*" 
                        onChange={handleSelectFile} 
                    />
                </>
            }
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
            { isMobile ? 
                <Tabs>
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
            <div className={style.buttonGroup}>
                <button type="button" onClick={() => navigate(-1)}>Cancel</button>
                <button type="submit">Save</button>
            </div>
        </form>
    );
}
