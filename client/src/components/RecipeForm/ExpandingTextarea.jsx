import { useRef, useEffect } from 'react';
import style from './recipeForm.module.css';

export default function ExpandingTextarea({ value:contents , onChange, name }) {
    const hiddenDiv = useRef(null);
    const textarea = useRef(null);

    const handleResize = () => {
        hiddenDiv.current.style.display = "block";
        textarea.current.style.height = hiddenDiv.current.offsetHeight + "px";
        hiddenDiv.current.style.display = "none";
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        if (hiddenDiv.current && textarea.current) {
            handleResize();
        }
        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, [contents])

    return (
        <>
            <textarea 
                id={name}
                ref={textarea}
                rows={1}
                name={name} 
                value={contents}
                onChange={onChange} 
            ></textarea>
            <div ref={hiddenDiv} className={style.hidden}>
                { contents }
                <br/>
            </div>
        </>
    )
}