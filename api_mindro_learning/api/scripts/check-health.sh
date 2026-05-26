#!/bin/bash

echo "🔍 Verificando saúde dos serviços após deploy..."

# Verificar Kong Admin API
echo -n "Kong Admin API (localhost:8001)... "
if curl -s http://localhost:8001/status | grep -q '"database":{"reachable":true'; then
  echo "✅ OK"
else
  echo "❌ Falha"
  exit 1
fi

# Verificar proxy Kong com rota da API
echo -n "Kong Proxy (localhost:8000/api/ping)... "
if curl -s http://localhost:8000/api/ping | grep -q 'pong'; then
  echo "✅ OK"
else
  echo "❌ Falha"
  exit 1
fi

# Verificar NestJS direto
echo -n "API NestJS (localhost:3000)... "
if curl -s http://localhost:3000 | grep -q 'Cannot GET /'; then
  echo "✅ OK"
else
  echo "⚠️ Algo diferente foi retornado"
fi

echo "🎯 Todos os serviços principais estão respondendo corretamente."
