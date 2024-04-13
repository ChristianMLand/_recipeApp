import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecipes } from '~/services';
import style from './dashboard.module.css';

export default function Dashboard() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        getRecipes().then(({ data }) => {
            setRecipes(data)
        });
    }, []);

    return (
        <main>
            <h2>All Recipes</h2>
            <ul className={style.list}>
                {recipes && recipes?.map(recipe =>
                    <li className={style.recipe} key={recipe.id}>
                        <img src={recipe.image} alt={recipe.title} />
                        <div>
                            <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
                            <span>
                                Total Time:
                                {recipe.time >= 60 && ` ${Math.floor(recipe.time / 60)} hrs`}
                                {recipe.time % 60 && ` ${recipe.time % 60} mins`}
                            </span>
                            <span>Yields: {recipe.servings}</span>
                        </div>
                    </li>
                )}
            </ul>
        </main>
    )
}