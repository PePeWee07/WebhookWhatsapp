# Etapa 1: Construcción con Maven
FROM maven:3.8.4-openjdk-17 AS build

WORKDIR /app

# Copiamos el código fuente del webhook
COPY . .

# Compilamos el proyecto y generamos el .war
RUN mvn clean package -DskipTests

# Etapa 2: Ejecución en Tomcat
FROM tomcat:9.0

# Instalamos unzip para descomprimir el WAR
RUN apt update && apt install unzip -y

# Copiamos el .war generado a Tomcat con el nombre correcto
COPY --from=build /app/target/webhook.war /usr/local/tomcat/webapps/miapp.war

# Configuramos el usuario y roles en Tomcat
COPY tomcat-users.xml /usr/local/tomcat/conf/

# Forzamos a Tomcat a descomprimir el WAR
RUN mkdir -p /usr/local/tomcat/webapps/miapp && \
    unzip /usr/local/tomcat/webapps/miapp.war -d /usr/local/tomcat/webapps/miapp && \
    rm /usr/local/tomcat/webapps/miapp.war

# Copiar el archivo .env al contenedor
COPY .env /usr/local/tomcat/.env

# Exponemos el puerto de Tomcat
EXPOSE 8080

# Ejecutamos Tomcat
CMD ["catalina.sh", "run"]
