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
import { UserResponse } from '@/types/api';

type UserData = {
    email: string;
    nom: string;
    prenom: string;
    role: string;
    motDePasse?: string;
};

export const userService = {
    async getUsers(): Promise<UserResponse[]> {
        const { data } = await apiClient.get('/admin/users');
        return data;
    },

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
