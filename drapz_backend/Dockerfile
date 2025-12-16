
# -------- STAGE 1: BUILD --------
# Si ton hôte/registre est ARM64, force l’architecture:
# FROM --platform=linux/arm64 eclipse-temurin:21-jdk-alpine as builder
FROM eclipse-temurin:21-jdk-alpine as builder

WORKDIR /app
# Copie le fichier de wrapper Gradle et les scripts en premier pour profiter du cache
COPY gradlew gradle.* /app/
COPY gradle /app/gradle

# Donne les droits d’exécution au wrapper
RUN chmod +x gradlew

# Copie le reste du projet
COPY gradle/wrapper /app

# (Optionnel) configure Java pour Gradle
ENV JAVA_HOME=/opt/java/openjdk
ENV PATH=$JAVA_HOME/bin:$PATH

# Build sans tests pour accélérer (tu peux enlever -x test si tu veux)
RUN --mount=type=cache,target=/root/.gradle \
    ./gradlew clean build -x check -x test

# -------- STAGE 2: RUNTIME --------
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copie le jar généré par Spring Boot (bootJar)
COPY --from=builder /app/build/libs/*.jar app.jar

# Expose le port si ton app écoute sur 8080
EXPOSE 8080

ENTRYPOINT ["java","-jar","/app/app.jar"]
