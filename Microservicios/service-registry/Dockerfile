# syntax=docker/dockerfile:1
# Build context esperado: carpeta "Microservicios/" (para poder reutilizar security-commons en otros servicios)

FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /build

COPY service-registry/pom.xml service-registry/pom.xml
RUN --mount=type=cache,target=/root/.m2/repository \
    mvn -q -f service-registry/pom.xml dependency:go-offline -B || true

COPY service-registry/src service-registry/src
RUN --mount=type=cache,target=/root/.m2/repository \
    mvn -f service-registry/pom.xml clean package -DskipTests -B

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /build/service-registry/target/*.jar app.jar

EXPOSE 8761
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
