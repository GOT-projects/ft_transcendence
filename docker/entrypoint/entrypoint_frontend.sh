#!/bin/sh


if [ ${ENV} = "DEV" ]; then 
	exec yarn run dev
else
	yarn run build
	yarn global add -g serve
	exec serve -s build
fi
