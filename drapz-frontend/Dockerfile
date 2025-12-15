
# ---------- 1) Base Node pour toutes les étapes
FROM node:20-alpine AS base
WORKDIR /app
ENV CI=true

# ---------- 2) Dépendances (avec devDependencies pour le build)
FROM base AS deps
COPY package*.json ./
RUN npm ci

# ---------- 3) Build (Next.js)
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Optionnel: cache de build Next si BuildKit actif
# RUN --mount=type=cache,target=/app/.next/cache npm run build
RUN npm run build

# ---------- 4) Runtime (image finale prod)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=4000
ENV HOST=0.0.0.0

# Installer seulement les deps de prod
COPY package*.json ./
RUN npm ci --omit=dev

# Copier le build et les assets
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

EXPOSE 4000

# Lancer Next en écoutant sur 0.0.0.0
CMD ["npx", "next", "start", "-p", "4000", "-H", "0.0.0.0"]