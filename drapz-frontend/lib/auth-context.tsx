'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AuthResponse } from '@/types/api';
import { getToken, removeToken } from './auth';

interface AuthContextType {
    user: AuthResponse | null;
    setUser: (user: AuthResponse | null) => void;
    isAdmin: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    isAdmin: false,
    logout: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthResponse | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = getToken();
        if (token && !user) {
            // TODO: Implement token validation/user info fetch if needed
        }
    }, [user]);

    const logout = () => {
        removeToken();
        setUser(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, isAdmin, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);