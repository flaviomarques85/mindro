#!/bin/bash

echo "🚀 Iniciando deploy para produção..."

# Subir os containers usando o arquivo de produção
echo "📦 Subindo containers com docker-compose.prod.yml..."
docker-compose -f docker-compose.prod.yml up --build -d

# Verificar se os containers subiram corretamente
echo "🧪 Verificando containers em execução..."
docker ps

# Aguardar alguns segundos para garantir que o Kong subiu
echo "⏳ Aguardando Kong iniciar..."
sleep 5

# Rodar configuração automática do Kong
echo "🔧 Configurando Kong..."
./setup-kong.sh

echo "✅ Deploy finalizado com sucesso!"
