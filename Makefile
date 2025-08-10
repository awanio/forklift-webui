BINARY_NAME := forklift-wui
CMD_PKG := ./cmd/$(BINARY_NAME)
BIN_DIR := ./bin

.PHONY: all build run clean test tidy fmt lint docker-build

all: build

build:
	mkdir -p $(BIN_DIR)
	go build -o $(BIN_DIR)/$(BINARY_NAME) $(CMD_PKG)

run:
	go run $(CMD_PKG)

clean:
	rm -rf $(BIN_DIR)

go-clean:
	go clean -modcache

test:
	go test ./...

tidy:
	go mod tidy

fmt:
	gofmt -s -w .

lint:
	@if command -v golangci-lint >/dev/null 2>&1; then golangci-lint run; else echo "golangci-lint not installed, skipping"; fi

docker-build:
	docker build -t $(BINARY_NAME):dev -f Containerfile .
