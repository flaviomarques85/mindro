# Mindro — Local Development Setup

## Prerequisites

- Node.js 20+
- Docker + Docker Compose
- npm 10+

## Quick Start

### 1. Clone and install dependencies

```bash
git clone https://github.com/flaviomarques85/mindro.git
cd mindro
npm install          # installs all workspace dependencies
```

### 2. Configure environment variables

```bash
# API
cp api_mindro_learning/api/.env.example api_mindro_learning/api/.env
# Edit the file and fill in real values for OPENAI_API_KEY and STRIPE_SECRET_KEY

# Admin console
cp admin_console_mindro_learning/.env.example admin_console_mindro_learning/.env

# Mobile app
cp app_mindro_learning/.env.example app_mindro_learning/.env
```

### 3. Start the API + infrastructure

```bash
cd api_mindro_learning/api
make dev   # starts Postgres + Kong + API container, configures Kong, tails logs
```

This runs:
- **Postgres 15** on port `5432`
- **Kong API Gateway** on port `8000` (proxy) / `8001` (admin)
- **Konga** (Kong UI) on port `1337`
- **NestJS API** on port `3000` (hot-reload in dev)

### 4. Run database migrations (first run only)

```bash
cd api_mindro_learning/api
make migrate
```

### 5. Start the Admin Console

```bash
npm run admin:start    # from monorepo root — http://localhost:3001
```

### 6. Start the Mobile App

```bash
npm run app:start      # from monorepo root — opens Expo DevTools
```

## Makefile reference (API)

```
make help        Show all available targets
make up          Start dev containers
make down        Stop and remove containers
make stop        Stop containers (keep them)
make prod        Start production containers
make kong        Configure Kong routes
make logs        Tail API logs
make migrate     Run Prisma migrations
make generate    Regenerate Prisma client
make reset-db    Reset database (dev only — destructive)
make clean       Remove containers, volumes, and images
```

## Environment variables

| Service       | File                                    | Required keys                                            |
|---------------|-----------------------------------------|----------------------------------------------------------|
| API           | `api_mindro_learning/api/.env`          | `DATABASE_URL`, `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`   |
| Admin Console | `admin_console_mindro_learning/.env`    | `REACT_APP_API_BASE`, `REACT_APP_API_BEARER_TOKEN`      |
| Mobile App    | `app_mindro_learning/.env`              | `API_URL`, `API_BEARER_TOKEN`, `STRIPE_PUBLIC_KEY`      |

## CI/CD

GitHub Actions runs on every push to `main` and on pull requests:

- **API job**: install → Prisma generate → lint → build → test
- **Admin job**: install → build
- **Mobile job**: install → type check → Expo web export
- **Docker job** (main only): build Docker image for the API

See `.github/workflows/ci.yml` for the full pipeline.

## Production deployment

Use `docker-compose.prod.yml`. All environment variables **must** be injected at runtime — no `.env` files in production. Use a secrets manager (AWS Secrets Manager, Doppler, etc.).

```bash
cd api_mindro_learning/api
POSTGRES_USER=... POSTGRES_PASSWORD=... OPENAI_API_KEY=... STRIPE_SECRET_KEY=... make prod
```
