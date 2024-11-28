import { useParams, Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from 'react';
import { getRecipe, deleteRecipe } from "~/services";
import { useAuthContext, useIsMobile } from "~/hooks";
import { Tabs, Tab, Modal } from "~/components";
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
        getRecipe(id)
            .then(({ data }) => {
                if (!data) throw new Error("Invalid Recipe");
                setRecipe(data);
                initialRecipe.current = Object.freeze(data);
                setCheckList(data.ingredients.map(() => false));
            })
            .catch(() => navigate("/404"));
    }, [id]);

    const handleCheck = (i, e) => {
        setCheckList(currentCheckList => currentCheckList.map((check, j) => i == j ? e.target.checked : check));
    }

    const adjustIngredients = amount => {
        setRecipe(currentRecipe => {
            const { ingredients, servings } = currentRecipe;
            const { ingredients: origIngredients, servings: origServings } = initialRecipe.current;

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

            return { ...currentRecipe, ingredients: fractionized, servings: servings + (origServings * amount) }
        })
    }

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            deleteRecipe(id).then(() => navigate("/dashboard"));
        }
    }

    const handleBlur = e => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            e.currentTarget.open = false;
        }
    }

    const handleShare = e => {
        if (navigator.share) {
            navigator.share({
                title: recipe.title,
                url: "https://recipes.christianland.dev/recipes/"+recipe.id
            })
            .catch(console.error);
        } else {
            modalRef.current.showModal();
        }
    }

    const modalRef = useRef(null);

    const handleCopy = () => {
        navigator.clipboard.writeText("https://recipes.christianland.dev/recipes/"+recipe.id);
        modalRef.current.close();
    }

    if (!recipe) return <h1>Loading...</h1>
    // TODO recipe sharing (both for user)
    // TODO option to print recipe??
    // TODO saving another users recipe into your own library
    // TODO if no account when attempting to save, take them to register
    return (
        <>
            <nav className={style.nav}>
                <Link title="Go Back" to="/dashboard"><i className="fa-solid fa-arrow-left"></i></Link>
                <h2 title={recipe.title}>{recipe.title}</h2>
                <Modal ref={modalRef}>
                    <label htmlFor="url">Share a link to this recipe</label>
                    <div className={style.urlWrapper}>
                        <input 
                            id="url"
                            title={"https://recipes.christianland.dev/recipes/"+recipe.id}
                            type="url"
                            readOnly
                            value={"https://recipes.christianland.dev/recipes/"+recipe.id} 
                        />
                        <button title="Copy" type="button" onClick={handleCopy}><i className="fa-solid fa-copy" /></button>
                    </div>
                </Modal>
                <details onBlur={handleBlur} className={style.menu}>
                    <summary>
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                    </summary>
                    <menu>
                        {recipe.user_id == loggedUser?.id ?
                            <>
                                <li><Link title="Edit" to={`/recipes/${id}/edit`}><i className="fa-solid fa-pen-to-square"/>Edit</Link></li>
                                <li><button title="Delete" onClick={handleDelete}><i className="fa-solid fa-trash" />Delete</button></li>
                            </>
                            :
                            <li><button title="Save" onClick={() => navigate("/")}>Save</button></li>
                        }
                        <li><button title="Share" onClick={handleShare}><i className="fa-solid fa-share-nodes" />Share</button></li>
                    </menu>
                </details>
            </nav>
            <main className={style.container}>
                <div>
                    <img src={recipe.image} alt={recipe.title} />
                    <h2>Collections:</h2>
                    <ul className={style.collections}>
                        {recipe.collections.map(c => (
                            <li key={c.id}><Link to={`/collections/${c.id}`}>{c.title}</Link></li>
                        ))}
                    </ul>
                    <div className={style.topMid}>
                        <p>
                            <i className="fa-regular fa-clock"></i>
                            {recipe.time >= 60 && ` ${Math.floor(recipe.time / 60)} hrs`}
                            {recipe.time % 60 > 0 && ` ${recipe.time % 60} mins`}
                        </p>
                        <div>
                            <button disabled={recipe.servings == initialRecipe.current.servings} onClick={() => adjustIngredients(-1)}>-</button>
                            <span>Makes: {recipe.servings}</span>
                            <button onClick={() => adjustIngredients(1)}>+</button>
                        </div>
                    </div>
                </div>
                <div className={style.bottom}>
                    {isMobile ?
                        <Tabs topOffset={50}>
                            <Tab title="Ingredients">
                                <ul className={style.list}>
                                    {recipe?.ingredients?.map((ingredient, i) =>
                                        <li key={i}>
                                            <input checked={checkList[i]} onChange={e => handleCheck(i, e)} type="checkbox" id={`ingredient-${i}`} />
                                            <label htmlFor={`ingredient-${i}`}>
                                                {ingredient.split(" ").map(part =>
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
                                                {ingredient.split(" ").map(part =>
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
        </>
    )
}