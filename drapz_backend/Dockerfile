
# -------- STAGE 1: BUILD --------
# Si ton hôte/registre est ARM64, tu peux forcer l’archi :
# FROM --platform=linux/arm64 eclipse-temurin:21-jdk-alpine AS builder
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# 1) Copie TOUT le projet (incluant build.gradle, settings.gradle, src/, gradlew, gradle/)
COPY . /app

# 2) (Fortement recommandé) Normaliser les fins de ligne au cas où gradlew a du CRLF
#    - sed supprime les \r en fin de ligne
RUN sed -i 's/\r$//' gradlew || true

# 3) S'assurer que gradlew est exécutable (APRES le COPY . sinon c’est écrasé)
RUN chmod +x gradlew

# 4) Vérifs / diagnostics utiles (temporaire, à enlever une fois que ça marche)
#    - Vérifie l’existence du wrapper jar
RUN test -f gradle/wrapper/gradle-wrapper.jar || (echo 'gradle-wrapper.jar manquant' && ls -la gradle/wrapper && exit 1)
#    - Affiche version gradle pour confirmer exécution OK
RUN ./gradlew --version

# 5) Build sans tests pour accélérer (enlève -x test si tu veux)
RUN --mount=type=cache,target=/root/.gradle \
    ./gradlew clean build -x check -x test

# -------- STAGE 2: RUNTIME --------
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copie le jar généré
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080