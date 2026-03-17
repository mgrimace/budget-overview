# Stage 1: Build backend
FROM rust:1.94-slim AS backend-builder
WORKDIR /build
COPY backend/Cargo.toml backend/Cargo.lock* ./
RUN mkdir src && echo 'fn main(){}' > src/main.rs && cargo build --release 2>/dev/null || true && rm -rf src
COPY backend/src ./src
RUN touch src/main.rs && cargo build --release

# Stage 2: Build frontend
FROM node:22-slim AS frontend-builder
WORKDIR /build
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 3: Runtime
FROM debian:trixie-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
RUN mkdir -p /app/data
COPY --from=backend-builder /build/target/release/budget-overview-backend .
COPY --from=frontend-builder /build/dist ./static
ENV DATABASE_PATH=/app/data/budget.db
ENV STATIC_DIR=/app/static
ENV PORT=3001
EXPOSE 3001
CMD ["./budget-overview-backend"]