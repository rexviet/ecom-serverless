#!/bin/bash
# set -e
rm -rf ./dist && npx tsc -p .
mkdir -p ./dist/dependencies && cp -r ./src/dependencies/ ./dist/dependencies/. 
