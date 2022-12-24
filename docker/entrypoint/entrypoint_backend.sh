#!/bin/sh

if [ ${ENV} = "DEV" ]; then 
	exec yarn run start:dev
else
	yarn run build
	exec node dist/src/main
fi
