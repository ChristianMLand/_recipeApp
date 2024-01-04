import { useState } from 'react';

export default function CategoryForm() {
    return (
        <form>
            <input type="text" placeholder="Category"/>
            <button>Create</button>
        </form>
    )
}