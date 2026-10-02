// this file contains AuthProvider component which provides child components with user context

import {createContext, useContext, useState} from "react";

// creates context to store user authentication state
const AuthContext = createContext(null);

export function AuthProvider({children}) {
    // the current user
    const [user, setUser] = useState(() => {
        // tries to get user from local storage, if not there sets user to null
        const userSaved = localStorage.getItem('user');
        return userSaved ? JSON.parse(userSaved) : null;
    });

    // login function saves user object and JWT token in local storage, sets user
    const login = (token, userObject) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userObject));
        setUser(userObject);
    };

    // logout function removes user object and JWT token from local storage, sets user to null
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    // returns component as a context provider for child components, 
    // with current user & login/logout functions
    return (
        <AuthContext.Provider value = {{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

// function to let children components see current user and login/logout functions
export const useAuth = () => useContext(AuthContext);