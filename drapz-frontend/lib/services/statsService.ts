/**
 * Service des Statistiques - Frontend
 * 
 * Gère:
 * - Récupération des statistiques pour le tableau de bord admin
 */

import { apiClient } from '../api-client';

// Define the types for the responses based on the backend DTOs
export interface SummaryStatsResponse {
    totalRevenue: number;
    totalUsers: number;
    totalOrders: number;
    totalProducts: number;
}

export interface RevenueOverTimeResponse {
    date: string;
    revenue: number;
}

export interface TopSellingProductResponse {
    productName: string;
    sales: number;
}

export const statsService = {
    /**
     * Récupérer les statistiques récapitulatives
     */
    async getSummaryStats(): Promise<SummaryStatsResponse> {
        const { data } = await apiClient.get('/admin/stats/summary');
        return data;
    },

    /**
     * Récupérer les revenus au fil du temps
     */
    async getRevenueOverTime(): Promise<RevenueOverTimeResponse[]> {
        const { data } = await apiClient.get('/admin/stats/revenue-over-time');
        return data;
    },

    /**
     * Récupérer les produits les plus vendus
     */
    async getTopSellingProducts(): Promise<TopSellingProductResponse[]> {
        const { data } = await apiClient.get('/admin/stats/top-selling-products');
        return data;
    },
};
