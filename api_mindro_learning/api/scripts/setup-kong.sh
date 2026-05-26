#!/bin/bash

# Espera até o Kong estar disponível
echo "⏳ Aguardando o Kong iniciar..."
until curl -s http://localhost:8001/status > /dev/null; do
  sleep 2
done

echo "✅ Kong está ativo. Iniciando configuração..."

# Criar o serviço que aponta para a API NestJS
curl -i -X POST http://localhost:8001/services   --data name=nest-api   --data url=http://nest-api:3000

# Criar rota acessível via /api
curl -i -X POST http://localhost:8001/services/nest-api/routes   --data paths[]=/api

# Ativar plugin JWT (opcional)
curl -i -X POST http://localhost:8001/services/nest-api/plugins   --data name=jwt

echo "🎉 Configuração do Kong concluída com sucesso."
