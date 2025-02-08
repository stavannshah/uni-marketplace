package main

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client

type User struct {
	Email     string    `json:"email" bson:"email"`
	LastLogin time.Time `json:"last_login" bson:"last_login"`
}

func connectToMongoDB() {
	// Load environment variables from .env file
	err_0 := godotenv.Load()
	if err_0 != nil {
		log.Fatal("Error loading .env file")
	}

	// Get MongoDB credentials from environment variables
	username := os.Getenv("MONGODB_USERNAME")
	password := os.Getenv("MONGODB_PASSWORD")

	//mongodb+srv://stavanshah13:<db_password>@unimarketplace.j4fsn.mongodb.net/?retryWrites=true&w=majority&appName=unimarketplace
	// Construct the connection string
	connectionString := fmt.Sprintf("mongodb+srv://%s:%s@unimarketplace.j4fsn.mongodb.net/?retryWrites=true&w=majority&appName=unimarketplace", username, password)
	clientOptions := options.Client().ApplyURI(connectionString).SetTLSConfig(&tls.Config{})
	var err error
	client, err = mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Connected to MongoDB!")
}

func saveUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user User
	json.NewDecoder(r.Body).Decode(&user)
	user.LastLogin = time.Now()

	collection := client.Database("uni_marketplace").Collection("users")
	_, err := collection.InsertOne(context.TODO(), user)
	if err != nil {
		log.Fatal(err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to save user"})
		return
	}

	json.NewEncoder(w).Encode(user)
}

func getUsers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	collection := client.Database("uni_marketplace").Collection("users")

	// Retrieve all users
	cursor, err := collection.Find(context.TODO(), bson.M{})
	if err != nil {
		log.Fatal(err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to retrieve users"})
		return
	}
	defer cursor.Close(context.TODO())

	var users []User
	for cursor.Next(context.TODO()) {
		var user User
		if err := cursor.Decode(&user); err != nil {
			log.Fatal(err)
		}
		users = append(users, user)
	}

	// Response JSON
	response := map[string]interface{}{
		"user_count": len(users),
		"users":      users,
	}
	json.NewEncoder(w).Encode(response)
}

func main() {
	connectToMongoDB()
	r := mux.NewRouter()

	r.HandleFunc("/api/saveUser", saveUser).Methods("POST")
	r.HandleFunc("/api/users", getUsers).Methods("GET")

	// Enable CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // Allow frontend origin
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	fmt.Println("Server is running on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
