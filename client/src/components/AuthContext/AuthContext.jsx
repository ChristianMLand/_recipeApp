import { useState, useEffect, createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useREST } from "~/hooks";

export const AppContext = createContext(null)

export const AuthContext = ({ children }) => {
    const [loggedUser, setLoggedUser] = useState();

    const authService = useREST("/auth");
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => authService.delete().then(() => setLoggedUser(null));

    useEffect(() => {
        if (location.pathname === "/" && loggedUser) navigate("/recipes");
        if (loggedUser) return;
        authService.get()
            .then(({ data }) => setLoggedUser(data))
            .catch(() => location.pathname !== "/" && navigate("/"));
    }, [location, loggedUser]);

    return (
        <AppContext.Provider value={{ loggedUser, logout }}>
            {children}
        </AppContext.Provider>
    );
};