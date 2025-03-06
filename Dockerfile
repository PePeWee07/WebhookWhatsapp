# Etapa 1: Compilación
FROM node:16-alpine AS builder
WORKDIR /app

# Copia los archivos de configuración de npm
COPY package*.json ./

# Instala todas las dependencias (incluyendo devDependencies, necesarias para compilar)
RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila TypeScript (esto generará el código en la carpeta "build" según tu tsconfig.json)
RUN npm run tsc

# Etapa 2: Imagen de producción
FROM node:16-alpine
WORKDIR /app

# Copia los archivos de configuración necesarios
COPY package*.json ./

# Instala solo las dependencias de producción
RUN npm install --production

# Copia la carpeta compilada desde la etapa de build
COPY --from=builder /app/build ./build

# Crea la carpeta para los logs de mensajes
RUN mkdir -p /app/logs/messages

# Expone el puerto
EXPOSE 8081

# Comando para iniciar la aplicación en producción
CMD ["node", "build/server.js"]
