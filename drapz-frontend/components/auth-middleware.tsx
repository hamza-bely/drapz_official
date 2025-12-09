'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthMiddleware() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            console.log(user)
            if (user.role === 'ADMIN') {
                // Redirection automatique vers le dashboard admin
                router.replace('/admin/dashboard');
            } else {
                // Redirection automatique vers la page d'accueil pour les utilisateurs normaux
                router.replace('/');
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement de votre profil...</p>
                </div>
            </div>
        );
    }

    // Si l'utilisateur est authentifié, on attend la redirection
    if (user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Redirection en cours...</p>
                    {user.role === 'ADMIN' && (
                        <p className="text-sm text-gray-500">Vers votre dashboard administrateur</p>
                    )}
                </div>
            </div>
        );
    }

    // Si pas connecté, afficher le formulaire de login
    return null;
}
