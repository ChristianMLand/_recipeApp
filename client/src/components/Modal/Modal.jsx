import styles from './Modal.module.css';
import { forwardRef, useEffect, useId, useCallback } from 'react';

export default forwardRef(function Modal({ children }, ref) {
    const id = useId();

    const closeHandler = useCallback(e => {
        if (e.target.id === id) {
            ref.current.close();
        }
    }, [id]);

    useEffect(() => {
        let refClosure;
        ref.current.addEventListener("click", closeHandler);
        if (ref.current) refClosure = ref.current;
        return () => {
            refClosure.removeEventListener("click", closeHandler);
        }
    }, [id]);
    
    return (
        <dialog id={id} ref={ref} className={styles.modal}>
            { children }
        </dialog>
    );
});