import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRecipes } from '../utils/apiServices.js';
import { useAuthContext } from '../utils/AuthContext.jsx';

export default function Dashboard() {
    const [recipes, setRecipes] = useState([]);
    // const { loggedUser } = useAuthContext();
    // const navigate = useNavigate();

    useEffect(() => {
        getRecipes().then(({ data }) => {
            setRecipes(data)
        });
    }, []);

    // if (!loggedUser) return <h1>404</h1>;

    return (
        <>
            <h2>Recently Added Recipes</h2>
            <ul className='recipe-list'>
                {recipes?.map(recipe =>
                    <li className="recipe" key={recipe.id}>
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
        </>
    )
}