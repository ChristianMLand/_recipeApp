import styles from './Dashboard.module.css';
import { Tab, Tabs, Modal } from '~/components';
import { Link, useNavigate } from 'react-router-dom';
import { extractRecipe, getRecipes, getCollections, addCollection } from '~/services';
import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '~/hooks';

export default function Dashboard() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [collections, setCollections] = useState([]);
    const { loggedUser, logout } = useAuthContext();

    useEffect(() => {
        if (!loggedUser) return;
        getRecipes({ params: { limit: 3 } }).then(({ data }) => {
            setRecipes(data);
        });
        getCollections().then(({ data }) => {
            setCollections(data);
        })
    }, [loggedUser]);

    const modalRef = useRef(null);

    const handleSubmit = async e => {
        e.preventDefault();
        const form = e.target;
        console.log(form.recipeUrl.value);
        setLoading(true)
        const { data, error } = await extractRecipe({ url: form.recipeUrl.value });
        setLoading(false);
        if (error) setError(error.error);
        else navigate(`/recipes/${data.id}/edit`);
    }

    const handleCreateCollection = e => {
        e.preventDefault();
        const form = e.target;
        const data = Object.fromEntries(new FormData(form).entries());
        addCollection(data)
            .then(({ data }) => {
                navigate(`/collections/${data.id}`);
            })
    }

    if (!recipes?.length) return <h1>Loading...</h1>

    // plus/add button should take you to new recipe page if on all recipes tab or new collection page if on collections tab
    return (
        <main className={styles.container}>
            {/* <h1 className="text-light">The CookBook</h1> */}
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    name="recipeUrl"
                    type="search"
                    placeholder="Paste a recipe URL"
                />
                {
                    loading ? 
                    <button disabled><i class="fas fa-spinner fa-spin"></i></button> : 
                    <button><i className="fa-solid fa-arrow-right" /></button>
                }
            </form>
            {error && <span className="error">{error}</span>}
            <Modal ref={modalRef}>
                <Link
                    title="New Recipe"
                    to="/recipes/add"
                >
                    New Recipe
                </Link>
                <hr className={styles.divider} data-content="OR"/>
                <form
                    onSubmit={handleCreateCollection}
                    className={styles.modalForm}
                >
                    <input
                        type="text"
                        name="title"
                        placeholder="Collection title"
                    />
                    <button>Create</button>
                </form>
            </Modal>
            <nav className={styles.nav}>
                <Link title="Search Recipes" to="/recipes/search">
                    <i className="fa-solid fa-magnifying-glass" />
                </Link>
                <button
                    onClick={() => modalRef.current.showModal()}
                    title="New"
                    className={styles.badge}
                >
                    <i className="fa-solid fa-plus" />
                </button>
                <button
                    title="Logout"
                    className={styles.btn}
                    onClick={logout}
                >
                    <i className="fa fa-sign-out" aria-hidden="true" />
                </button>
            </nav>
            <Tabs topOffset={0}>
                <Tab title="Recent Recipes">
                    <ul className={styles.list}>
                        {recipes
                            .map(recipe => (
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
                    <ul className={styles.list}>
                        {collections.map(collection => (
                            <li
                                style={{ backgroundImage: `url("${collection.recipes[0]?.image}")` }}
                                key={collection.id}
                                className={styles.card}
                            >
                                <Link to={`/collections/${collection.id}`}>{collection.title}<span className={styles.badge}>{collection.recipes.length}</span></Link>
                            </li>
                        ))}
                    </ul>
                </Tab>
            </Tabs>
        </main>
    )
}