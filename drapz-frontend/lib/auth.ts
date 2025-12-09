import { AuthRequest, AuthResponse, InscriptionRequest } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/';

export async function login(credentials: AuthRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/connexion`, {
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
    const response = await fetch(`${API_URL}/auth/inscription`, {
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

export async function getCurrentUser(): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/me`, {
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

export async function logout(): Promise<void> {
    await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // ✅ Envoyer le cookie
    });
}

export async function requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(`${API_URL}/auth/reset-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error('Échec de la demande de réinitialisation');
    }
}

export async function confirmPasswordReset(token: string, nouveauMotDePasse: string): Promise<void> {
    const response = await fetch(`${API_URL}/auth/reset-confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, nouveauMotDePasse }),
    });

    if (!response.ok) {
        throw new Error('Échec de la confirmation de réinitialisation');
    }
}