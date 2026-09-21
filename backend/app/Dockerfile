# Build stage
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

# Copy parent and module pom files first for dependency layer caching
COPY pom.xml .
COPY app/pom.xml app/

# Download dependencies
RUN mvn -B -f app/pom.xml dependency:go-offline -DskipTests

# Copy source code
COPY app/src app/src

# Package application jar
RUN mvn -B -f app/pom.xml clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /build/app/target/collabcode-app-*.jar app.jar

USER appuser
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
