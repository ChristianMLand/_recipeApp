import { useParams, Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from 'react';
import { getRecipe, deleteRecipe } from "../utils/apiServices.js";
import { useAuthContext } from "../utils/AuthContext.jsx";
import Fraction from 'fraction.js';
import Tabs from "../components/Tabs.jsx";
import Tab from "../components/Tab.jsx";

export default function VieWRecipe() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
    const [checkList, setCheckList] = useState([]);
    const [recipe, setRecipe] = useState();
    const { loggedUser } = useAuthContext();
    const initialRecipe = useRef();
    const { id } = useParams();
    const navigate = useNavigate();

    const handleResize = () => {
        setIsMobile(window.innerWidth <= 500);
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        getRecipe(id).then(({ data }) => {
            setRecipe(data);
            initialRecipe.current = Object.freeze(data);
            setCheckList(data.ingredients.map(() => false));
        });
        return () => {
            window.removeEventListener("resize", handleResize);
        }
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
    
    if (!recipe) return <h1>Loading...</h1>

    return (
        <div className="recipe-view">
            <div className="recipe-view-top">
                <img src={recipe.image} alt={recipe.title} />
                <div className="recipe-view-top-mid">
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
                <div className="recipe-view-top-right">
                    { recipe.user_id == loggedUser?.id ? 
                        <>
                            <Link to={`/recipes/${id}/edit`}>Edit</Link>
                            <button onClick={() => deleteRecipe(id).then(() => navigate("/recipes"))}>Delete</button>
                        </>
                        :
                        <button onClick={() => navigate("/")}>Save</button> 
                    }
                </div>
            </div>
            <div className="recipe-view-bottom">
                { isMobile ? 
                    <Tabs>
                        <Tab title="Ingredients">
                            <ul className="recipe-view-ingredients">
                                {recipe.ingredients.map((ingredient, i) => 
                                    <li className="ingredient-item" key={i}>
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
                            <ol className="recipe-view-instructions">
                                {recipe.instructions.map((instruction, i) => 
                                    <li key={i}>{instruction}</li>
                                )}
                            </ol>
                        </Tab>
                    </Tabs>
                    :
                    <>
                        <div className="recipe-view-ingredients">
                            <h2>Ingredients</h2>
                            <ul>
                                {recipe.ingredients.map((ingredient, i) => 
                                    <li className="ingredient-item" key={i}>
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
                        <div className="recipe-view-instructions">
                            <h2>Instructions</h2>
                            <ol>
                                {recipe.instructions.map((instruction, i) => 
                                    <li key={i}>{instruction}</li>
                                )}
                            </ol>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}