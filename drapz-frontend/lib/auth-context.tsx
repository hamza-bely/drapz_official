'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AuthResponse } from '@/types/api';
import { getCurrentUser, logout as authLogout } from './auth';

interface AuthContextType {
    user: AuthResponse | null;
    setUser: (user: AuthResponse | null) => void;
    isAdmin: boolean;
    logout: () => void;
    loading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    isAdmin: false,
    logout: () => { },
    loading: true,
    isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthResponse | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    /**
     * Au mount du provider, vérifier si l'utilisateur est connecté
     * en récupérant ses infos depuis le backend via le token stocké en cookie
     */
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
                setIsAuthenticated(true);
                setIsAdmin(userData?.role === 'ADMIN');
            } catch (error: any) {
                setUser(null);
                setIsAuthenticated(false);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const handleSetUser = (newUser: AuthResponse | null) => {
        setUser(newUser);
        setIsAuthenticated(newUser !== null);
        setIsAdmin(newUser?.role === 'ADMIN');
    };

    const logout = async () => {
        try {
            await authLogout(); // Appel au backend pour supprimer le cookie
        } catch (error) {
            console.error('❌ Erreur lors de la déconnexion:', error);
        } finally {
            handleSetUser(null);
            setIsAdmin(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser: handleSetUser, isAdmin, logout, loading, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);