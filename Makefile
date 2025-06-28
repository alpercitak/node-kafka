clean:
	find . -type d \( -name node_modules -o -name dist -o -name .turbo \) -exec rm -rf {} +

prepare:
	pnpm i
	turbo build

dev: clean prepare
	pnpm run dev

removeDocker:
	docker compose down -v

deployDocker: removeDocker
	docker compose up --build