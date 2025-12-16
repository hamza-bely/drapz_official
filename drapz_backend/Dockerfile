
# -------- STAGE 1: BUILD --------
# Si ton hôte/registre est ARM64, décommente la ligne suivante :
# FROM --platform=linux/arm64 eclipse-temurin:21-jdk-alpine AS builder
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# 1) Copie le wrapper Gradle AVANT tout le reste pour profiter du cache Docker
COPY gradlew gradle.* /app/
COPY gradle /app/gradle
RUN chmod +x gradlew

# 2) Copie TOUT le projet (incluant build.gradle, settings.gradle, src/, etc.)
COPY . /app

# (Optionnel) diagnostic pour vérifier que les fichiers sont bien là
# RUN ls -la /app && ls -la /app/gradle && ls -la /app/src || true
# RUN test -f /app/build.gradle -o -f /app/build.gradle.kts || (echo "build.gradle introuvable" && exit 1)
# RUN test -f /app/settings.gradle -o -f /app/settings.gradle.kts || (echo "settings.gradle introuvable" && exit 1)

# Build sans tests pour accélérer (retire -x test si nécessaire)
RUN --mount=type=cache,target=/root/.gradle \
    ./gradlew clean build -x check -x test

# -------- STAGE 2: RUNTIME --------
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app
# Le jar spring boot final est généralement build/libs/<nom>.jar
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRY
