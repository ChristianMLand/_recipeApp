import { useState, useRef } from 'react';
import style from '~/views/FindRecipe/findRecipe.module.css';

const stateMap = {
    "ignore" : "include",
    "include" : "exclude",
    "exclude" : "ignore"
}

export default function IndeterminateCheckbox({ name, onChange }) {
    const [checkboxState, setCheckboxState] = useState("ignore");

    const handleClick = ({ target }) => {
        // console.log("changing to: ", stateMap[checkboxState], target.checked)
        onChange(stateMap[checkboxState]);
        setCheckboxState(currentState => stateMap[currentState]);

        if (target.readOnly) target.checked = target.readOnly=false;
        else if (!target.checked) target.readOnly=target.indeterminate=true;
    }

    return (
        <>
            <input className={style.checkbox} type="checkbox" onClick={handleClick} name={name} id={name} />
            <label htmlFor={name}>{name}</label>
        </>
    )
}