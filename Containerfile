# syntax=docker/dockerfile:1

# Build stage
FROM golang:1.22-alpine AS build
WORKDIR /app

# Helpful tools
RUN apk add --no-cache ca-certificates git

# Module files first for better caching
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download || true

# App source
COPY . .

# Build static binary
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /out/forklift-wui ./cmd/forklift-wui

# Runtime stage
FROM gcr.io/distroless/static-debian12
WORKDIR /app
COPY --from=build /out/forklift-wui /app/forklift-wui
COPY web /app/web
EXPOSE 8080
ENV ADDR=:8080
ENV WEB_DIR=/app/web
USER 65532:65532
ENTRYPOINT ["/app/forklift-wui"]
