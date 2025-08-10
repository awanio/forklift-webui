package main

import (
	"log"
	"net/http"
	"os"
)

func main() {
	addr := getenv("ADDR", ":8080")
	webDir := getenv("WEB_DIR", "web")

	fs := http.FileServer(http.Dir(webDir))
	http.Handle("/", fs)

	log.Printf("Serving %s on %s\n", webDir, addr)
	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatal(err)
	}
}

func getenv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
