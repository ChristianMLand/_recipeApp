import { Link } from 'react-router-dom';

export default function Error() {
    return(
        <main id="error-container">
            <h1>404</h1>
            <p>Did you get lost? <Link to="/">Go Back</Link></p>
        </main>
    );
}