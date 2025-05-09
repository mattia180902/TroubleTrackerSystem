FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app

# Copy only the POM file first to leverage Docker cache
COPY pom.xml .
# Download all dependencies. Dependencies will be cached if the pom.xml file stays the same
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn package -DskipTests

# Runtime image
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=prod

# Expose port
EXPOSE 8081

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]