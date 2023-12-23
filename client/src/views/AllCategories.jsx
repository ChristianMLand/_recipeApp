import { CategoryForm } from "../components";
import { useState, useEffect } from 'react';
import { useAuthContext } from "../utils/AuthContext.jsx";

export default function AllCategories() {
    const [categories, setCategories] = useState([]);
    const { loggedUser } = useAuthContext();

    useEffect(() => {
        // fetch categories and store in state
    }, [])

    return (
        <div>
            <h2>Add a Category</h2>
            { loggedUser && <CategoryForm /> }
            <ul>
                { categories?.map(category => 
                    <li key={category.id}>
                        <h3>{category.name}</h3>
                        <span>count of recipes in category</span>
                    </li>
                )}
            </ul>
        </div>
    )
}