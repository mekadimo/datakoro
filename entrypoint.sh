#!/bin/bash

set -e

if [ "$RUN_SERVER" = "true" ]; then
    npm run dev -- --host
else
    exec sleep infinity
fi
