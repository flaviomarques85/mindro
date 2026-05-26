# Etapa 1: build
FROM node:20-alpine AS builder
WORKDIR /app

# Instala certificados SSL e atualiza trust store
RUN apk add --no-cache ca-certificates && update-ca-certificates  
# Copiar arquivos de dependência separadamente para aproveitar cache de camadas
COPY package*.json ./
RUN npm install

# Copiar schema e gerar Prisma Client
COPY database/prisma ./database/prisma/
COPY .env ./
RUN npx prisma generate --schema=database/prisma/schema.prisma

# Copiar todo código
COPY . .

# Build da aplicação
RUN npm run build

# Etapa 2: produção
FROM node:20-alpine
WORKDIR /app

# Instala certificados SSL e atualiza trust store
RUN apk add --no-cache ca-certificates && update-ca-certificates
# Copiar apenas o necessário
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/database/prisma ./database/prisma
COPY --from=builder /app/.env ./

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main"]