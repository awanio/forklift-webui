# forklift-wui

A minimal Go web UI skeleton.

- Module: `github.com/awanio/forklift-wui`
- Entry point: `cmd/forklift-wui/main.go`
- Static assets: `web/`

## Quick start

Backend (Go):
- Run locally:
  - `go run ./cmd/forklift-wui`
  - Or `make run`

- Build binary:
  - `make build` (outputs to `bin/forklift-wui`)

- Build container image:
  - `make docker-build`

Frontend (Vite + Tailwind + Lit):
- From `web/`:
  - Install deps: `npm install`
  - Dev server: `npm run dev`
  - Build: `npm run build` (outputs to `web/dist/`)

To serve the built frontend with Go, either:
- Copy `web/dist/*` into `web/` (replacing dev source) or
- Change `WEB_DIR` env to `web/dist` when running the Go server.

## Configuration

- `ADDR` (default `:8080`) – address to bind the server
- `WEB_DIR` (default `web`) – directory to serve static files from
