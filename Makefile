
dev-certs:
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-keyout ./certs/privkey.pem \
	-out ./certs/fullchain.pem

install:
	npm install
	rm -Rf ./static/styles/
	mkdir -p ./static/styles/
	cp ./node_modules/modern-normalize/modern-normalize.css ./static/styles/modern-normalize.css
	cp ./node_modules/bulma/css/bulma.css ./static/styles/bulma.css
	cp ./node_modules/bulma/css/bulma.css.map ./static/styles/bulma.css.map
	cp ./node_modules/bulma/css/bulma.min.css ./static/styles/bulma.min.css
	npx prisma generate

migrate:
	npx prisma migrate deploy

migration:
	npx prisma migrate dev --name $(NAME)

build-release:
	npm run build

preview-build-release:
	npm run preview

run:
	npm run dev -- --host

update-db-schema:
	npx prisma generate
	npx prisma generate --sql

circular:
	npx ds src
