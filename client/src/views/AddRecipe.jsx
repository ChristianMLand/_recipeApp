import { RecipeForm, ExtractionForm } from "../components";
import { useState } from 'react';
import { addRecipe } from "../utils/apiServices.js";
import { useNavigate } from "react-router-dom";

export default function AddRecipe() {
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();

    return (
        <>
            { !selected ? <>
                <h2>Would you like to manually enter a recipe, or extract one from a webpage?</h2>
                <div className="row">
                    <button onClick={() => setSelected("manual")}>Manual</button>
                    <button onClick={() => setSelected("extract")}>Extract</button>
                </div>
            </> : <>
                {selected == "manual" ? <RecipeForm service={addRecipe} onSuccess={id => navigate(`/recipes/${id}`)}/> : <ExtractionForm />}
            </>}
        </>
    )
}