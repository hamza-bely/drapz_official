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

type ProductData = {
  nom: string;
  description: string;
  prix: number;
  stock: number;
  imageUrl: string;
};

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

    /**
     * Créer un nouveau produit
     */
    async createProduct(productData: ProductData): Promise<ProduitResponse> {
        const { data } = await apiClient.post('/produits', productData);
        return data;
    },

    /**
     * Mettre à jour un produit existant
     */
    async updateProduct(id: string, productData: ProductData): Promise<ProduitResponse> {
        const { data } = await apiClient.put(`/produits/${id}`, productData);
        return data;
    },

    /**
     * Supprimer un produit
     */
    async deleteProduct(id: string): Promise<void> {
        await apiClient.delete(`/produits/${id}`);
    },
};
