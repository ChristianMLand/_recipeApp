import { useState, useEffect } from 'react';
import { updateRecipe, getRecipe } from '~/services';
import { useIsMobile } from '~/hooks';
import { useParams, useNavigate } from 'react-router-dom';
import { RecipeForm } from '~/components';


export default function EditRecipe() {
    const [recipe, setRecipe] = useState()
    const { id } = useParams();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

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
        <main>
            <RecipeForm
                initialRecipe={recipe}
                service={data => updateRecipe(id, data)}
                onSuccess={() => navigate(`/recipes/${id}`)}
            />
        </main>
    )
}