import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { getRecipe, updateRecipe } from "~/services";
import styles from './EditRecipe.module.css';
import { RecipeForm } from "~/components";


export default function EditRecipe() {
    const [recipe, setRecipe] = useState()
    const { id } = useParams();
    const formRef = useRef(null);
    const navigate = useNavigate();

    const fetchRecipe = async () => {
        const { data, error } = await getRecipe(id);
        if (error) navigate("/");
        else return data;
    };

    useEffect(() => {
        fetchRecipe()
            .then(setRecipe)
            .catch(() => navigate("/404"));
    }, [id]);

    if (!recipe) return <h1>Loading...</h1>;

    return (
        <>
            <nav className={styles.nav}>
                <Link to={`/recipes/${id}`}><i className="fa-solid fa-arrow-left"></i></Link>
                <h2>Edit Recipe</h2>
                <button onClick={() => formRef.current.requestSubmit()} className={styles.btn}>Save</button>
            </nav>
            <RecipeForm
                ref={formRef}
                initialRecipe={recipe}
                service={data => updateRecipe(id, data)}
                onSuccess={() => navigate(`/recipes/${id}`)}
            />
            {/* <form action="">
                <input type="text" value={recipe.title} name="title"/>
            </form> */}
        </>
    )
}