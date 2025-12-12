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
import { AuthResponse, UserResponse } from '@/types/api';

type UserData = {
    email: string;
    nom: string;
    prenom: string;
    role: string;
    motDePasse?: string;
};

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

    // --- Admin User Management ---

    /**
     * Récupérer tous les utilisateurs (Admin)
     */
    async getUsers(): Promise<UserResponse[]> {
        const { data } = await apiClient.get('/admin/users');
        return data;
    },

    /**
     * Récupérer un utilisateur par son ID (Admin)
     */
    async getUserById(id: string): Promise<UserResponse> {
        const { data } = await apiClient.get(`/admin/users/${id}`);
        return data;
    },

    /**
     * Créer un nouvel utilisateur (Admin)
     */
    async createUser(userData: UserData): Promise<UserResponse> {
        const { data } = await apiClient.post('/admin/users', userData);
        return data;
    },

    /**
     * Mettre à jour un utilisateur (Admin)
     */
    async updateUser(id: string, userData: Partial<UserData>): Promise<UserResponse> {
        const { data } = await apiClient.put(`/admin/users/${id}`, userData);
        return data;
    },

    /**
     * Supprimer un utilisateur (Admin)
     */
    async deleteUser(id: string): Promise<void> {
        await apiClient.delete(`/admin/users/${id}`);
    },
};
