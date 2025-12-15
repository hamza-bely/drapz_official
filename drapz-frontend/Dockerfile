
# ---------- 1) Base Node pour toutes les étapes
FROM node:20-alpine AS base
WORKDIR /app
ENV CI=true

# ---------- 2) Dépendances (AVEC devDependencies pour TS/typages)
FROM base AS deps
# Copie uniquement les manifestes pour maximiser le cache
COPY package*.json ./
# Installe AVEC devDependencies (typage TS nécessaire pour next build)
RUN npm ci

# ---------- 3) Build (Next.js)
FROM base AS build
# Copie node_modules depuis deps
COPY --from=deps /app/node_modules ./node_modules
# Copie le code du projet
COPY . .
# Build Next (avec cache BuildKit pour .next/cache si tu utilises buildx)
# Si tu n’utilises pas buildx, enlève la ligne --mount
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

# ---------- 4) Runtime (image finale prod)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=4000

# Installe uniquement les deps de prod
COPY package*.json ./
RUN npm ci --omit=dev

# Copie le build et les assets publics
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
# (optionnel) si tu as next.config.js
# COPY --from=build /app/next.config.js ./next.config.js

# Expose le port
EXPOSE 4000

# Commande de démarrage Next.js
CMD ["npx", "next", "start", "-p", "4000"]
