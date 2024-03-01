import { CategoryForm } from "~/components";
import { useState, useEffect } from 'react';
import { useAuthContext } from "~/hooks";
import style from './categories.module.css';

export default function AllCategories() {
    const [categories, setCategories] = useState([
        { id: 1, name: "Breakfast", count: 3 },
        { id: 2, name: "Lunch", count: 7 },
        { id: 3, name: "Dinner", count: 10 },
        { id: 4, name: "Dessert", count: 2 },
    ]);
    const { loggedUser } = useAuthContext();

    useEffect(() => {
        // fetch categories and store in state
    }, [])

    return (
        <main>
            <h2>Add a Category</h2>
            { loggedUser && <CategoryForm /> }
            <ul className={style.list}>
                { categories?.map(category => 
                    <li className={style.category} key={category.id}>
                        <h3>{category.name}</h3>
                        <span>{category.count} recipes</span>
                    </li>
                )}
            </ul>
        </main>
    )
}