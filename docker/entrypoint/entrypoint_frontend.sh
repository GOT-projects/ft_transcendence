#!/bin/sh

if [ ${ENV} = "DEV" ]; then 
	yarn run dev
else
	yarn run build
	yarn global add serve
	serve -s build
fi
