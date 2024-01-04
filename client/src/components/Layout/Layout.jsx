import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { useAuthContext } from "~/hooks";
import { logoutUser, getLoggedUser } from '~/services';

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
            <nav>
                <div className="hamburger-menu">
                    <input id="menu__toggle" type="checkbox" />
                    <label className="menu__btn" htmlFor="menu__toggle">
                        <span></span>
                    </label>
                    <ul className="menu__box">
                    { loggedUser ? 
                        <>
                            <li><Link className="menu__item" to="/recipes">Home</Link></li>
                            <li><Link className="menu__item" to="/recipes/add">Add Recipe</Link></li>
                            <li><Link className="menu__item" to="/categories">View Categories</Link></li>
                            <li><button onClick={() => logoutUser().then(() => navigate("/"))}>Logout</button></li> 
                        </> 
                        :
                        <li><Link className="menu__item" to="/">Login</Link></li>
                    }
                    </ul>
                </div>
                <ul className="nav-links">
                { loggedUser ? 
                    <>
                        <li><Link to="/recipes">Home</Link></li>
                        <li><Link to="/recipes/add">Add Recipe</Link></li>
                        <li><Link to="/categories">View Categories</Link></li>
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