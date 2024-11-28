import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useRef } from 'react';
import { addRecipe } from "~/services";
import styles from './NewRecipe.module.css';
import { RecipeForm } from "~/components";


export default function NewRecipe() {
    const formRef = useRef(null);
    const navigate = useNavigate();

    return (
        <>
            <nav className={styles.nav}>
                <Link to="/dashboard"><i className="fa-solid fa-arrow-left"></i></Link>
                <h2>Add Recipe</h2>
                <button onClick={() => formRef.current.requestSubmit()} className={styles.btn}>Save</button>
            </nav>
            <RecipeForm
                ref={formRef}
                service={addRecipe} 
                onSuccess={id => navigate(`/recipes/${id}`)}
            />
        </>
    )
}