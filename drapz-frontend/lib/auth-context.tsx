'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthResponse } from '@/types/api';
import { userService } from './services/userService';

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
    const router = useRouter();
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
                // Essayer de récupérer le token du cookie
                // Si pas de token, getUserUser retournera une erreur 401
                const userData = await userService.getCurrentUser();
                setUser(userData);
                setIsAuthenticated(true);
                setIsAdmin(userData.role === 'ADMIN');
            } catch (error: any) {
                // Utilisateur non authentifié - pas d'appel API fait
                console.log('User not authenticated, navigating without login');
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
            await userService.logout(); // Appel au backend pour supprimer le cookie
        } catch (error) {
            console.error('❌ Erreur lors de la déconnexion:', error);
        } finally {
            handleSetUser(null);
            setIsAdmin(false);

            if (typeof window !== 'undefined') {
                router.push('/');
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser: handleSetUser, isAdmin, logout, loading, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);