import { useState, useContext, createContext } from "react";

const AppContext = createContext(null)

export const useAuthContext = () => useContext(AppContext);

export const AuthContext = ({ children }) => {
    const [loggedUser, setLoggedUser] = useState();

    return (
        <AppContext.Provider value={{ loggedUser, setLoggedUser }}>
            { children }
        </AppContext.Provider>
    );
};