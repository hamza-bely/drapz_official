
# ---------- 1) Base Node pour toutes les étapes
FROM node:20-alpine AS base
WORKDIR /app
# Évite les prompts TTY et garde l'ENV cohérent
ENV CI=true

# ---------- 2) Dépendances (avec devDependencies pour la compilation TS)
FROM base AS deps
# Copie uniquement les manifestes pour maximiser le cache
COPY package*.json ./
# Installe AVEC devDependencies (typage TypeScript requis au build)
# npm ci est déterministe et rapide
RUN npm ci

# ---------- 3) Build (Next.js)
FROM base AS build
# Copie node_modules depuis deps
COPY --from=deps /app/node_modules ./node_modules
# Copie le code du projet
COPY . .
# Assure-toi que le build peut accéder aux dev dependencies
ENV NODE_ENV=development
# Next.js : compil + génération
RUN npm run build

# (Optionnel) si tu veux le mode standalone :
# RUN npm run build && ls -la .next/standalone

# ---------- 4) Runtime (image finale légère)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000



# --- Variante standard (sans standalone) :
# On installe seulement les deps de prod pour exécuter `next start`
COPY package*.json ./
RUN npm ci --omit=dev

# Copie le build Next et les assets publics
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
# (si tu as un fichier next.config.js qui lit des assets statiques)
# COPY --from=build /app/next.config.js ./next.config.js

# Expose le port
EXPOSE 4000

# Lancement Next.js
# NEXT_TELEMETRY_DISABLED pour éviter les logs télémetrie en prod
ENV NEXT_TELEMETRY_DISABLED=1
