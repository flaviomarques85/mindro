
up:
	docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build -d

kong:
	./scripts/setup-kong.sh

logs:
	docker-compose logs -f api

reset-db:
	npx prisma migrate reset --schema=database/prisma/schema.prisma

migrate:
	npx prisma migrate dev --schema=database/prisma/schema.prisma --name init

generate:
	npx prisma generate --schema=database/prisma/schema.prisma

dev: up kong logs
