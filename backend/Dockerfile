FROM openjdk:17-jdk-slim

# Install font libraries for Apache POI Excel generation
RUN apt-get update && apt-get install -y \
    libfreetype6 \
    libfontconfig1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY target/voice-report-poc-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

# Set headless mode for AWT operations
ENV JAVA_OPTS="-Djava.awt.headless=true"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
