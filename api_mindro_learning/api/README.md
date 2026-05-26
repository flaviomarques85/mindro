# Polyglots Backend (NestJS + Prisma + Kong + PostgreSQL)

Este projeto é o backend de um app de ensino de idiomas. Ele utiliza:
- NestJS (Node.js)
- Prisma ORM
- PostgreSQL
- Kong (API Gateway)
- Konga (Interface grafica do Kong)
- Docker e Docker Compose

---

## 🚀 Como rodar localmente (macOS)

### 1. Clonar o projeto e entrar no diretório
```bash
git clone <repo-url>
cd polyglots-2.0-backend/api
```

### 2. Criar os arquivos de ambiente
Crie um arquivo `.env` na raiz com o conteúdo:

```env
DATABASE_URL="postgresql://admin:admin@postgres:5432/app?schema=public"
```

### 3. Subir todos os containers (produção)
```bash
docker-compose up --build
```

### 4. Rodar em modo desenvolvimento com hot-reload (recomendado durante criação)
```bash
docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build
```

> Esse modo mapeia o código local dentro do container e recarrega automaticamente ao salvar os arquivos.

---

## 📦 Containers utilizados

### PostgreSQL
- Usa imagem `postgres:15`
- Volumes persistentes ativados
- Cria dois bancos: `app` e `kong`
- Credenciais padrão: `admin / admin`

### Kong
- Usa imagem `kong:3.6`
- API de administração exposta em `http://localhost:8001`
- Proxy exposto em `http://localhost:8000`
- Conectado ao banco `kong`

### Konga
- Usa imagem `pantsel/konga:latest`
- API de administração: `http://localhost:1337`
- Conectado ao Kong

### NestJS API
- Porta: `http://localhost:3000`
- Documentação Swagger: `http://localhost:3000/api/docs`

---

## 🧩 Comandos úteis Prisma

### Gerar client após mudanças no schema
```bash
npx prisma generate --schema=database/prisma/schema.prisma
```

### Criar migration e aplicar no banco
```bash
npx prisma migrate dev --schema=database/prisma/schema.prisma --name init
```

### Resetar banco e reaplicar tudo (destrutivo)
```bash
npx prisma migrate reset --schema=database/prisma/schema.prisma
```

---

## 🧪 Testando com Postman

- `GET /users` → listar usuários
- `POST /users` → criar usuário
- `GET /api/docs` → acessar a documentação Swagger

---

## 📂 Estrutura esperada

```
api/
├── database/
│   └── prisma/
│       └── schema.prisma
├── src/
│   └── user/
│       ├── user.module.ts
│       ├── user.service.ts
│       ├── user.controller.ts
│       └── dto/
│           ├── create-user.dto.ts
│           └── update-user.dto.ts
├── Dockerfile
├── docker-compose.yml
├── docker-compose.override.yml
└── .env
```

---

## 🔒 Segurança e Produção

- Para produção, remova volumes mapeados no `override`
- Use certificados TLS no Kong (ou AWS API Gateway)
- Considere mover o banco para RDS e o Kong para ECS/Fargate

---
---

## 🧰 Comandos úteis Kong (Admin API)

### Criar um serviço que aponta para sua API NestJS
```bash
curl -i -X POST http://localhost:8001/services \
  --data name=nest-api \
  --data url=http://nest-api:3000
```

### Criar uma rota que expõe esse serviço via Kong
```bash
curl -i -X POST http://localhost:8001/services/nest-api/routes \
  --data paths[]=/api
```

### Ativar plugin JWT no serviço
```bash
curl -i -X POST http://localhost:8001/services/nest-api/plugins \
  --data name=jwt
```

### Verificar status do Kong
```bash
curl http://localhost:8001/status
```

### Acessar uma rota via Kong
```bash
curl http://localhost:8000/api/users
```

#### Caso de o erro: ####
Error: ...migrations.lua:16: Database needs bootstrapping or is older than Kong 1.0.

rode: 

```bash
docker-compose run --rm kong kong migrations bootstrap
```


---

## 🧪 Desenvolvimento com Docker (modo watch)

