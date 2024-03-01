import { useState } from 'react';
import style from '~/views/FindRecipe/findRecipe.module.css';
import { Checkbox } from '~/components';


export default function FilterGroup({ title, dispatch }) {
    const [items, setItems] = useState([]);
    const [item, setItem] = useState("");

    const addItem = e => {
        e.preventDefault();
        setItems(current => current.concat(item));
        setItem("");
    }

    return (
        <details>
            <summary>{title}: </summary>
            <form className={style.form} onSubmit={addItem}>
                <input 
                    type="text" 
                    placeholder="Add an Item" 
                    value={item} 
                    onChange={e => setItem(e.target.value)}
                />
                <button>Add</button>
            </form>
            <ul>
                { items.map((name, i) => 
                    <li key={i}>
                        <Checkbox 
                            name={name} 
                            onChange={value => dispatch({ name, value })}
                        />
                    </li>
                )}
            </ul>
        </details>
    )
}