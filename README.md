# forklift-wui

A minimal Go web UI skeleton.

- Module: `github.com/awanio/forklift-wui`
- Entry point: `cmd/forklift-wui/main.go`
- Static assets: `web/`

## Quick start

- Run locally:
  - `go run ./cmd/forklift-wui`
  - Or `make run`

- Build binary:
  - `make build` (outputs to `bin/forklift-wui`)

- Build container image:
  - `make docker-build`

## Configuration

- `ADDR` (default `:8080`) – address to bind the server
- `WEB_DIR` (default `web`) – directory to serve static files from
