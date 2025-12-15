/**
 * Service des Commandes - Frontend
 * 
 * Gère:
 * - Récupération des commandes pour l'admin
 * - Mise à jour du statut des commandes
 */

import { apiClient } from '../api-client';
import {CommandeResponse, CreerSessionResponse, PageCommandeResponse} from '@/types/api';

export const orderService = {
    /**
     * Récupérer toutes les commandes (Admin)
     */
    async getOrders(): Promise<CommandeResponse[]> {
        const { data } = await apiClient.get('/admin/commandes');
        return data;
    },

    /**
     * Récupérer une commande par son ID (Admin)
     */
    async getOrderById(id: string): Promise<CommandeResponse> {
        const { data } = await apiClient.get(`/admin/commandes/${id}`);
        return data;
    },

    /**
     * Mettre à jour le statut d'une commande (Admin)
     */
    async updateOrderStatus(id: string, status: string): Promise<CommandeResponse> {
        const { data } = await apiClient.put(`/admin/commandes/${id}/status`, status, {
            headers: { 'Content-Type': 'text/plain' }
        });
        return data;
    },
    async createPaymentSession(articles: { produitId: string; quantite: number }[]): Promise<CreerSessionResponse> {
        const { data } = await apiClient.post('/paiement/creer-session', { articles });
        return data;
    },

    /**
     * Récupérer les commandes de l'utilisateur
     */
    async getUserOrders(page: number, size: number): Promise<PageCommandeResponse> {
        const { data } = await apiClient.get('/commandes', { params: { page, size } });
        return data;
    }
};