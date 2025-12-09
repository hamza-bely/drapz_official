
import { apiClient } from '../api-client';
import { CommandeResponse, CreerSessionResponse } from '@/types/api';

export const orderService = {
    /**
     * Créer une session de paiement Stripe
     */
    async createPaymentSession(articles: Array<{
        produitId: string;
        quantite: number;
    }>): Promise<CreerSessionResponse> {
        const { data } = await apiClient.post('/paiement/creer-session', {
            articles,
        });
        return data;
    },

    /**
     * Récupérer l'historique des commandes de l'utilisateur
     */
    async getUserOrders(page: number = 0, size: number = 10): Promise<any> {
        const { data } = await apiClient.get(`/commandes?page=${page}&size=${size}`);
        return data;
    },

    /**
     * Récupérer les détails d'une commande
     */
    async getOrderById(id: string): Promise<CommandeResponse> {
        const { data } = await apiClient.get(`/commandes/${id}`);
        return data;
    },
};
