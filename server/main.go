package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"strings"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

var (
	svcAccountFile string
	port           int
)

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func main() {
	flag.StringVar(&svcAccountFile, "svcAccountFile", "firebase-admin.json", "path to service account key file")
	flag.IntVar(&port, "port", 8080, "port to listen on")
	flag.Parse()

	app, err := firebase.NewApp(
		context.Background(),
		nil,
		option.WithCredentialsFile(svcAccountFile),
	)
	if err != nil {
		log.Fatalf("error initializing app: %v", err)
	}

	ac, err := app.Auth(context.Background())
	if err != nil {
		log.Fatalf("error getting Auth client: %v\n", err)
	}

	http.HandleFunc("/private", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet && r.Method != http.MethodOptions {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		w.Header().Set("Access-Control-Allow-Methods", http.MethodGet)
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")

		// Preflight request.
		if r.Method != http.MethodGet {
			return
		}

		idToken := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")

		token, err := ac.VerifyIDToken(r.Context(), idToken)
		if err != nil {
			log.Printf("error verifying ID token: %v\n", err)
			http.Error(w, "invalid token", http.StatusForbidden)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode("verified as user " + token.UID)
	})

	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost && r.Method != http.MethodOptions {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		w.Header().Set("Access-Control-Allow-Methods", http.MethodPost)
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")

		// Preflight request.
		if r.Method != http.MethodPost {
			return
		}

		var req loginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid request", http.StatusBadRequest)
			return
		}

		// Stupid authentication, but it's just an example.
		if req.Email != "foo@bar.com" || req.Password != "password" {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}

		// Hardcoded UID for the sake of the example.
		uid := "4341d6da-0671-49ce-a882-c431d4466654"

		token, err := ac.CustomToken(r.Context(), uid)
		if err != nil {
			http.Error(w, "error minting custom token", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(token)
	})

	log.Printf("Starting server on :%d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}
