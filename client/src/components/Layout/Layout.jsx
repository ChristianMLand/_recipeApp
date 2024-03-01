import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { useAuthContext } from "~/hooks";
import { logoutUser, getLoggedUser } from '~/services';
import style from './layout.module.css';

export default function Layout() {
    const { loggedUser, setLoggedUser } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        getLoggedUser().then(({ data, error }) => {
            if (data && !error) setLoggedUser(data);
            // else navigate("/404");
        });
    }, []);

    // if (!loggedUser) return <h1>Loading...</h1>;

    return (
        <> 
            <nav className={style.container}>
                <div className={style.hamburgerMenu}>
                    <input id="menu-toggle" type="checkbox" />
                    <label htmlFor="menu-toggle">
                        <span></span>
                    </label>
                    <ul>
                    { loggedUser ? 
                        <>
                            <li><Link to="/recipes">Home</Link></li>
                            <li><Link to="/recipes/add">Add Recipe</Link></li>
                            <li><Link to="/categories">View Categories</Link></li>
                            <li><Link to="/recipes/search">Search Recipes</Link></li>
                            <li><button onClick={() => logoutUser().then(() => navigate("/"))}>Logout</button></li> 
                        </> 
                        :
                        <li><Link to="/">Login</Link></li>
                    }
                    </ul>
                </div>
                <ul className="nav-links">
                { loggedUser ? 
                    <>
                        <li><Link to="/recipes">Home</Link></li>
                        <li><Link to="/recipes/add">Add Recipe</Link></li>
                        <li><Link to="/categories">View Categories</Link></li>
                        <li><Link to="/recipes/search">Search Recipes</Link></li>
                        <li><button onClick={() => logoutUser().then(() => navigate("/"))}>Logout</button></li> 
                    </> 
                    :
                    <li><Link to="/">Login</Link></li>
                }
                </ul>   
            </nav>
            <Outlet />
        </>
    );
}