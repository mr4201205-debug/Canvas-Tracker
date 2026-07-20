# Build stage using Java 21
#This pulls a temporary environment that contains Java 21 and Maven 3.9 so we can build the project. I named this stage build so I can reference it later.
FROM maven:3.9-eclipse-temurin-21 AS build
#This sets our working directory inside the container to a folder named /app
WORKDIR /app
#This copies all of my source code and configuration files from my local machine into that container folder.
COPY . .
#This commands Maven to compile our Java code and package it into an executable .jar file.
#I skipped the tests here just to speed up the automated deployment pipeline on Render.
RUN mvn clean package -DskipTests

# Run stage using Java 21. This starts a completely fresh, separate stage. Crucially, it uses a JRE (Java Runtime Environment) instead of a JDK.
#It doesn't have compiler tools or Maven, making it incredibly lightweight.
FROM eclipse-temurin:21-jre
#Sets the folder directory for our running application.
WORKDIR /app
#It reaches back into our first stage (--from=build), grabs only the compiled .jar file from the target folder, and copies it here, renaming it to a clean app.jar.
COPY --from=build /app/target/canvas-tracker-0.0.1-SNAPSHOT.jar app.jar
#lisens to port 8080 which is the deafult port for spring boot.
EXPOSE 8080
#Tis line runs our application.
ENTRYPOINT ["java", "-jar", "app.jar"]
