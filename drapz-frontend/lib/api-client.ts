import axios from 'axios';
import { redirect } from 'next/navigation';

const API_BASE_URL = 'http://localhost:8080/api/';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // ✅ IMPORTANT: Envoyer automatiquement les cookies aux requêtes
});

/**
 * Intercepteur pour les réponses avec erreurs
 * Gère les erreurs 401 (non authentifié) en redirigeant vers la page de login
 */
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si erreur 401, l'utilisateur n'est pas authentifié ou la session a expiré
        if (error.response?.status === 401) {
            console.warn('Session expirée ou utilisateur non authentifié');
            // Rediriger vers la page de login
            if (typeof window !== 'undefined') {
                //window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname);
            }
        }
        return Promise.reject(error);
    }
);

/**
 * Intercepteur pour ajouter le token JWT aux requêtes
 * NOTE: Avec les cookies HttpOnly, le token est automatiquement envoyé
 */
apiClient.interceptors.request.use((config) => {
    // ✅ Le token est automatiquement dans le cookie HttpOnly
    return config;
});

// API Catalogue
export const catalogueApi = {
    getProduits: (page = 0, size = 10) =>
        apiClient.get(`produits?page=${page}&size=${size}`),
    getProduit: (id: string) =>
        apiClient.get(`produits/${id}`),
};

// API Pays
export const paysApi = {
    getTousPays: () =>
        apiClient.get('pays'),
    getPaysParCode: (code: string) =>
        apiClient.get(`pays/${code}`),
};



// API Paiement
export const paiementApi = {
    creerSession: (articles: Array<{ produitId: string; quantite: number }>) =>
        apiClient.post('paiement/creer-session', { articles }),
};

// API Commandes
export const commandesApi = {
    getMesCommandes: (page = 0, size = 10) =>
        apiClient.get(`commandes?page=${page}&size=${size}`),
    getCommande: (id: string) =>
        apiClient.get(`commandes/${id}`),
};