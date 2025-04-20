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
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client

// Stavan - Updated the User struct to for Profile
type User struct {
	ID             primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Email          string             `json:"email" bson:"email"`
	LastLogin      time.Time          `json:"last_login" bson:"last_login"`
	Name           string             `json:"name" bson:"name"`
	PreferredEmail string             `json:"preferred_email" bson:"preferred_email,omitempty"`
	Preferences    string             `json:"preferences" bson:"preferences,omitempty"`
	Location       string             `json:"location" bson:"location,omitempty"`
}

type MarketplaceListing struct {
	UserID      string   `json:"user_id" bson:"user_id"`
	Title       string   `json:"title" bson:"title"`
	Pictures    []string `json:"pictures" bson:"pictures"`
	Description string   `json:"description" bson:"description"`
	Category    string   `json:"category" bson:"category"`
	Price       float64  `json:"price" bson:"price"`
	Condition   string   `json:"condition" bson:"condition"`
	Location    struct {
		City    string `json:"city" bson:"city"`
		State   string `json:"state" bson:"state"`
		Country string `json:"country" bson:"country"`
	} `json:"location" bson:"location"`
	DatePosted time.Time `json:"date_posted" bson:"date_posted"`
}

type CurrencyExchangeRequest struct {
	UserID       string    `json:"user_id" bson:"user_id"`
	Amount       float64   `json:"amount" bson:"amount"`
	FromCurrency string    `json:"from_currency" bson:"from_currency"`
	ToCurrency   string    `json:"to_currency" bson:"to_currency"`
	RequestDate  time.Time `json:"request_date" bson:"request_date"`
}

type SubleasingRequest struct {
	UserID      string `json:"user_id" bson:"user_id"`
	Title       string `json:"title" bson:"title"`
	Description string `json:"description" bson:"description"`
	Location    struct {
		City    string `json:"city" bson:"city"`
		State   string `json:"state" bson:"state"`
		Country string `json:"country" bson:"country"`
	} `json:"location" bson:"location"`
	Pictures []string `json:"pictures" bson:"pictures"`
	Rent     float64  `json:"rent" bson:"rent"`
	Period   struct {
		StartDate time.Time `json:"start_date" bson:"start_date"`
		EndDate   time.Time `json:"end_date" bson:"end_date"`
	} `json:"period" bson:"period"`
	DatePosted time.Time `json:"date_posted" bson:"date_posted"`
}

type UserActivities struct {
	MarketplaceListings      []MarketplaceListing      `json:"marketplace_listings"`
	CurrencyExchangeRequests []CurrencyExchangeRequest `json:"currency_exchange_requests"`
	SubleasingRequests       []SubleasingRequest       `json:"subleasing_requests"`
}

func connectToMongoDB() {
	err_0 := godotenv.Load()
	if err_0 != nil {
		log.Fatal("Error loading .env file")
	}

	username := os.Getenv("MONGODB_USERNAME")
	password := os.Getenv("MONGODB_PASSWORD")
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
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	collection := client.Database("uni_marketplace").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Define the filter and update query
	filter := bson.M{"email": user.Email}
	update := bson.M{"$set": bson.M{"last_login": user.LastLogin}}
	opts := options.Update().SetUpsert(true)

	// Perform the update
	result, err := collection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var userID interface{}
	if result.UpsertedID != nil {
		userID = result.UpsertedID // New user created
	} else {
		// Retrieve user ID for existing users
		var existingUser struct {
			ID primitive.ObjectID `bson:"_id"`
		}
		err := collection.FindOne(ctx, filter).Decode(&existingUser)
		if err != nil {
			http.Error(w, "Failed to retrieve user ID", http.StatusInternalServerError)
			return
		}
		userID = existingUser.ID
	}

	// Send the response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "User saved successfully",
		"userID":  userID,
	})
}

func getUsers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	collection := client.Database("uni_marketplace").Collection("users")

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

	response := map[string]interface{}{
		"user_count": len(users),
		"users":      users,
	}
	json.NewEncoder(w).Encode(response)
}

