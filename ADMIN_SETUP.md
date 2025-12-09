# Système d'Administration - Drapz

## Vue d'ensemble

Le système d'administration Drapz fournit une interface complète pour gérer les utilisateurs, les produits et les commandes du site e-commerce.

## Structure des Routes Admin

```
/admin/                    → Redirection vers /admin/dashboard
/admin/dashboard           → Page d'accueil de l'administration
/admin/users              → Gestion des utilisateurs
/admin/products           → Gestion des produits
/admin/orders             → Gestion des commandes
```

## Fonctionnalités

### Dashboard (`/admin/dashboard`)
- Affiche les statistiques principales:
  - Nombre total d'utilisateurs
  - Nombre total de produits
  - Nombre total de commandes
  - Revenu total généré
- Accès rapide à toutes les pages de gestion
- Informations système

### Gestion des Utilisateurs (`/admin/users`)
- **Affichage en tableau** avec:
  - Email de l'utilisateur
  - Rôle (Admin/User)
  - Statut (Actif/Inactif)
  - Date de création
- **Créer** un nouvel utilisateur
  - Saisir l'email
  - Créer un mot de passe
  - Assigner un rôle
- **Activer/Désactiver** un utilisateur
- **Supprimer** un utilisateur (non disponible pour l'utilisateur connecté)

### Gestion des Produits (`/admin/products`)
- **Affichage en grille** avec:
  - Image du produit
  - Nom et pays
  - Description courte
  - Prix et stock
- **Créer** un nouveau produit
  - Nom, description, prix, stock
  - Sélectionner le pays associé
  - Ajouter une URL d'image
  - Statut actif/inactif
- **Éditer** un produit existant
- **Supprimer** un produit
- Filtrage et recherche par pays

### Gestion des Commandes (`/admin/orders`)
- **Affichage des commandes** avec:
  - Numéro de commande unique
  - Client (email)
  - Montant total
  - Statut (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
  - Date et heure
- **Détails des articles** dans chaque commande
- Filtrage par statut

## Protection des Routes

### Authentification
Toutes les routes admin sont protégées:
1. **Middleware NextJS** (`middleware.ts`):
   - Vérifie la présence du token JWT
   - Redirige vers `/auth/login` si non authentifié

2. **Layout Admin** (`app/admin/layout.tsx`):
   - Vérifie le rôle de l'utilisateur
   - Redirige vers `/` si l'utilisateur n'est pas ADMIN
   - Affiche la navigation latérale

### Redirection Automatique
- **Utilisateurs ADMIN**: Redirigés automatiquement vers `/admin/dashboard` au login
- **Utilisateurs NORMAL**: Redirigés vers `/` (page d'accueil)
- **Non authentifiés**: Redirigés vers `/auth/login`

## Navigation

La barre latérale du layout admin fournit la navigation vers:
- 📊 Dashboard
- 👥 Gestion Utilisateurs
- 🏷️ Gestion Produits
- 📦 Gestion Commandes
- ← Retour au site

## Endpoints API Utilisés

### Utilisateurs
```
GET     /api/utilisateurs              - Liste tous les utilisateurs
POST    /api/utilisateurs              - Créer un utilisateur
PUT     /api/utilisateurs/{id}         - Mettre à jour un utilisateur
DELETE  /api/utilisateurs/{id}         - Supprimer un utilisateur
```

### Produits
```
GET     /api/produits?page=0&size=1000 - Liste tous les produits
POST    /api/produits                   - Créer un produit
PUT     /api/produits/{id}              - Mettre à jour un produit
DELETE  /api/produits/{id}              - Supprimer un produit
```

### Pays
```
GET     /api/pays?page=0&size=1000      - Liste tous les pays
```

### Commandes
```
GET     /api/commandes                  - Liste toutes les commandes
```

## Configuration du Client API

Le client API est configuré dans `lib/api-client.ts`:
```typescript
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api/',
    withCredentials: true,
});
```

Les tokens JWT sont stockés dans les cookies HttpOnly pour la sécurité.

## Composants Utilisés

- **shadcn/ui**:
  - Button
  - Card
  - Input
  - Dialog
  - Badge
  - Table

## Styles

Le système utilise Tailwind CSS pour le styling avec une palette cohérente:
- **Bleu** (#2563eb) - Utilisateurs, Liens
- **Vert** (#16a34a) - Produits, Actions
- **Orange** (#ea580c) - Commandes
- **Pourpre** (#a855f7) - Revenu
- **Rouge** (#dc2626) - Admin, Suppressions

## Hooks Personnalisés

### `useAdminRoute()`
Hook pour protéger les pages admin et vérifier le rôle:
```typescript
const { isAdmin, loading } = useAdminRoute();
```

## Remarques Importantes

1. **Protections en Place**:
   - Vérification du rôle au niveau du layout
   - Vérification du rôle au niveau du middleware
   - Protection des endpoints API (backend)

2. **Gestion des Erreurs**:
   - Tous les appels API sont dans des blocs try-catch
   - Les erreurs de réseau sont loggées dans la console

3. **Données Sensibles**:
   - Les mots de passe sont hachés côté backend (BCrypt)
   - Les tokens JWT sont stockés dans les cookies HttpOnly
   - Les requêtes DELETE demandent une confirmation

4. **Performance**:
   - Les produits et pays sont chargés avec pagination (1000 éléments par défaut)
   - Les statistiques sont calculées côté client pour réduire la charge serveur

## Améliorations Futures

- Ajouter la pagination en UI pour les grandes listes
- Implémenter les filtres avancés par date
- Ajouter l'export des données en CSV/Excel
- Implémenter les actions en masse (suppression multiple)
- Ajouter l'historique des modifications
- Mettre en place les notifications en temps réel
