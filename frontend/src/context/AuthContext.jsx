/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            return JSON.parse(storedUser);
        }
        return null;
    });
    const [loading] = useState(false);

    // Set initial token if exists
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (token) {
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    };

    const logout = async () => {
        try {
            // Need to specify URL since it's not imported here usually, 
            // but we can just use the header we have.
            // For now, let's just clear local state.
        } catch (error) {
            console.error('Logout error:', error);
        }
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