Você pode usar o `Makefile` ou o script `dev.sh` para acelerar o desenvolvimento com hot-reload via `ts-node-dev`.

### Usando Makefile (recomendado)
```bash
make dev         # Sobe containers, configura Kong e mostra logs
make migrate     # Aplica migrations Prisma
make reset-db    # Reseta o banco e reaplica tudo
make generate    # Gera o Prisma Client
make logs        # Logs da API
```

### Usando o script dev.sh
```bash
./scripts/dev.sh
```

---

## 🚀 Produção com Docker

Use o `Makefile` de produção para subir o sistema completo com containers reconstruídos:

### Comandos disponíveis
```bash
make up          # Sobe os containers em background
make down        # Derruba todos os containers
make rebuild     # Reconstrói tudo do zero
make kong        # (re)executa setup do Kong
make logs        # Logs da API em produção
```

> 💡 Para produção, remova ou ignore `docker-compose.override.yml` e não mapeie volumes locais.

---

---

## 📦 Deploy para Produção

Você pode usar o script `deploy.sh` para realizar o processo completo de build e configuração da aplicação em ambiente de produção.

### Passos automáticos:

- Sobe os containers com `docker-compose.prod.yml`
- Aguarda o Kong inicializar
- Executa automaticamente `setup-kong.sh`

### Comando único:
```bash
./scripts/deploy.sh
```

---

> 💡 Certifique-se de que o ambiente está limpo e os volumes persistentes estão corretamente configurados antes de rodar o deploy.



---

## ✅ Verificação de Saúde (Healthcheck)

Após o deploy, você pode rodar um checklist automático para garantir que os serviços estão de pé:

```bash
./scripts/check-health.sh
```

Este script valida:
- Conexão com o Kong Admin API (`localhost:8001`)
- Roteamento via Kong Proxy (`localhost:8000/api/ping`)
- Resposta básica da API NestJS (`localhost:3000`)

Se algo falhar, o script exibirá claramente o erro.

---
---

## 🧭 Interface Gráfica para Kong – Konga

O projeto inclui a interface **Konga** para gerenciar visualmente serviços, rotas, plugins e consumidores do Kong.

### ▶️ Acessar Konga

Depois de subir o projeto, acesse:

```
http://localhost:1337
```

### 🛠️ Primeira vez:
1. Crie um usuário e senha de admin. 
fhmarques
flaviomarques85@gmail.com
HugZMB@9DUa8M

2. Configure uma conexão com o Kong:
   - **Name**: Local Kong
   - **Kong Admin URL**: `http://kong:8001`

> Certifique-se de que o container `kong` está ativo antes de acessar o Konga.

---
---

## 🔐 Autenticação via JWT no Kong

O Kong está configurado para proteger os serviços com JWT. Para ativar a autenticação:

### 1. Execute o script:

```bash
./scripts/setup-jwt.sh
```

### 2. Isso irá:
- Criar um consumidor chamado `test-client`
- Gerar uma credencial JWT vinculada a ele
- Ativar o plugin JWT no serviço `nest-api`

### 3. Obtenha a chave para gerar tokens:

```bash
curl http://localhost:8001/consumers/test-client/jwt
```

#### Ou pode usar uma requsicao na API fora do Kong ####

Use os dados retornados (como `key` e `secret`) para assinar tokens JWT no seu app cliente.

> ⚠️ Após ativar o JWT, todas as chamadas à API via Kong precisarão de um token JWT válido no header:
> `Authorization: Bearer <seu_token>`

---
### 4. Habilitar o CORS (do contratio as requesições de fora da rede nao são aceitas)
```bash

curl -i -X POST http://localhost:8001/services/NOME-SERVICO/plugins \         
  --data "name=cors" \
  --data "config.origins=*" \                    
  --data "config.methods=GET" \
  --data "config.methods=POST" \
  --data "config.methods=PUT" \
  --data "config.methods=PATCH" \
  --data "config.methods=DELETE" \
  --data "config.methods=OPTIONS" \
  --data "config.headers=Authorization" \
  --data "config.headers=Content-Type" \
  --data "config.credentials=true"

  ```
