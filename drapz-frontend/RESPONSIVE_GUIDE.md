# 📱 Guide de Responsivité - Drapz Frontend

## ✅ Optimisations Apportées

### 1. **Header Responsive**
- ✅ Menu hamburger pour mobile
- ✅ Navigation adaptative (caché sur mobile, visible sur desktop)
- ✅ Logo optimisé pour tous les écrans
- ✅ Icône panier avec badge adaptatif

**Breakpoints:**
- Mobile: < 768px (menu burger)
- Desktop: ≥ 768px (nav complète)
- Large: ≥ 1024px (plus d'espace)

### 2. **Footer Responsive**
- ✅ Grille 1 colonne (mobile) → 2 colonnes (tablet) → 4 colonnes (desktop)
- ✅ Textes et espacements adaptés
- ✅ Liens lisibles sur tous les appareils

### 3. **Pages Principales**
#### **Page d'Accueil** (`app/page.tsx`)
- ✅ Hero section avec texte responsive
- ✅ Grille features adaptative
- ✅ Produits en grille 1 → 2 → 4 colonnes
- ✅ Boutons full-width sur mobile

#### **Catalogue** (`app/catalogue/page.tsx`)
- ✅ Filtre de tri responsive
- ✅ Grille produits adaptative: 1 → 2 → 3 → 4 colonnes
- ✅ Pagination mobile-friendly
- ✅ Pagination complète sur desktop

#### **Panier** (`app/panier/page.tsx`)
- ✅ Layout adaptatif: mobile (col) → desktop (2/3 - 1/3)
- ✅ Fiche produit optimisée pour petit écran
- ✅ Contrôles quantité mobiles
- ✅ Résumé sticky sur desktop

#### **Authentification** (`app/auth/login|register`)
- ✅ Card centrée avec max-width
- ✅ Formulaires full-width sur mobile
- ✅ Labels et espacements optimisés
- ✅ Texte au minimum 16px (évite zoom iOS)

#### **Profil** (`app/profile/page.tsx`)
- ✅ Grille 1 → 2 → 3 colonnes
- ✅ Formulaires adaptatifs
- ✅ Liste commandes en grille
- ✅ Badges d'état lisibles

### 4. **Composants**
#### **ProductCard**
- ✅ Image avec bon ratio
- ✅ Texte avec `line-clamp`
- ✅ Bouton adaptatif ("+", "Ajouter")
- ✅ Espacement flexible

#### **ui/button**
- ✅ Hauteur adaptée (h-9 mobile, h-10 md, h-11 lg)
- ✅ Padding responsive
- ✅ Texte lisible sur tous les appareils

### 5. **Tailwind Configuration**
- ✅ Breakpoints complets (xs, sm, md, lg, xl, 2xl)
- ✅ Espacements safe-area pour encoche
- ✅ Classes helpers responsive

**Classes Tailwind disponibles:**
```
xs:  320px     (très petit mobile)
sm:  640px     (mobile)
md:  768px     (tablet)
lg:  1024px    (desktop)
xl:  1280px    (desktop large)
2xl: 1536px    (très grand écran)
```

### 6. **CSS Global** (`app/globals.css`)
- ✅ Safe-area support (encoche iOS)
- ✅ Font size base: 16px (évite zoom)
- ✅ Animations optimisées
- ✅ Classes helpers responsives

### 7. **Layout Général** (`app/layout.tsx`)
- ✅ Viewport meta correct
- ✅ Theme color pour mobile
- ✅ Scroll-smooth
- ✅ Overflow-x-hidden (évite scroll horizontal)

---

## 📐 Stratégie Mobile-First

Tous les composants suivent une approche **mobile-first**:

```tsx
// ❌ Mauvais
className="hidden md:block"  // Cache le contenu par défaut

// ✅ Bon
className="block md:hidden"  // Affiche d'abord, cache ensuite
```

---

## 📱 Breakpoints Utilisés

```
Mobile:          < 640px    (sm)
Tablet:          640-1024px (md-lg)
Desktop:         > 1024px   (lg+)
Large Desktop:   > 1280px   (xl+)
```

### Grilles Communes:
- **Produits**: 1 (mobile) → 2 (tablet) → 3-4 (desktop)
- **Cards**: 1 (mobile) → 2 (tablet) → 3-4 (desktop)
- **Formulaires**: full-width (mobile) → 2 colonnes max (desktop)

---

## 🎯 Tests de Responsivité

### À tester:
1. ✅ **iPhone SE** (375px) - Très petit écran
2. ✅ **iPhone 14** (390px) - Mobile standard
3. ✅ **iPad** (768px) - Tablet
4. ✅ **iPad Pro** (1024px+) - Large tablet
5. ✅ **Desktop 1920px** - Écran large

### Outils:
- Chrome DevTools (F12)
- Responsive Design Mode
- Viewport toggling

---

## 🚀 Optimisations de Performance Mobile

### Images
```tsx
// ✅ Responsive sizes
<Image
  src={url}
  alt="desc"
  sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Typography
```tsx
// ✅ Texte responsive
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
```

### Buttons
```tsx
// ✅ Taille adaptée
<Button className="h-9 md:h-10 lg:h-11 px-3 md:px-4 lg:px-6">
```

---

## 🔍 Checklist Responsive

- ✅ Pas de scrollbars horizontaux
- ✅ Texte lisible sur petit écran (16px minimum)
- ✅ Clics faciles (min 44px de hauteur)
- ✅ Images optimisées par taille
- ✅ Formes full-width ou 2-col max
- ✅ Navigation accessible sur mobile
- ✅ Espacements adaptés
- ✅ Grilles flexibles

---

## 📞 Besoin d'aide?

Pour ajouter une nouvelle page responsive:

1. Utiliser une grille adaptative:
   ```tsx
   className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
   ```

2. Utiliser des classes helpers:
   ```tsx
   className="text-responsive-h1"  // h1 adaptatif
   className="btn-responsive"      // bouton adaptatif
   ```

3. Tester sur mobile en premier!

---

**Dernière mise à jour**: Décembre 2025
