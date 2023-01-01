COLOR_NORM		:=	\033[0m
COLOR_RED		:=	\033[31m
COLOR_PURPLE	:=	\033[35m
cmd				:=	$(shell which docker-compose >/dev/null; RETVAL=$$?; if [ $$RETVAL -eq 0 ]; then echo 'docker-compose'; else echo 'docker compose'; fi)

all: down up
#	${cmd} logs -f nestjs web

dev: down
	sed -i -e 's/ENV=PROD/ENV=DEV/g' .env && rm -f .env-e
	${cmd} up --build -d
	${cmd} logs -f nestjs web

log:
	${cmd} logs -f nestjs web

up:
	sed -i -e 's/ENV=DEV/ENV=PROD/g' .env && rm -f .env-e
	${cmd} up --build -d

down:
	${cmd} kill && ${cmd} down -v

exec:
	docker exec -it $(wordlist 1,2,$(MAKECMDGOALS)) bash

purge: down
	docker builder prune --all
	#docker system prune -a -f --volumes

help:
	@printf "make $(COLOR_PURPLE)all$(COLOR_NORM)\n"
	@printf "\tdown, up dockers and show logs of nest and react in Prod\n"
	@printf "make $(COLOR_PURPLE)dev$(COLOR_NORM)\n"
	@printf "\tdown, up dockers and show logs of nest and react in Dev\n"
	@printf "make $(COLOR_PURPLE)up$(COLOR_NORM)\n"
	@printf "\tup dockers\n"
	@printf "make $(COLOR_PURPLE)down$(COLOR_NORM)\n"
	@printf "\tdown dockers\n"
	@printf "make $(COLOR_PURPLE)exec $(COLOR_RED)name$(COLOR_NORM)\n"
	@printf "\ttake one argument (name of the docker) and go in\n"
	@printf "make $(COLOR_PURPLE)purge$(COLOR_NORM)\n"
	@printf "\tdelete all images, volumes\n"
	@printf "make $(COLOR_PURPLE)help$(COLOR_NORM)\n"
	@printf "\tdisplay help\n"
