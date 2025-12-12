import axios from 'axios';

//ne pas change
const API_BASE_URL = 'http://localhost:8080/api/api/';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si erreur 401, l'utilisateur n'est pas authentifié ou la session a expiré
        if (error.response?.status === 401) {
            console.warn('Session expirée ou utilisateur non authentifié');
            // Rediriger vers la page de login

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
