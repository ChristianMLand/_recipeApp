import { useState } from 'react';
import style from '~/views/FindRecipe/findRecipe.module.css';
import { Checkbox } from '~/components';


export default function FilterGroup({ title, dispatch, datalist }) {
    const [items, setItems] = useState([]);
    const [item, setItem] = useState("");

    const addItem = e => {
        e.preventDefault();
        setItems(current => current.concat(item));
        setItem("");
    }

    const removeItem = idx => {
        setItems(current => current.filter((_, i) => i !== idx));
    }

    return (
        <details>
            <summary>{title}: </summary>
            <form className={style.form} onSubmit={addItem}>
                <input 
                    list={datalist}
                    type="text" 
                    placeholder="Add an Item" 
                    value={item} 
                    onChange={e => setItem(e.target.value)}
                />
                <button>Add</button>
            </form>
            <ul>
                { items.map((name, i) => 
                    <li key={i} className={style.filter}>
                        <Checkbox 
                            name={name} 
                            onChange={value => dispatch({ name, value })}
                        />
                        <button className={style.delBtn} onClick={() => removeItem(i)}><i className="fa-solid fa-trash"></i></button>
                    </li>
                )}
            </ul>
        </details>
    )
}