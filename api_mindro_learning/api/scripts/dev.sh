#!/bin/bash

echo "🔧 Subindo containers com Docker Compose..."
docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build -d

echo "🔁 Configurando Kong..."
./setup-kong.sh

echo "📜 Exibindo logs da API..."
docker-compose logs -f api
