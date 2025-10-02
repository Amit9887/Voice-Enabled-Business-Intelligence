# Multi-stage build for Railway deployment
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

FROM maven:3.8.6-openjdk-17-slim AS backend-builder

WORKDIR /app/backend
COPY backend/pom.xml ./
COPY backend/src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim

# Install font libraries for Apache POI Excel generation
RUN apt-get update && apt-get install -y \
    libfreetype6 \
    libfontconfig1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend JAR
COPY --from=backend-builder /app/backend/target/*.jar app.jar

# Copy frontend build
COPY --from=frontend-builder /app/frontend/build ./static

# Create reports directory
RUN mkdir -p reports

# Set headless mode for AWT operations
ENV JAVA_OPTS="-Djava.awt.headless=true"

EXPOSE 8080

# Start Spring Boot application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
