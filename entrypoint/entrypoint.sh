#!/bin/sh

npm run build
npm install -g serve
serve -s build
