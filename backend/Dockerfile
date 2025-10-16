# Stage 1: Builder
FROM rust:1.86 as builder

RUN apt-get update && apt-get install -y build-essential pkg-config libssl-dev
WORKDIR /app

# Dependency caching
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}">src/main.rs
RUN cargo fetch && cargo build --release||true

# Build real application
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim

WORKDIR /app
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/backend .
EXPOSE 8080
CMD ["./backend"]
