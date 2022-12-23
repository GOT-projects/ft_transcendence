cmd := $(shell which docker-compose >/dev/null; RETVAL=$$?; if [ $$RETVAL -eq 0 ]; then echo 'docker-compose'; else echo 'docker compose'; fi)

all:
	${cmd} kill && ${cmd} down -v && ${cmd} up --build -d && ${cmd} logs -f nestjs web

down:
	${cmd} down -v
