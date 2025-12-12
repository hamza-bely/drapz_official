export interface ProduitResponse {
    id: string;
    nom: string;
    description: string;
    prix: number;
    stock: number;
    imageUrl: string;
    actif: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PageProduitResponse {
    totalElements: number;
    totalPages: number;
    size: number;
    content: ProduitResponse[];
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
}

export interface CommandeResponse {
    id: string;
    statut: 'EN_ATTENTE' | 'CONFIRMEE' | 'EXPEDIEE' | 'LIVREE' | 'ANNULEE' | 'REMBOURSEE';
    montantTotal: number;
    createdAt: string;
    lignes: LigneCommandeResponse[];
    utilisateur: {
        nom: string;
        prenom: string;
        email: string;
    };
}

export interface LigneCommandeResponse {
    id: string;
    produitId: string;
    produitNom: string;
    quantite: number;
    prixUnitaire: number;
    sousTotal: number;
}

export interface CreerSessionRequest {
    articles: LigneCommandeRequest[];
}

export interface LigneCommandeRequest {
    produitId: string;
    quantite: number;
}

export interface CreerSessionResponse {
    sessionId: string;
    commandeId: string;
    url: string;
}

export interface AuthRequest {
    email: string;
    motDePasse: string;
}

export interface AuthResponse {
    token: string;
    type: string;
    email: string;
    nom: string;
    prenom: string;
    role: string;
}

export interface InscriptionRequest {
    email: string;
    motDePasse: string;
    nom: string;
    prenom: string;
}

export interface UserResponse {
    id: string;
    email: string;
    nom: string;
    prenom: string;
    role: string;
}