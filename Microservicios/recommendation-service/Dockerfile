# syntax=docker/dockerfile:1
# Build context esperado: carpeta "Microservicios/" (necesita security-commons como dependencia local)

FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /build

# security-commons: dependencia local (com.pictorial:security-commons), se instala en el repo .m2 compartido
COPY security-commons/pom.xml security-commons/pom.xml
COPY security-commons/src security-commons/src
RUN --mount=type=cache,target=/root/.m2/repository \
    mvn -q -f security-commons/pom.xml install -DskipTests -B

COPY recommendation-service/pom.xml recommendation-service/pom.xml
RUN --mount=type=cache,target=/root/.m2/repository \
    mvn -q -f recommendation-service/pom.xml dependency:go-offline -B || true

COPY recommendation-service/src recommendation-service/src
RUN --mount=type=cache,target=/root/.m2/repository \
    mvn -f recommendation-service/pom.xml clean package -DskipTests -B

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /build/recommendation-service/target/*.jar app.jar

EXPOSE 8072
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
