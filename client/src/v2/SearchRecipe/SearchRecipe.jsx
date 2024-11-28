import styles from './SearchRecipe.module.css';
import { Link } from 'react-router-dom';
import { getRecipes } from '~/services';
import Paginator from '~/components/Paginator/Paginator';
import { useDataFetcher } from '~/hooks';
import { useState } from 'react';
import { MultiSelect } from '~/components';

function RecipeCard({ image, id, title }) {
    return (
        <li
            style={{ backgroundImage: `url("${image}")` }}
            key={id}
            className={styles.card}
        >
            <Link to={`/recipes/${id}`}>{title}</Link>
        </li>
    )
}

const sortMap = {
    "alpha_asc" : (a,b)=>a.title.localeCompare(b.title),
    "alpha_desc" : (a,b)=>b.title.localeCompare(a.title),
    "created_asc" : (a,b) => new Date(a.created_at) - new Date(b.created_at),
    "created_desc" : (a,b) => new Date(b.created_at) - new Date(a.created_at),
    "updated_asc" : (a,b) => new Date(a.updated_at) - new Date(b.updated_at),
    "updated_desc" : (a,b) => new Date(b.updated_at) - new Date(a.updated_at)
}

export default function SearchRecipe() {
    const { data:allRecipes } = useDataFetcher((config={}) => getRecipes({ params: { limit: 500 }, ...config }), [], []);
    console.log(allRecipes);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("alpha_asc")
    const filteredRecipes = allRecipes
        .sort(sortMap[sortBy])
        .filter(recipe => recipe.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
            ||
            recipe.collections
                .some(c => c.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
        );

    const handleBlur = e => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            e.currentTarget.open = false;
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = {};
        for (const element of form.elements) {
            if (!element.name) continue;
            if (element.multiple) {
                formJson[element.name] = formData.getAll(element.name);
            } else {
                formJson[element.name] = formData.get(element.name);
            }
        }
        console.log(formJson);
    }

    return (
        <>
            <nav className={styles.nav}>
                <Link to="/dashboard"><i className="fa-solid fa-arrow-left"></i></Link>
                <input list="all-recipes" value={searchTerm} type="search" placeholder='Search recipes' onChange={e => setSearchTerm(e.target.value)}/>
                <details onBlur={handleBlur} className={styles.menu}>
                    <summary>
                        <i className="fa-solid fa-filter"></i>
                    </summary>
                    <select>
                        <option value="">Alphabetical Ascending</option>
                        <option value="">Alphabetical Descending</option>
                        <option value="">Newest Ascending</option>
                        <option value="">Newest Descending</option>
                        <option value="">Updated Ascending</option>
                        <option value="">Updated Descending</option>
                    </select>
                    {/* <form onSubmit={handleSubmit}>
                        <div>
                            <input name="minTime" type="number" placeholder="Min Time" />
                            <i className="fa-solid fa-minus"></i>
                            <input name="maxTime" type="number" placeholder="Max Time" />
                        </div>
                        <button>Clear All</button>
                        <button>Apply</button>
                    </form> */}
                </details>
            </nav>
            <main>
                <ul className={styles.list}>
                { filteredRecipes.map(recipe => <RecipeCard key={recipe.id} {...recipe}/>)}
                </ul>
                <datalist id="all-recipes">
                    {allRecipes.map(recipe => <option key={recipe.id}>{recipe.title}</option>)}
                </datalist>
            </main>
        </>
    )
}