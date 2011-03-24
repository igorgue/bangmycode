#!/bin/bash

if [ "$1" == "--production" ]; then
    echo "Running node in production mode."
    NODE_ENV=production node app.js
else
    echo "Running node in development mode (send --production to run in production mode)."
    NODE_ENV=development node app.js
fi
