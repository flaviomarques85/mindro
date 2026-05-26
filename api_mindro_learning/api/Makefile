.PHONY: help up down stop logs dev prod kong migrate generate reset-db clean

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

up: ## Start dev environment (API + Postgres + Kong)
	docker compose -f docker-compose.yml -f docker-compose.override.yml up --build -d

down: ## Stop and remove containers (keeps volumes)
	docker compose -f docker-compose.yml -f docker-compose.override.yml down

stop: ## Stop containers without removing them
	docker compose -f docker-compose.yml -f docker-compose.override.yml stop

prod: ## Start production environment
	docker compose -f docker-compose.prod.yml up --build -d

prod-down: ## Stop production environment
	docker compose -f docker-compose.prod.yml down

kong: ## Configure Kong routes and services
	./scripts/setup-kong.sh

logs: ## Tail API logs
	docker compose logs -f api

migrate: ## Run Prisma migrations (dev)
	npx prisma migrate dev --schema=database/prisma/schema.prisma --name init

generate: ## Regenerate Prisma client
	npx prisma generate --schema=database/prisma/schema.prisma

reset-db: ## Reset database (destructive — dev only)
	npx prisma migrate reset --schema=database/prisma/schema.prisma

clean: ## Remove containers, volumes, and built images
	docker compose -f docker-compose.yml -f docker-compose.override.yml down -v --rmi local

dev: up kong logs ## Full dev startup: containers + Kong config + log tail
