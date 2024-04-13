import style from './findRecipe.module.css';
import { FilterGroup } from '~/components';
import { useState, useReducer, useEffect, useMemo } from 'react';
import { getRecipes } from '~/services';
import { useIsMobile } from '~/hooks';

/*
TODO
pagination
- on page load should render maybe 10 recipes by default
- select tag for controlling amount per page

what filters and search criteria I need:
- search by partial title of recipe
- filter for min and max calorie range (calories are currently not tracked so this needs to wait)
- filter for min and max total time range
- filter for min and max servings range

- order by ascending/descending 
    - upload date/time
    - total prep + cook time
    - servings
    - number of times made (currently not tracked so this needs to wait)
*/

export default function FindRecipe() {
    const [allRecipes, setAllRecipes] = useState([]);
    const [allIngredients, setAllIngredients] = useState(null);
    const getIngName = ing => ing.split(" ").slice(2).join(" ");
    const isMobile = useIsMobile();

    useEffect(() => {
        getRecipes().then(({ data }) => {
            setAllRecipes(data);
            const ings = data.reduce((acc, curr) => {
                curr.ingredients.forEach(ing => acc.add(getIngName(ing)));
                return acc;
            }, new Set())
            setAllIngredients(ings)
        });
    }, []);

    const reducer = (prevState, payload) => {
        const copy = structuredClone(prevState);
        const { name, value } = payload;
        switch (value) {
            case "ignore":
                copy.excludeIngredients = copy.excludeIngredients.filter(ing => ing != name);
                break;
            case "include":
                copy.includeIngredients.push(name);
                break;
            case "exclude":
                copy.includeIngredients = copy.includeIngredients.filter(ing => ing != name);
                copy.excludeIngredients.push(name);
                break;
            default:
                console.log("Invalid Payload!");
                break;
        }
        return copy;
    }

    const [filters, dispatch] = useReducer(reducer, {
        includeIngredients: [],
        excludeIngredients: [],
    });

    const [partialTitle, setPartialTitle] = useState("");


    let filteredRecipes = allRecipes.filter(recipe => {
        const { includeIngredients: inc, excludeIngredients: exc } = filters;
        const hasAll = !inc.length || inc.some(ing => recipe.ingredients.some(i => getIngName(i) == ing));
        const hasNone = !exc.length || !exc.some(ing => recipe.ingredients.some(i => getIngName(i) == ing));
        const partialTitleMatch = !partialTitle || recipe.title.toLowerCase().includes(partialTitle.toLowerCase());
        console.log(recipe.title, partialTitle, partialTitleMatch);
        return hasAll && hasNone && partialTitleMatch;
    })


    const handleSearch = e => {
        setPartialTitle(e.target.value);
        // query db alongside filters and update list of results
    }

    return (
        <main>
            <h1>Search For a Recipe</h1>
            <div className={style.container}>
                {isMobile ? (
                    <>
                        <section className={style.section}>
                            <form className={style.form}>
                                <input
                                    list="all-recipes"
                                    type="text"
                                    value={partialTitle}
                                    onChange={handleSearch}
                                />
                                <button>Search</button>
                            </form>
                            <i className="fa-solid fa-filter"></i>
                        </section>
                        <ul className={style.list}>
                            {filteredRecipes.map(recipe => (
                                <li style={{ backgroundImage: `url("${recipe.image}")` }} className={style.recipe} key={recipe.id}>
                                    <span>{recipe.title}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <>
                        <aside className={style.sideBar}>
                            <h2>Filters</h2>
                            <FilterGroup
                                title="Ingredients"
                                datalist="all-ingredients"
                                dispatch={dispatch}
                            />
                            <FilterGroup
                                title="Labels"
                                dispatch={dispatch}
                            />
                        </aside>
                        <section className={style.section}>
                            <form className={style.form}>
                                <input
                                    list="all-recipes"
                                    type="text"
                                    value={partialTitle}
                                    onChange={handleSearch}
                                />
                                <button>Search</button>
                            </form>
                            <ul className={style.list}>
                                {filteredRecipes.map(recipe => (
                                    <li style={{ backgroundImage: `url("${recipe.image}")` }} className={style.recipe} key={recipe.id}>
                                        <span>{recipe.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </>
                )}
            </div>
            {/* { allRecipes.length && JSON.stringify(allRecipes[0].ingredients)}
            { JSON.stringify(filters.includeIngredients) } */}
            <datalist id="all-recipes">
                {allRecipes.map(recipe => <option key={recipe.id} value={recipe.title}></option>)}
            </datalist>
            <datalist id="all-ingredients">
                {allIngredients && Array.from(allIngredients).map((ing, i) => <option key={i} value={ing}></option>)}
            </datalist>
        </main>
    )
}