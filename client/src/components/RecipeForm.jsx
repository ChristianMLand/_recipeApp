import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


// TODO use sessionStorage (works like localStorage) to keep track of form progress (clear after submitting)
// TODO add preview image button so that it doesnt constantly try to update the image on keypress
// TODO add file image upload instead of just url

export default function RecipeForm({ initialRecipe, service, onSuccess }) {
    
    const [recipe, setRecipe] = useState(initialRecipe ?? {
        title: "",
        servings: "",
        image: "",
        time: "",
        ingredients: [],
        instructions: [],
    });

    const addValue = type => {
        setRecipe(currentRecipe => {
            const values = currentRecipe[type].concat("");
            return { ...currentRecipe, [type]: values };
        });
    }

    const removeValue = (type, idx) => {
        setRecipe(currentRecipe => {
            const values = currentRecipe[type].filter((_,i) => i !== idx);
            return { ...currentRecipe, [type]: values }
        })
    }

    const updateValue = e => {
        const { name, value } = e.target;
        const [type, idx] = name.split("-");

        if (Object.hasOwn(recipe, name)) {
            setRecipe(currentRecipe => {
                return { ...currentRecipe, [name]: value };
            });
        } else {
            setRecipe(currentRecipe => {
                const values = currentRecipe[type].map((val, i) => i == idx ? value : val);
                return { ...currentRecipe, [type]: values };
            });
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const { data, error } = await service(recipe);
        console.log(data, error);
        if (data && !error) onSuccess(data.id);
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
                    { recipe.ingredients.map((ingredient, i) => 
                        <div key={i}>
                            <input placeholder={`Ingredient ${i+1}`}  value={ingredient} onChange={updateValue} name={`ingredients-${i}`}/>
                            <button type="button" onClick={() => removeValue("ingredients", i)}>Remove</button>
                        </div>
                    )}
                    <button type="button" onClick={() => addValue("ingredients")}>Add an Ingredient</button>
                </div>
                <div>
                <h2>Instructions</h2>
                    { recipe.instructions.map((instruction, i) => 
                        <div key={i}>
                            <textarea rows={4} placeholder={`Instruction ${i+1}`}  value={instruction} onChange={updateValue} name={`instructions-${i}`}></textarea>
                            <button type="button" onClick={() => removeValue("instructions", i)}>Remove</button>
                        </div>
                    )}
                    <button type="button" onClick={() => addValue("instructions")}>Add an Instruction</button>
                </div>
            </div>
            <button type="submit">Save</button>
        </form>
    );
}
