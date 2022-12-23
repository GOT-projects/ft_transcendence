#!/bin/sh

if [ ${ENV} = "DEV" ]; then 
    exec npm run start:dev
else
    npm run build
    exec node dist/src/main
fi
