import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


// TODO use sessionStorage (works like localStorage) to keep track of form progress (clear after submitting)
// TODO add preview image button so that it doesnt constantly try to update the image on keypress
// TODO add file image upload instead of just url

export default function RecipeForm({ initialRecipe, service, onSuccess }) {
    
    const [recipe, setRecipe] = useState(() => {
        if (initialRecipe) {
            return { 
                ...initialRecipe, 
                ingredients: initialRecipe.ingredients.join("\n"),
                instructions: initialRecipe.instructions.join("\n"),
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
            ingredients: recipe.ingredients.split("\n"),
            instructions: recipe.instructions.split("\n")
        });
        console.log(data, error);
        if (data && !error) onSuccess(data.id);
    }

    const resizeTextArea = e => {
        const { style, name, value, scrollHeight } = e.target;
        style.height = "inherit";
        style.height = scrollHeight + "px";
        setRecipe(currentRecipe => {
            return { ...currentRecipe, [name]: value }
        });
    }

    return (
        <form id="recipe-form" onSubmit={handleSubmit}>
            {/* <img src={recipe.image} alt="" /> */}
            <input placeholder="Image URL" type="url" value={recipe.image} onChange={updateValue} name="image" />
            <input placeholder='Title' type="text" value={recipe.title} onChange={updateValue} name="title" />
            <div>
                <label>
                    Servings: <input placeholder="Servings" type="number" value={recipe.servings} onChange={updateValue} name="servings" />
                </label>
                <label>
                    Time in Minutes: <input placeholder="Time in minutes" type="number" value={recipe.time} onChange={updateValue} name="time" />
                </label>
            </div>
            <div className="recipe-form-columns">
                <div>
                    <h2>Ingredients</h2>
                    <textarea 
                        name="ingredients" 
                        value={recipe.ingredients} 
                        rows={1} 
                        className="ingredients-textarea" 
                        onChange={resizeTextArea} 
                        defaultValue={initialRecipe?.ingredients.join("\n") ?? ""}
                    ></textarea>
                </div>
                <div>
                    <h2>Instructions</h2>
                    <textarea 
                        name="instructions" 
                        value={recipe.instructions} 
                        rows={1} 
                        className="instructions-textarea" 
                        onChange={resizeTextArea} 
                        defaultValue={initialRecipe?.instructions.join("\n\n") ?? ""}
                    ></textarea>
                </div>
            </div>
            <button type="submit">Save</button>
        </form>
    );
}
