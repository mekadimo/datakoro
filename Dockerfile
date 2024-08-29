FROM node:22.6-bookworm AS builder

WORKDIR /app

RUN apt -y update \
    && apt upgrade -y \
    && apt install -y make bash bash-completion openssl sass \
    && apt-get -y autoremove --purge \
    && apt -y clean \
    && rm -rf /var/lib/apt/lists/*
