MIGRATION_DIR := $(if $(MIGRATION_DIR),$(MIGRATION_DIR),/datakoro/database/src/migration/)

dev-certs:
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-keyout ./server/certs/privkey.pem \
	-out ./server/certs/fullchain.pem

clean:
	rm -Rf target

migration-setup:
	diesel setup --migration-dir $(MIGRATION_DIR)

up:
	docker compose up

up-fresh:
	docker compose down -v
	docker compose up

rebuild:
	docker compose build --force-rm --no-cache

into-psql:
	docker exec -it datakoro_master psql -U datakoro -d datakoro

into-server:
	docker exec -it datakoro_server bash

migrate:
	docker exec -it datakoro_server diesel migration run --migration-dir $(MIGRATION_DIR)

migration:
	docker exec -it datakoro_server diesel migration generate new_migration --migration-dir $(MIGRATION_DIR)

remove-db:
	docker stop datakoro_master
	docker rm datakoro_master
