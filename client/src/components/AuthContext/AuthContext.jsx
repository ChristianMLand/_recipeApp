import { useState, createContext } from "react";

export const AppContext = createContext(null)

export const AuthContext = ({ children }) => {
    const [loggedUser, setLoggedUser] = useState();

    return (
        <AppContext.Provider value={{ loggedUser, setLoggedUser }}>
            { children }
        </AppContext.Provider>
    );
};