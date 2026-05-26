#!/bin/bash

echo "🔐 Configurando autenticação JWT no Kong..."

# Verifica se Kong está online
until curl -s http://localhost:8001/status > /dev/null; do
  echo "⏳ Aguardando Kong iniciar..."
  sleep 2
done

echo "✅ Kong está ativo."

# Criar consumidor de teste
curl -i -X POST http://localhost:8001/consumers \
  --data username=test-client

# Criar credencial JWT para o consumidor
curl -i -X POST http://localhost:8001/consumers/test-client/jwt

# Ativar plugin JWT no serviço
curl -i -X POST http://localhost:8001/services/nest-api/plugins \
  --data name=jwt

echo "✅ JWT ativado para o serviço nest-api."
echo "ℹ️ Use o seguinte comando para listar as chaves públicas e gerar o token JWT:"
echo "curl http://localhost:8001/consumers/test-client/jwt"
