import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tab from '../components/Tab.jsx';
import Tabs from '../components/Tabs.jsx';

// use tabs to handle multi-part form?
// TODO use sessionStorage (works like localStorage) to keep track of form progress (clear after submitting)
// TODO add preview image button so that it doesnt constantly try to update the image on keypress
// TODO add file image upload instead of just url

export default function RecipeForm({ initialRecipe, service, onSuccess }) {
    
    const [recipe, setRecipe] = useState(() => {
        if (initialRecipe) {
            return { 
                ...initialRecipe, 
                ingredients: initialRecipe.ingredients.join("\n"),
                instructions: initialRecipe.instructions.join("\n\n"),
            }
        } else {
            return {
                title: "",
                servings: "",
                image: "",
                time: "",
                ingredients: "",
                instructions: "",
            }
        }
    });

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

    const [imageUploadType, setImageUploadType] = useState("url");

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

    const resizeTextArea = e => {
        const { name, value } = e.target;
        setRecipe(currentRecipe => {
            return { ...currentRecipe, [name]: value }
        });
    }

    return (
        <form id="recipe-form" onSubmit={handleSubmit}>
            { 
                imageUploadType == "url" ? 
                <>
                    <img className="img__img" src={recipe.image || "http://placehold.it/257x200.jpg"} />
                    <input placeholder="Image" type="url" value={recipe.image} onChange={updateValue} name="image" />
                </>
                :
                <>
                    <div className="img__wrap">
                        <img className="img__img" src={preview ?? "http://placehold.it/257x200.jpg"} />
                        <p onClick={() => fileInputRef.current.click()} className="img__description_layer">Upload an Image</p>
                    </div>
                    
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleSelectFile} />
                </>
            }
            <input placeholder='Title' type="text" value={recipe.title} onChange={updateValue} name="title" />
            <label htmlFor='time'>Time in Minutes: </label>
            <input placeholder="Time in minutes" id="time" min={1} max={1440} type="number" value={recipe.time} onChange={updateValue} name="time" />
            <label htmlFor='servings'>Servings: </label>
            <input placeholder="Servings" id="servings" type="number" min={1} value={recipe.servings} onChange={updateValue} name="servings" />
            <Tabs>
                <Tab title="Ingredients">
                    <textarea 
                        name="ingredients" 
                        rows={recipe.ingredients.split("\n").reduce((count, val) => count + Math.floor(val.length / 40) + 1, 0)}
                        value={recipe.ingredients} 
                        className="ingredients-textarea" 
                        onInput={resizeTextArea} 
                    ></textarea>
                </Tab>
                <Tab title="Instructions">
                    <textarea 
                        name="instructions" 
                        rows={recipe.instructions.split("\n").reduce((count, val) => count + Math.floor(val.length / 40) + 1, 0)}
                        value={recipe.instructions} 
                        className="instructions-textarea" 
                        onInput={resizeTextArea} 
                    ></textarea>
                </Tab>
            </Tabs>
            <button type="submit">Save</button>
        </form>
    );
}
