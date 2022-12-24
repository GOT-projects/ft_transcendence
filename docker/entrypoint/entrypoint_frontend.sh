#!/bin/sh


if [ ${ENV} = "DEV" ]; then 
	exec yarn run dev
else
	npm run build
	npm install -g serve
	exec serve -s build
fi
