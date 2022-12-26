#!/bin/sh

if [ ${ENV} = "DEV" ]; then 
	yarn run start:dev
else
	yarn run build
	node dist/src/main
fi
