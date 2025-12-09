/**
 * Service d'Authentification - Frontend
 * 
 * Gère:
 * - Inscription
 * - Connexion
 * - Récupération des infos utilisateur
 * - Déconnexion
 */

import { apiClient } from '../api-client';
import { AuthResponse } from '@/types/api';

export const userService = {
    /**
     * Inscrire un nouvel utilisateur
     */
    async register(userData: {
        email: string;
        motDePasse: string;
        nom: string;
        prenom: string;
    }): Promise<AuthResponse> {
        const { data } = await apiClient.post('auth/inscription', userData);
        return data;
    },

    /**
     * Connecter un utilisateur
     */
    async login(email: string, motDePasse: string): Promise<AuthResponse> {
        const { data } = await apiClient.post('auth/connexion', {
            email,
            motDePasse,
        });
        return data;
    },

    /**
     * Récupérer les infos de l'utilisateur connecté
     */
    async getCurrentUser(): Promise<AuthResponse> {
        const { data } = await apiClient.get('auth/me');
        return data;
    },

    /**
     * Déconnecter l'utilisateur
     */
    async logout(): Promise<void> {
        await apiClient.post('auth/logout');
    },

    /**
     * Demander une réinitialisation de mot de passe
     */
    async requestPasswordReset(email: string): Promise<void> {
        await apiClient.post('auth/reset-request', { email });
    },

    /**
     * Confirmer et réinitialiser le mot de passe
     */
    async confirmPasswordReset(token: string, nouveauMotDePasse: string): Promise<void> {
        await apiClient.post('auth/reset-confirm', { token, nouveauMotDePasse });
    },
};
