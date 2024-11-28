import style from './ViewCollection.module.css';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCollection, getRecipes, editCollection, deleteCollection } from '~/services';
import { useState, useEffect, useRef } from 'react';
import { Modal, MultiSelect } from '~/components';
import { useDataFetcher } from '~/hooks';

export default function ViewCollection() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [collection, setCollection] = useState();
    const [title, setTitle] = useState();
    const modalRef = useRef(null);
    const modalRef2 = useRef(null);
    const { data:allRecipes } = useDataFetcher((config={}) => getRecipes({ params: { limit: 20 }, ...config }), [], []);

    useEffect(() => {
        getCollection(id)
        .then(({ data }) => {
            if (!data) throw new Error("Invalid Collection");
            setCollection(data);
            setTitle(data.title);
        })
            .catch(() => navigate("/404"));
    }, [id])
    
    const handleBlur = e => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            e.currentTarget.open = false;
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        editCollection(id, { title })
            .then(res => {
                console.log(res);
                modalRef.current.close();
            })
            .catch(err => {
                console.error(err);
            })
    }

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this collection?')) {
            deleteCollection(id).then(res => console.log(res)).catch(err => console.error(err));
        }
    }
    
    const [searchTerm, setSearchTerm] = useState("");
    
    const filteredRecipes = allRecipes.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()))

    if (!collection || !allRecipes) return <h1>Loading...</h1>;

    return (
        <>
            <nav className={style.nav}>
                <Link title="Go Back" to="/dashboard"><i className="fa-solid fa-arrow-left"></i></Link>
                <div>
                    <h2 title={title}>
                        {title}
                    </h2>
                    <span title="Recipe Count" className={style.badge}>{collection.recipes.length}</span>
                </div>
                <Modal ref={modalRef}>
                    <form onSubmit={handleSubmit}>
                        <input value={title} onChange={e => setTitle(e.target.value)}/>
                        <button>Update</button>
                    </form>
                </Modal>
                <Modal ref={modalRef2}>
                    <input 
                        list="all-recipes" 
                        value={searchTerm} 
                        type="search" 
                        placeholder='Search recipes' 
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <form action="">
                        <ul style={{display: "flex", flexDirection:"column", alignItems: "flex-start"}}>
                            {filteredRecipes.map(recipe => (
                                <li>
                                    <label key={recipe.id} value={recipe.id}>
                                        <input type="checkbox" />{recipe.title}
                                    </label>
                                </li>
                            ))}
                        </ul>
                        <button>Add</button>
                    </form>
                </Modal>
                <details onBlur={handleBlur} className={style.menu}>
                    <summary>
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                    </summary>
                    <menu>
                        {/* <li><button title="Add" onClick={() => modalRef2.current.showModal()}><i className="fa-solid fa-plus" />Add</button></li> */}
                        <li><button title="Edit" onClick={() => modalRef.current.showModal()}><i className="fa-solid fa-pen-to-square"/>Edit</button></li>
                        <li><button title="Delete" onClick={handleDelete}><i className="fa-solid fa-trash" />Delete</button></li>
                    </menu>
                </details>
            </nav>
            <main className={style.container}>
                <ul>
                    {collection.recipes.map(recipe => (
                        <li className={style.card} key={recipe.id} style={{ backgroundImage: `url("${recipe.image}")` }}>
                            <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
                        </li>
                    ))}
                </ul>
            </main>
        </>
    );
};