#!/bin/sh

yarn build
yarn global add serve
serve -s start
