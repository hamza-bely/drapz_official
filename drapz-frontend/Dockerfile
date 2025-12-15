
# ---------- 4) Runtime (image finale prod)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=4000
ENV HOST=0.0.0.0

# Installe uniquement les deps de prod
COPY package*.json ./
RUN npm ci --omit=dev

# Copie le build et les assets publics
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Expose le port
EXPOSE 4000

# Commande de démarrage Next.js
CMD ["npx", "next", "start", "-p", "4000
