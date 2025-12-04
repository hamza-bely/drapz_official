import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token JWT aux requêtes
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// API Catalogue
export const catalogueApi = {
    getProduits: (page = 0, size = 10) =>
        apiClient.get(`api/produits?page=${page}&size=${size}`),
    getProduit: (id: string) =>
        apiClient.get(`api/produits/${id}`),
};

// API Authentification
export const authApi = {
    login: (email: string, motDePasse: string) =>
        apiClient.post('/api/auth/connexion', { email, motDePasse }),
    register: (userData: { email: string; motDePasse: string; nom: string; prenom: string }) =>
        apiClient.post('/api/auth/inscription', userData),
};

// API Paiement
export const paiementApi = {
    creerSession: (articles: Array<{ produitId: string; quantite: number }>) =>
        apiClient.post('api/paiement/creer-session', { articles }),
};

// API Commandes
export const commandesApi = {
    getMesCommandes: (page = 0, size = 10) =>
        apiClient.get(`api/commandes?page=${page}&size=${size}`),
    getCommande: (id: string) =>
        apiClient.get(`api/commandes/${id}`),
};