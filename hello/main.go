package main

import (
	"encoding/json"
	"net/http"
)

// User struct
type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

// Get User Handler
func getUser(w http.ResponseWriter, r *http.Request) {
	user := User{ID: 1, Name: "John Doe"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func main() {
	http.HandleFunc("/user", getUser) // Route
	http.ListenAndServe(":8080", nil) // Start server on port 8080
}
