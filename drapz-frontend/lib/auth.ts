import { AuthRequest, AuthResponse, InscriptionRequest } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function login(credentials: AuthRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/connexion`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
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
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error('Échec de l\'inscription');
    }

    const data = await response.json();
    return data;
}

export function setToken(token: string) {
    localStorage.setItem('token', token);
}

export function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

export function removeToken() {
    localStorage.removeItem('token');
}