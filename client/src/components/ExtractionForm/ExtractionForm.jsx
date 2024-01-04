import { useState } from 'react';
import { extractRecipe } from '~/services';
import { useNavigate } from 'react-router-dom';

export default function ExtractionForm() {
    const [url,setUrl] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        const { data, error } = await extractRecipe({ url });

        if (error) setError(error.error);
        else navigate(`/recipes/${data.id}/edit`);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} />
            { error && <span className="error">{error}</span>}
            <button>Extract</button>
        </form>
    )
}