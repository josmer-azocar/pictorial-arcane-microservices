# syntax=docker/dockerfile:1
# Build context esperado: carpeta "Microservicios/"

FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /build

COPY config-server/pom.xml config-server/pom.xml
RUN --mount=type=cache,target=/root/.m2/repository \
    mvn -q -f config-server/pom.xml dependency:go-offline -B || true

COPY config-server/src config-server/src
RUN --mount=type=cache,target=/root/.m2/repository \
    mvn -f config-server/pom.xml clean package -DskipTests -B

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /build/config-server/target/*.jar app.jar

EXPOSE 8088
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
