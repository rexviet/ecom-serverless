#!/bin/bash
set -e

cd src/dependencies/nodejs
rm -rf node_modules
npm install --only=prod
cd ../../..
pwd

cd src/pdf-layer/nodejs
rm -rf node_modules
npm install
cd ../../..