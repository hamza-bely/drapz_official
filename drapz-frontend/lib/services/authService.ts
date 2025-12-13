/**
 * Service d'Authentification - Frontend
 *
 * Gère:
 * - Inscription
 * - Connexion
 * - Déconnexion
 * - Récupération des infos utilisateur
 * - Mot de passe oublié
 */

import { apiClient } from '../api-client';
import { AuthRequest, AuthResponse, InscriptionRequest } from '@/types/api';

export const authService = {
    /**
     * Inscrire un nouvel utilisateur
     */
    async register(userData: InscriptionRequest): Promise<AuthResponse> {
        const { data } = await apiClient.post('auth/inscription', userData);
        return data;
    },

    /**
     * Connecter un utilisateur
     */
    async login(credentials: AuthRequest): Promise<AuthResponse> {
        const { data } = await apiClient.post('auth/connexion', credentials);
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
     * Demander la réinitialisation du mot de passe
     */
    async forgotPassword(email: string): Promise<void> {
        await apiClient.post('/auth/forgot-password', { email });
    },

    /**
     * Réinitialiser le mot de passe
     */
    async resetPassword(token: string, newPassword: string): Promise<void> {
        await apiClient.post('/auth/reset-password', { token, newPassword });
    },
};
