FROM node:latest

WORKDIR /usr/src/app

COPY --chown=node:node package.json		./
COPY --chown=node:node tsconfig.json	./

RUN yarn install

VOLUME [ "/usr/src/app/src" ]
VOLUME [ "/usr/src/app/public" ]

EXPOSE 80

CMD npm start
