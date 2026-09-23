# Build stage
FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy Maven POMs and source code
COPY pom.xml ./
COPY app/pom.xml ./app/
COPY app/src ./app/src

# Package Spring Boot application jar
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built artifact
COPY --from=builder /app/app/target/collabcode-app-1.0.0-SNAPSHOT.jar app.jar

ENV PORT=10000
EXPOSE 10000

# Optimize JVM heap size and GC for Render free tier (512MB RAM)
ENTRYPOINT ["java", "-Xmx384m", "-XX:+UseSerialGC", "-jar", "app.jar"]
