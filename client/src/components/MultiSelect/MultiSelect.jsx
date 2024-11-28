import { useState, useEffect, useRef } from 'react';
import styles from './MultiSelect.module.css';

export default function MultiSelect({ children, name, label }) {
    const [options, setOptions] = useState([]);
    const selectRef = useRef(null);

    const updateOptions = () => {
        setOptions(Array.from(selectRef.current.options));
    }

    useEffect(updateOptions, [children]);

    const handleRemove = i => {
        const option = selectRef.current.selectedOptions[i];
        option.selected = false;
        updateOptions();
    }

    const handleSelect = i => {
        const option = selectRef.current.options[i];
        option.selected = !option.selected;
        updateOptions();
    }

    const handleBlur = e => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            e.currentTarget.open = false;
        }
    }

    return (
        <>
            <label htmlFor="">{label}:</label>
            <details onBlur={handleBlur} className={styles.details}>
                <summary>
                    <ul className={styles.list}>
                        {options.filter(o => o.selected).map((o, i) => (
                            <li key={i}>
                                <span>{o.innerText}</span>
                                <button type="button" onClick={() => handleRemove(i)}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <i className="fa-solid fa-chevron-down"></i>
                </summary>
                <menu className={styles.menu}>
                    {options.map((o, i) => (
                        <li
                            key={i}
                            onClick={() => handleSelect(i)}
                            className={options[i].selected ? styles.active : ""}
                        >{o.innerText}</li>
                    ))}
                </menu>
            </details>
            <select multiple name={name} ref={selectRef} className={styles.select}>
                {children}
            </select>
        </>
    )
}