import style from './findRecipe.module.css';
import { FilterGroup } from '~/components';
import { useState, useReducer } from 'react';

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

    const handleSearch = e => {
        setPartialTitle(e.target.value);
        // query db alongside filters and update list of results
    }

    return (
        <main>
            <h1>Search For a Recipe</h1>
            <div className={style.container}>
                <aside className={style.sideBar}>
                    <h2>Filters</h2>
                    <FilterGroup 
                        title="Ingredients"
                        dispatch={dispatch}
                    />
                    <FilterGroup
                        title="Labels"
                        dispatch={dispatch}
                    />
                </aside>
                <form className={style.form}>
                    <input 
                        type="text" 
                        value={partialTitle} 
                        onChange={handleSearch}
                    />
                    <button>Search</button>
                </form>
            </div>
        </main>
    )
}