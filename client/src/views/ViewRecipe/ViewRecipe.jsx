import { useParams, Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from 'react';
import { getRecipe, deleteRecipe } from "~/services";
import { useAuthContext, useIsMobile } from "~/hooks";
import { Tabs, Tab } from "~/components";
import Fraction from 'fraction.js';
import style from './viewRecipe.module.css';

export default function VieWRecipe() {
    const isMobile = useIsMobile();
    const [checkList, setCheckList] = useState([]);
    const [recipe, setRecipe] = useState();
    const { loggedUser } = useAuthContext();
    const initialRecipe = useRef();
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getRecipe(id).then(({ data }) => {
            setRecipe(data);
            initialRecipe.current = Object.freeze(data);
            setCheckList(data.ingredients.map(() => false));
        });
    }, [id]);

    const handleCheck = (i, e) => {
        setCheckList(currentCheckList => currentCheckList.map((check, j) => i == j ? e.target.checked : check));
    }

    const adjustIngredients = amount => {
        setRecipe(currentRecipe => {
            const { ingredients, servings } = currentRecipe;
            const { ingredients:origIngredients, servings:origServings } = initialRecipe.current;

            const fractionized = ingredients.map((ing, i) => {
                const parts = [];
                const currentIngSplit = ing.split(" ");
                const origIngSplit = origIngredients[i].split(" ");
                for (let j = 0; j < currentIngSplit.length; j++) {
                    const currentPart = currentIngSplit[j];
                    const origPart = origIngSplit[j];

                    if (!isNaN(currentPart[0])) {
                        parts.push((new Fraction(currentPart).add(new Fraction(origPart).mul(amount))).toFraction());
                    } else {
                        parts.push(currentPart);
                    }
                }
                return parts.join(" ");
            });

            return { ...currentRecipe, ingredients: fractionized, servings: servings + (origServings * amount)}
        })
    }

    const handleDelete = id => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            deleteRecipe(id).then(() => navigate("/recipes"));
        }
    }
    
    if (!recipe) return <h1>Loading...</h1>

    return (
        <main className={style.container}>
            <div>
                <img src={recipe.image} alt={recipe.title} />
                <div className={style.topMid}>
                    <h2>{recipe.title}</h2>
                    <p>
                        Total Time:
                        {recipe.time >= 60 && ` ${Math.floor(recipe.time / 60)} hrs`}
                        {recipe.time % 60 && ` ${recipe.time % 60} mins`}
                    </p>
                    <div>
                        <button disabled={recipe.servings == initialRecipe.current.servings} onClick={() => adjustIngredients(-1)}>-</button>
                        <span>Makes: {recipe.servings}</span>
                        <button onClick={() => adjustIngredients(1)}>+</button>
                    </div>
                </div>
                <div className={style.topRight}>
                    { recipe.user_id == loggedUser?.id ? 
                        <>
                            <Link className="button" to={`/recipes/${id}/edit`}>Edit</Link>
                            <button onClick={() => handleDelete(id)}>Delete</button>
                        </>
                        :
                        <button onClick={() => navigate("/")}>Save</button> 
                    }
                </div>
            </div>
            <div className={style.bottom}> 
            { isMobile ? 
                <Tabs>
                    <Tab title="Ingredients">
                        <ul className={style.list}>
                            {recipe?.ingredients?.map((ingredient, i) => 
                                <li key={i}>
                                    <input checked={checkList[i]} onChange={e => handleCheck(i, e)} type="checkbox" id={`ingredient-${i}`} />
                                    <label htmlFor={`ingredient-${i}`}>
                                    { ingredient.split(" ").map(part => 
                                        isNaN(part[0]) ? part : new Fraction(part).toFraction(true)).join(" ")
                                    }
                                    </label>
                                </li>
                            )}
                        </ul>
                    </Tab>
                    <Tab title="Instructions">
                        <ol>
                            {recipe?.instructions?.map((instruction, i) => 
                                <li key={i}>{instruction}</li>
                            )}
                        </ol>
                    </Tab>
                </Tabs>
                :
                <>
                    <div className={style.ingredients}>
                        <h2>Ingredients</h2>
                        <ul className={style.list}>
                            {recipe?.ingredients?.map((ingredient, i) => 
                                <li key={i}>
                                    <input type="checkbox" id={`ingredient-${i}`} />
                                    <label htmlFor={`ingredient-${i}`}>
                                    { ingredient.split(" ").map(part => 
                                        isNaN(part[0]) ? part : new Fraction(part).toFraction(true)).join(" ")
                                    }
                                    </label>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className={style.instructions}>
                        <h2>Instructions</h2>
                        <ol>
                            {recipe?.instructions?.map((instruction, i) => 
                                <li key={i}>{instruction}</li>
                            )}
                        </ol>
                    </div>
                </>
            }
            </div>
        </main>
    )
}