// Stavan 20th April - To Save User Details from User Profile
func updateUserProfile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userIDHex := vars["id"]

	objectID, err := primitive.ObjectIDFromHex(userIDHex)
	if err != nil {
		http.Error(w, "Invalid user ID format", http.StatusBadRequest)
		return
	}

	var user User
	err = json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	collection := client.Database("uni_marketplace").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": objectID}
	update := bson.M{
		"$set": bson.M{
			"name":            user.Name,
			"preferred_email": user.PreferredEmail,
			"preferences":     user.Preferences,
			"location":        user.Location,
		},
	}

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		http.Error(w, "Failed to update profile", http.StatusInternalServerError)
		return
	}

	if result.MatchedCount == 0 {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Profile updated successfully",
		"userID":  userIDHex,
	})
}

// Stavan 20th April - To Get Profile User Details for User Profile
func getUserProfile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userIDHex := vars["id"]

	objectID, err := primitive.ObjectIDFromHex(userIDHex)
	if err != nil {
		http.Error(w, "Invalid user ID format", http.StatusBadRequest)
		return
	}

	collection := client.Database("uni_marketplace").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user User
	err = collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&user)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Return only the required profile fields
	profile := map[string]string{
		"name":            user.Name,
		"email":           user.Email,
		"preferred_email": user.PreferredEmail,
		"preferences":     user.Preferences,
		"location":        user.Location,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"profile": profile,
	})
}

func postMarketplaceListing(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", origin) // Allow the specific origin making the request
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Handle preflight request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	var listing MarketplaceListing

	// Decode incoming JSON body into the MarketplaceListing struct
	err := json.NewDecoder(r.Body).Decode(&listing)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if listing.UserID == "" || listing.Title == "" || len(listing.Pictures) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Missing required fields"})
		return
	}

	// Set server-side values
	listing.DatePosted = time.Now()

	collection := client.Database("uni_marketplace").Collection("marketplace_listings")

	// Attempt to insert into MongoDB
	result, err := collection.InsertOne(context.Background(), listing)
	if err != nil {
		log.Printf("Database error: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to create listing"})
		return
	}

	// Log success and return created document with generated ID
	log.Printf("Successfully inserted document with ID: %v\n", result.InsertedID)

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(listing)
}

