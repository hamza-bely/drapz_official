import { AuthRequest, AuthResponse, InscriptionRequest } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/';

export async function login(credentials: AuthRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/connexion`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ IMPORTANT: Envoyer/recevoir les cookies
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        throw new Error('Échec de la connexion');
    }

    const data = await response.json();
    return data;
}

export async function register(userData: InscriptionRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/inscription`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ IMPORTANT: Envoyer/recevoir les cookies
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error('Échec de l\'inscription');
    }

    const data = await response.json();
    return data;
}

/**
 * Récupérer les infos de l'utilisateur connecté depuis le backend
 * Le token est automatiquement envoyé via le cookie HttpOnly
 */
export async function getCurrentUser(): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ Envoyer le cookie avec le token
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des infos utilisateur');
    }

    return response.json();
}

/**
 * Déconnexion - supprime le cookie côté serveur
 */
export async function logout(): Promise<void> {
    await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // ✅ Envoyer le cookie
    });
}

/**
 * Ces fonctions ne sont plus utilisées avec les cookies HttpOnly
 */
export function setToken(token: string) {
    // ❌ Non utilisé - le token est géré via les cookies HttpOnly
    console.warn('setToken n\'est plus nécessaire avec les cookies HttpOnly');
}

export function getToken(): string | null {
    // ❌ Non utilisé - le token est en cookie HttpOnly et automatiquement envoyé
    return null;
}

export function removeToken() {
    // ❌ Non utilisé - le logout supprime le cookie côté serveur
    console.warn('removeToken n\'est plus nécessaire avec les cookies HttpOnly');
}