'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AuthResponse } from '@/types/api';
import { getToken, removeToken } from './auth';

interface AuthContextType {
    user: AuthResponse | null;
    setUser: (user: AuthResponse | null) => void;
    isAdmin: boolean;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    isAdmin: false,
    logout: () => { },
    loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthResponse | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // Restore user session from localStorage on mount
    useEffect(() => {
        try {
            const token = getToken();
            const savedUser = localStorage.getItem('user');
            
            if (token && savedUser) {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                // Check if user is admin if needed
                setIsAdmin(false); // TODO: Parse from user data if available
            }
        } catch (error) {
            console.error('Failed to restore user session:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Save user info to localStorage when user changes
    const handleSetUser = (newUser: AuthResponse | null) => {
        setUser(newUser);
        if (newUser) {
            try {
                localStorage.setItem('user', JSON.stringify(newUser));
            } catch (error) {
                console.error('Failed to save user to localStorage:', error);
            }
        } else {
            try {
                localStorage.removeItem('user');
            } catch (error) {
                console.error('Failed to remove user from localStorage:', error);
            }
        }
    };

    const logout = () => {
        removeToken();
        handleSetUser(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ user, setUser: handleSetUser, isAdmin, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);