func getMarketplaceListings(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	collection := client.Database("uni_marketplace").Collection("marketplace_listings")

	cursor, err := collection.Find(context.TODO(), bson.M{})
	if err != nil {
		log.Fatal(err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to retrieve listings"})
		return
	}
	defer cursor.Close(context.TODO())

	var listings []MarketplaceListing
	for cursor.Next(context.TODO()) {
		var listing MarketplaceListing
		if err := cursor.Decode(&listing); err != nil {
			log.Fatal(err)
		}
		listings = append(listings, listing)
	}

	response := map[string]interface{}{
		"listing_count": len(listings),
		"listings":      listings,
	}
	json.NewEncoder(w).Encode(response)
}
func getCurrencyExchangeListings(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	collection := client.Database("uni_marketplace").Collection("currency_exchange_requests")

	cursor, err := collection.Find(context.TODO(), bson.M{})
	if err != nil {
		log.Println("Failed to retrieve currency exchange listings:", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to retrieve listings"})
		return
	}
	defer cursor.Close(context.TODO())

	var listings []CurrencyExchangeRequest
	for cursor.Next(context.TODO()) {
		var listing CurrencyExchangeRequest
		if err := cursor.Decode(&listing); err != nil {
			log.Println("Failed to decode listing:", err)
			continue
		}
		listings = append(listings, listing)
	}

	response := map[string]interface{}{
		"listing_count": len(listings),
		"listings":      listings,
	}
	json.NewEncoder(w).Encode(response)
}

func createCurrencyExchangeRequest(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var request CurrencyExchangeRequest
	json.NewDecoder(r.Body).Decode(&request)
	request.RequestDate = time.Now()

	collection := client.Database("uni_marketplace").Collection("currency_exchange_requests")
	_, err := collection.InsertOne(context.TODO(), request)
	if err != nil {
		log.Fatal(err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to create currency exchange request"})
		return
	}

	json.NewEncoder(w).Encode(request)
}

func getCurrencyExchangeRequests(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	collection := client.Database("uni_marketplace").Collection("currency_exchange_requests")

	cursor, err := collection.Find(context.TODO(), bson.M{})
	if err != nil {
		log.Fatal(err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to retrieve currency exchange requests"})
		return
	}
	defer cursor.Close(context.TODO())

	var requests []CurrencyExchangeRequest
	for cursor.Next(context.TODO()) {
		var request CurrencyExchangeRequest
		if err := cursor.Decode(&request); err != nil {
			log.Fatal(err)
		}
		requests = append(requests, request)
	}

	response := map[string]interface{}{
		"request_count": len(requests),
		"requests":      requests,
	}
	json.NewEncoder(w).Encode(response)
}

func postSubleasingRequest(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var sublease SubleasingRequest
	json.NewDecoder(r.Body).Decode(&sublease)
	sublease.DatePosted = time.Now()

	collection := client.Database("uni_marketplace").Collection("subleasing_requests")
	_, err := collection.InsertOne(context.TODO(), sublease)
	if err != nil {
		log.Fatal(err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to post subleasing request"})
		return
	}

	json.NewEncoder(w).Encode(sublease)
}

func getSubleasingRequests(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get the subleasing requests collection
	collection := client.Database("uni_marketplace").Collection("subleasing_requests")

	// Retrieve all subleasing requests
	cursor, err := collection.Find(context.TODO(), bson.M{})
	if err != nil {
		log.Fatal(err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to retrieve subleasing requests"})
		return
	}
	defer cursor.Close(context.TODO())

	var requests []bson.M
	for cursor.Next(context.TODO()) {
		var request bson.M
		if err := cursor.Decode(&request); err != nil {
			log.Fatal(err)
		}
		requests = append(requests, request)
	}

	// Response JSON
	response := map[string]interface{}{
		"request_count": len(requests),
		"requests":      requests,
	}
	json.NewEncoder(w).Encode(response)
}

func getUserActivities(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "user_id is required", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Query marketplace_listings collection
	marketplaceCollection := client.Database("uni_marketplace").Collection("marketplace_listings")
	var marketplaceListings []MarketplaceListing
	cursor, err := marketplaceCollection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if err = cursor.All(ctx, &marketplaceListings); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Query currency_exchange_requests collection
	currencyExchangeCollection := client.Database("uni_marketplace").Collection("currency_exchange_requests")
	var currencyExchangeRequests []CurrencyExchangeRequest
	cursor, err = currencyExchangeCollection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if err = cursor.All(ctx, &currencyExchangeRequests); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Query subleasing_requests collection
	subleasingCollection := client.Database("uni_marketplace").Collection("subleasing_requests")
	var subleasingRequests []SubleasingRequest
	cursor, err = subleasingCollection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if err = cursor.All(ctx, &subleasingRequests); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Aggregate results
	userActivities := UserActivities{
		MarketplaceListings:      marketplaceListings,
		CurrencyExchangeRequests: currencyExchangeRequests,
		SubleasingRequests:       subleasingRequests,
	}

	json.NewEncoder(w).Encode(userActivities)
}

func main() {
	connectToMongoDB()
	r := mux.NewRouter()

	r.HandleFunc("/api/saveUser", saveUser).Methods("POST")
	r.HandleFunc("/api/users", getUsers).Methods("GET")
	//r.HandleFunc("/api/marketplace/listing", postMarketplaceListing).Methods("POST")
	//r.HandleFunc("/api/marketplace/listings", getMarketplaceListings).Methods("GET")
	r.HandleFunc("/api/currency/exchange", createCurrencyExchangeRequest).Methods("POST")
	r.HandleFunc("/api/currency/exchange/requests", getCurrencyExchangeRequests).Methods("GET")
	r.HandleFunc("/api/subleasing", postSubleasingRequest).Methods("POST")
	r.HandleFunc("/api/subleasing/requests", getSubleasingRequests).Methods("GET")
	r.HandleFunc("/api/getMarketplaceListings", getMarketplaceListings).Methods("GET")
	r.HandleFunc("/api/postMarketplaceListing", postMarketplaceListing).Methods("POST")
	r.HandleFunc("/api/user/activities", getUserActivities).Methods("GET")
	// 3 API Added by Stavan 20th April
	r.HandleFunc("/api/getCurrencyExchangeListings", getCurrencyExchangeListings).Methods("GET")
	r.HandleFunc("/api/updateUserProfile/{id}", updateUserProfile).Methods("POST")
	r.HandleFunc("/api/getUserProfile/{id}", getUserProfile).Methods("GET")

	// Enable CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	fmt.Println("Server is running on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
