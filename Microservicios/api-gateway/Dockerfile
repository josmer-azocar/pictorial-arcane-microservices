# syntax=docker/dockerfile:1
# Build context esperado: carpeta "Microservicios/"

FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /build

COPY api-gateway/pom.xml api-gateway/pom.xml
RUN --mount=type=cache,target=/root/.m2/repository \
    mvn -q -f api-gateway/pom.xml dependency:go-offline -B || true

COPY api-gateway/src api-gateway/src
RUN --mount=type=cache,target=/root/.m2/repository \
    mvn -f api-gateway/pom.xml clean package -DskipTests -B

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /build/api-gateway/target/*.jar app.jar

EXPOSE 8060
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
