FROM node:22.6-bookworm AS builder

WORKDIR /app

RUN apt -y update \
    && apt upgrade -y \
    && apt install -y bash bash-completion make openssl sass \
    && wget https://raw.githubusercontent.com/scop/bash-completion/1.x/completions/make -O /etc/bash_completion.d/make \
    && apt-get -y autoremove --purge \
    && apt -y clean \
    && rm -rf /var/lib/apt/lists/*
