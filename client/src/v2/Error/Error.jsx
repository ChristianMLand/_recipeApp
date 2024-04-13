import { Link } from 'react-router-dom';
import style from './error.module.css';

export default function Error() {
    return(
        <main className={style.errorContainer}>
            <h1>404</h1>
            <p>Did you get lost? <Link to={-1}>Go Back</Link></p>
        </main>
    );
}