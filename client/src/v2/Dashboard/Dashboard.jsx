import styles from './Dashboard.module.css';
import { Tab, Tabs } from '~/components';
import { Link, useNavigate } from 'react-router-dom';
import { extractRecipe, getRecipes, getLoggedUser, logoutUser } from '~/services';
import { useState, useEffect } from 'react';
import { useAuthContext } from '~/hooks';

export default function Dashboard() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [recipes, setRecipes] = useState([]);
    const { loggedUser, logout } = useAuthContext();

    useEffect(() => {
        loggedUser && getRecipes().then(({ data }) => {
            setRecipes(data)
        });
    }, [loggedUser]);

    const handleSubmit = async e => {
        e.preventDefault();
        const form = e.target;
        console.log(form.recipeUrl.value);
        const { data, error } = await extractRecipe({ url: form.recipeUrl.value});
        if (error) setError(error.error);
        else navigate(`/recipes/${data.id}/edit`);
    }
    // plus/add button should take you to new recipe page if on all recipes tab or new collection page if on collections tab
    return (
        <main className={styles.container}>
            {/* <h1 className="text-light">The CookBook</h1> */}
            <form className={styles.form} onSubmit={handleSubmit}>
                <input name="recipeUrl" type="search" placeholder="Paste a recipe URL" />
                <button><i className="fa-solid fa-arrow-right" /></button>
            </form>
            {error && <span className="error">{error}</span>}
            <nav className={styles.nav}>
                <h2>Cookbook</h2>
                <Link to="/recipes/search"><i className="fa-solid fa-magnifying-glass" /></Link>
                <Link to="/recipes/add" className={styles.roundBtn}><i className="fa-solid fa-plus" /></Link>
                <button className={styles.btn} onClick={logout}><i className="fa fa-sign-out" aria-hidden="true" /></button>
            </nav>
            <Tabs topOffset={0}>
                <Tab title="All Recipes">
                    <ul className={styles.list}>
                        {recipes.map(recipe => (
                            <li 
                                style={{ backgroundImage: `url("${recipe.image}")` }} 
                                key={recipe.id} 
                                className={styles.card}
                            >
                                <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
                            </li>
                        ))}
                    </ul>
                </Tab>
                <Tab title="Collections">
                    collections go here
                </Tab>
            </Tabs>
        </main>
    )
}