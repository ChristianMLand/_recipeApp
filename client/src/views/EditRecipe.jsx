import { useState, useEffect } from 'react';
import { RecipeForm } from '../components';
import { updateRecipe, getRecipe } from '../utils/apiServices.js';
import { useParams, useNavigate } from 'react-router-dom';


export default function EditRecipe() {
    const [recipe, setRecipe] = useState()
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchRecipe = async () => {
        const { data, error } = await getRecipe(id);
        if (error) navigate("/recipes")
        else return data;
    }

    useEffect(() => {
        fetchRecipe().then(setRecipe);
    }, [id])

    if (!recipe) return <h1>Loading...</h1>

    return (
        <div>
            <RecipeForm 
                initialRecipe={recipe}
                service={data => updateRecipe(id, data)}
                onSuccess={() => navigate(`/recipes/${id}`)}
            />
        </div>
    )
}