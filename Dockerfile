FROM rust:bookworm

ENV PATH="/root/.cargo/bin:${PATH}"
RUN rustup default nightly
RUN cargo install cargo-leptos
RUN rustup target add wasm32-unknown-unknown
RUN cargo install diesel_cli --no-default-features --features postgres

WORKDIR /datakoro

COPY . /datakoro

RUN rm -Rf target

RUN cargo leptos build
#RUN cargo leptos build --release

ENV CARGO_NET_GIT_FETCH_WITH_CLI=true

# TODO: Load from .env
ENV DATABASE_URL=postgres://datakoro:datakoropassword@datakoro_master/datakoro

CMD ["cargo", "leptos", "watch"]
