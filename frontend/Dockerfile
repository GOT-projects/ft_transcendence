FROM node:latest

WORKDIR /usr/src/app

COPY --chown=node:node package.json		./
COPY --chown=node:node tsconfig.json	./
COPY --chown=node:node .env				./

RUN npm i

VOLUME [ "/usr/src/app/src" ]
VOLUME [ "/usr/src/app/public" ]

EXPOSE 80

CMD npm start
