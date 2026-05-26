# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache ca-certificates && update-ca-certificates

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY database/prisma ./database/prisma/
# Prisma generate requires a DATABASE_URL at build time but the value is
# only used by the generator, not embedded in the output binary.
RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" \
    npx prisma generate --schema=database/prisma/schema.prisma

COPY . .
RUN npm run build

# Stage 2: production
FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache ca-certificates && update-ca-certificates

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/database/prisma ./database/prisma

ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "dist/main"]
