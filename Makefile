COLOR_NORM		:=	\033[0m
COLOR_RED		:=	\033[31m
COLOR_PURPLE	:=	\033[35m
cmd				:=	$(shell which docker-compose >/dev/null; RETVAL=$$?; if [ $$RETVAL -eq 0 ]; then echo 'docker-compose'; else echo 'docker compose'; fi)

all:
	${cmd} kill && ${cmd} down -v && ${cmd} up --build -d && ${cmd} logs -f nestjs web

down:
	${cmd} down -v

exec:
	docker exec -it $(wordlist 1,2,$(MAKECMDGOALS)) bash

purge:
	docker system prune -a -f --volumes

help:
	@printf "make $(COLOR_PURPLE)all$(COLOR_NORM)\n"
	@printf "\tdown if run and run compose\n"
	@printf "make $(COLOR_PURPLE)down$(COLOR_NORM)\n"
	@printf "\tdown the dockers\n"
	@printf "make $(COLOR_PURPLE)exec $(COLOR_RED)name$(COLOR_NORM)\n"
	@printf "\ttake one argument (name of the docker) and go in\n"
	@printf "make $(COLOR_PURPLE)purge$(COLOR_NORM)\n"
	@printf "\tdelete all images, volumes\n"
	@printf "make $(COLOR_PURPLE)help$(COLOR_NORM)\n"
	@printf "\tdisplay help\n"
