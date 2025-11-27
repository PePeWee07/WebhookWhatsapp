# Etapa 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run tsc

# Etapa 2: Producción
FROM node:20-alpine
WORKDIR /app

# Instalar certificados del sistema
RUN apk add --no-cache ca-certificates curl && update-ca-certificates

COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/build ./build

RUN mkdir -p /app/logs/messages

# Hacer que Node use también las CAs del sistema
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

EXPOSE 8080

CMD ["node", "build/server.js"]
