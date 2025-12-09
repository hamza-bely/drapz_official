/**
 * Service des Produits - Frontend
 * 
 * Gère:
 * - Consultation du catalogue
 * - Détails des produits
 * - Filtrage par pays
 */

import { apiClient } from '../api-client';
import { ProduitResponse } from '@/types/api';

export const productService = {
    /**
     * Récupérer la liste pagée des produits
     */
    async getProducts(page: number = 0, size: number = 10): Promise<any> {
        const { data } = await apiClient.get(`/produits?page=${page}&size=${size}`);
        return data;
    },

    /**
     * Récupérer un produit par son ID
     */
    async getProductById(id: string): Promise<ProduitResponse> {
        const { data } = await apiClient.get(`/produits/${id}`);
        return data;
    },

    /**
     * Récupérer un produit par le code du pays
     */
    async getProductByCountryCode(code: string): Promise<any> {
        const { data } = await apiClient.get(`/produits/pays/${code}`);
        return data;
    },
};
