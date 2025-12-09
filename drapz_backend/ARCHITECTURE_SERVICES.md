# Architecture des Services - Drapz Backend

## Vue d'ensemble
Le backend Drapz a été réorganisé avec une architecture de services bien séparée et claire.

## Services

### 1. **UserService** (Authentification et Gestion Utilisateurs)
**Location:** `src/main/java/com/drapz/service/UserService.java`

**Responsabilités:**
- Inscription de nouveaux utilisateurs
- Connexion et génération de JWT
- Récupération des infos utilisateur connecté

**Méthodes:**
- `inscription(InscriptionRequest)` - Créer un nouveau compte
- `connexion(AuthRequest)` - Authentifier et générer JWT
- `getCurrentUser(String email)` - Récupérer les infos de l'utilisateur

**Utilisé par:** `AuthController`

---

### 2. **ProduitService** (Consultation des Produits)
**Location:** `src/main/java/com/drapz/service/ProduitService.java`

**Responsabilités:**
- Récupérer la liste des produits (pagination)
- Détails d'un produit par ID
- Trouver un produit par code pays

**Méthodes:**
- `obtenirProduits(Pageable)` - Liste pagée des produits
- `obtenirProduitParId(String)` - Détails d'un produit
- `obtenirProduitParPaysCode(String)` - Produit d'un pays

**Utilisé par:** `ProduitController` (GET endpoints)

---

### 3. **AdminService** (Gestion Admin des Produits)
**Location:** `src/main/java/com/drapz/service/AdminService.java`

**Responsabilités:**
- Créer des produits
- Mettre à jour les produits
- Supprimer (soft delete) les produits

**Méthodes:**
- `creerProduit(ProduitRequest)` - Ajouter un nouveau produit
- `mettreAJourProduit(String id, ProduitRequest)` - Modifier un produit
- `supprimerProduit(String id)` - Marquer comme inactif

**Accès:** Admin uniquement (protégé par JWT)
**Utilisé par:** `ProduitController` (POST, PUT, DELETE endpoints)

---

### 4. **CommandeService** (Gestion des Commandes et Paiements)
**Location:** `src/main/java/com/drapz/service/CommandeService.java`

**Responsabilités:**
- Créer une session de paiement Stripe
- Récupérer l'historique des commandes
- Traiter les paiements confirmés/échoués
- Gérer le stock après paiement

**Méthodes:**
- `creerSessionPaiement(String userId, CreerSessionRequest)` - Session Stripe
- `obtenirCommandesUtilisateur(String userId, Pageable)` - Historique
- `obtenirCommandeParId(String commandeId, String userId)` - Détails commande
- `traiterPaiementConfirme(String sessionId)` - Confirmer et mettre à jour stock
- `traiterPaiementEchoue(String sessionId)` - Annuler la commande

**Utilisé par:** `CommandeController`, `PaiementController`

---

### 5. **PaysService** (Gestion des Pays)
**Location:** `src/main/java/com/drapz/service/PaysService.java`

**Responsabilités:**
- Récupérer la liste de tous les pays
- Trouver un pays par code

**Méthodes:**
- `obtenirTousPays()` - Liste complète
- `obtenirPaysParCode(String code)` - Recherche par code

**Utilisé par:** `PaysController`

---

## Architecture Layers

```
┌─────────────────────┐
│   Controllers       │
├─────────────────────┤
│  AuthController     │
│  ProduitController  │
│  CommandeController │
│  PaysController     │
│  PaiementController │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│     Services        │
├─────────────────────┤
│   UserService       │
│   ProduitService    │
│   AdminService      │
│   CommandeService   │
│   PaysService       │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Repositories       │
├─────────────────────┤
│  UtilisateurRepo    │
│  ProduitRepository  │
│  CommandeRepository │
│  PaysRepository     │
└─────────────────────┘
```

---

## Changements Effectués

### ✅ Supprimé
- **AuthService** → Remplacé par **UserService**
- Commentaires inutiles
- Code en try-catch non nécessaire dans les contrôleurs
- Méthode `mettreAJourStock()` (logique intégrée dans CommandeService)
- Doublons de conversion DTO

### ✅ Créé
- **UserService** - Service dédié aux utilisateurs
- **AdminService** - Service dédié aux opérations admin
- Documentation d'architecture

### ✅ Optimisé
- **ProduitService** - Lectures uniquement
- **CommandeService** - Logique de paiement centralisée
- **PaysService** - Service minimaliste et efficace
- Séparation des responsabilités

---

## Utilisation dans les Contrôleurs

### AuthController
```java
private final UserService userService;

// Inscription
userService.inscription(request);

// Connexion
userService.connexion(request);

// Infos utilisateur
userService.getCurrentUser(email);
```

### ProduitController
```java
private final ProduitService produitService;
private final AdminService adminService;

// Lire
produitService.obtenirProduits(pageable);
produitService.obtenirProduitParId(id);

// Admin
adminService.creerProduit(request);
adminService.mettreAJourProduit(id, request);
adminService.supprimerProduit(id);
```

---

## Bonnes Pratiques Respectées

✓ **Séparation des responsabilités** - Chaque service a un seul rôle
✓ **Single Responsibility Principle** - UserService ≠ AdminService
✓ **DRY (Don't Repeat Yourself)** - Conversion DTO centralisée
✓ **Logging** - Tous les services ont des logs via Slf4j
✓ **Transactions** - @Transactional sur les opérations critiques
✓ **Exception Handling** - Exceptions personnalisées
✓ **DTOs** - Communication avec les contrôleurs via DTOs

---

## Prochaines Étapes (Optionnel)

1. Créer des interfaces de service (UserServiceInterface, ProduitServiceInterface)
2. Ajouter des tests unitaires pour chaque service
3. Implémenter un système de cache pour les pays/produits
4. Ajouter des validations métier supplémentaires
