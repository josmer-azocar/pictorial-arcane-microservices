# syntax=docker/dockerfile:1
# Build context esperado: carpeta "Microservicios/"

FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /build

COPY core-service/pom.xml core-service/pom.xml
RUN --mount=type=cache,target=/root/.m2/repository \
    mvn -q -f core-service/pom.xml dependency:go-offline -B || true

COPY core-service/src core-service/src
RUN --mount=type=cache,target=/root/.m2/repository \
    mvn -f core-service/pom.xml clean package -DskipTests -B

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /build/core-service/target/*.jar app.jar

EXPOSE 8082
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
