package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	addr := getenv("ADDR", ":8080")
	webDir := getenv("WEB_DIR", "web")

	// Static file server with SPA fallback
	hs := http.FileServer(http.Dir(webDir))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		p := filepath.Join(webDir, r.URL.Path)
		if info, err := os.Stat(p); err == nil && !info.IsDir() {
			hs.ServeHTTP(w, r)
			return
		}
		// Fallback to index.html for client-side routes
		http.ServeFile(w, r, filepath.Join(webDir, "index.html"))
	})

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
