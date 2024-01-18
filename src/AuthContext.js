import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoggedInStatus = () => {
            const storedData = localStorage.getItem('memestr');
            setIsLoggedIn(!!storedData);
        };

        // Call the function to set the initial state
        checkLoggedInStatus();

        // Optionally set up a listener for localStorage changes if needed
        window.addEventListener('storage', checkLoggedInStatus);

        // Clean up the listener
        return () => {
            window.removeEventListener('storage', checkLoggedInStatus);
        };
    }, []);

    const value = {
        isLoggedIn,
        setIsLoggedIn,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
