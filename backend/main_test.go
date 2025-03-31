package main

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gorilla/mux"
	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// MockHandlers to use MongoDB client passed as argument instead of global client
func mockSaveUser(testClient *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		var user User
		json.NewDecoder(r.Body).Decode(&user)
		user.LastLogin = time.Now()

		collection := testClient.Database("uni_marketplace_test").Collection("users")
		_, err := collection.InsertOne(context.Background(), user)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Failed to save user"})
			return
		}

		json.NewEncoder(w).Encode(user)
	}
}

func mockGetUsers(testClient *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		collection := testClient.Database("uni_marketplace_test").Collection("users")

		cursor, err := collection.Find(context.Background(), bson.M{})
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Failed to retrieve users"})
			return
		}
		defer cursor.Close(context.Background())

		var users []User
		for cursor.Next(context.Background()) {
			var user User
			if err := cursor.Decode(&user); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			users = append(users, user)
		}

		response := map[string]interface{}{
			"user_count": len(users),
			"users":      users,
		}
		json.NewEncoder(w).Encode(response)
	}
}

func mockPostMarketplaceListing(testClient *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		var listing MarketplaceListing
		json.NewDecoder(r.Body).Decode(&listing)
		listing.DatePosted = time.Now()

		collection := testClient.Database("uni_marketplace_test").Collection("marketplace_listings")
		_, err := collection.InsertOne(context.Background(), listing)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Failed to post listing"})
			return
		}

		json.NewEncoder(w).Encode(listing)
	}
}

func mockGetMarketplaceListings(testClient *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		collection := testClient.Database("uni_marketplace_test").Collection("marketplace_listings")

		cursor, err := collection.Find(context.Background(), bson.M{})
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Failed to retrieve listings"})
			return
		}
		defer cursor.Close(context.Background())

		var listings []MarketplaceListing
		for cursor.Next(context.Background()) {
			var listing MarketplaceListing
			if err := cursor.Decode(&listing); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			listings = append(listings, listing)
		}

		response := map[string]interface{}{
			"listing_count": len(listings),
			"listings":      listings,
		}
		json.NewEncoder(w).Encode(response)
	}
}

func mockCreateCurrencyExchangeRequest(testClient *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		var request CurrencyExchangeRequest
		json.NewDecoder(r.Body).Decode(&request)
		request.RequestDate = time.Now()

		collection := testClient.Database("uni_marketplace_test").Collection("currency_exchange_requests")
		_, err := collection.InsertOne(context.Background(), request)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Failed to create currency exchange request"})
			return
		}

		json.NewEncoder(w).Encode(request)
	}
}

func mockGetCurrencyExchangeRequests(testClient *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		collection := testClient.Database("uni_marketplace_test").Collection("currency_exchange_requests")
		cursor, err := collection.Find(context.Background(), bson.M{})
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Failed to retrieve currency exchange requests"})
			return
		}
		defer cursor.Close(context.Background())

		var requests []CurrencyExchangeRequest
		for cursor.Next(context.Background()) {
			var request CurrencyExchangeRequest
			if err := cursor.Decode(&request); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": "Failed to decode request"})
				return
			}
			requests = append(requests, request)
		}

		response := map[string]interface{}{
			"request_count": len(requests),
			"requests":      requests,
		}
		json.NewEncoder(w).Encode(response)
	}
}

func mockPostSubleasingRequest(testClient *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		var sublease SubleasingRequest
		json.NewDecoder(r.Body).Decode(&sublease)
		sublease.DatePosted = time.Now()

		collection := testClient.Database("uni_marketplace_test").Collection("subleasing_requests")
		_, err := collection.InsertOne(context.Background(), sublease)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Failed to post subleasing request"})
			return
		}

		json.NewEncoder(w).Encode(sublease)
	}
}

func TestSaveUser(t *testing.T) {
	// Set up a test MongoDB client
	testClient, err := mongo.Connect(context.Background(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		t.Fatalf("Failed to connect to test MongoDB: %v", err)
	}
	defer testClient.Disconnect(context.Background())

	tests := []struct {
		description  string
		route        string
		expectedCode int
		reqBody      string
	}{
		{
			description:  "POST status 200",
			route:        "/api/saveUser",
			expectedCode: 200,
			reqBody:      `{"email": "testuser@example.com", "name": "Test User"}`,
		},
	}

	for _, test := range tests {
		req := httptest.NewRequest("POST", test.route, bytes.NewReader([]byte(test.reqBody)))
		req.Header.Add("Content-Type", "application/json")

		// Setting up a test server with mock handler
		rr := httptest.NewRecorder()
		r := mux.NewRouter()
		r.HandleFunc("/api/saveUser", mockSaveUser(testClient)).Methods("POST")
		r.ServeHTTP(rr, req)

		// Asserting the status code
		assert.Equal(t, test.expectedCode, rr.Code, test.description)
	}
}

func TestGetUsers(t *testing.T) {
	// Set up a test MongoDB client
	testClient, err := mongo.Connect(context.Background(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		t.Fatalf("Failed to connect to test MongoDB: %v", err)
	}
	defer testClient.Disconnect(context.Background())

	// Insert test data
	collection := testClient.Database("uni_marketplace_test").Collection("users")
	user := User{Email: "testuser@example.com", Name: "Test User", LastLogin: time.Now()}
	_, err = collection.InsertOne(context.Background(), user)
	if err != nil {
		t.Fatalf("Failed to insert mock user data: %v", err)
	}

	tests := []struct {
		description  string
		route        string
		expectedCode int
	}{
		{
			description:  "GET status 200",
			route:        "/api/users",
			expectedCode: 200,
		},
	}

	for _, test := range tests {
		req := httptest.NewRequest("GET", test.route, nil)
		rr := httptest.NewRecorder()
		r := mux.NewRouter()
		r.HandleFunc("/api/users", mockGetUsers(testClient)).Methods("GET")
		r.ServeHTTP(rr, req)

		// Asserting the status code
		assert.Equal(t, test.expectedCode, rr.Code, test.description)
	}
}

func TestPostMarketplaceListing(t *testing.T) {
	// Set up a test MongoDB client
	testClient, err := mongo.Connect(context.Background(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		t.Fatalf("Failed to connect to test MongoDB: %v", err)
	}
	defer testClient.Disconnect(context.Background())

	tests := []struct {
		description  string
		route        string
		expectedCode int
		reqBody      string
	}{
		{
			description:  "POST status 200",
			route:        "/api/marketplace/listing",
			expectedCode: 200,
			reqBody:      `{"user_id": "12345", "title": "Laptop for Sale", "pictures": ["img1.jpg", "img2.jpg"], "description": "Good condition laptop", "category": "Electronics", "price": 300.00, "condition": "Used", "location": {"city": "Gainesville", "state": "FL", "country": "USA"}}`,
		},
	}

	for _, test := range tests {
		req := httptest.NewRequest("POST", test.route, bytes.NewReader([]byte(test.reqBody)))
		req.Header.Add("Content-Type", "application/json")

		// Setting up the test server
		rr := httptest.NewRecorder()
		r := mux.NewRouter()
		r.HandleFunc("/api/marketplace/listing", mockPostMarketplaceListing(testClient)).Methods("POST")
		r.ServeHTTP(rr, req)

		// Asserting the status code
		assert.Equal(t, test.expectedCode, rr.Code, test.description)
	}
}

func TestGetMarketplaceListings(t *testing.T) {
	// Set up a test MongoDB client
	testClient, err := mongo.Connect(context.Background(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		t.Fatalf("Failed to connect to test MongoDB: %v", err)
	}
	defer testClient.Disconnect(context.Background())

	// Insert test data
	collection := testClient.Database("uni_marketplace_test").Collection("marketplace_listings")
	listing := MarketplaceListing{
		UserID:      "12345",
		Title:       "Laptop for Sale",
		Pictures:    []string{"img1.jpg", "img2.jpg"},
		Description: "Good condition laptop",
		Category:    "Electronics",
		Price:       300.00,
		Condition:   "Used",
		Location: struct {
			City    string `json:"city" bson:"city"`
			State   string `json:"state" bson:"state"`
			Country string `json:"country" bson:"country"`
		}{
			City:    "Gainesville",
			State:   "FL",
			Country: "USA",
		},
		DatePosted: time.Now(),
	}
	_, err = collection.InsertOne(context.Background(), listing)
	if err != nil {
		t.Fatalf("Failed to insert mock listing data: %v", err)
	}

	tests := []struct {
		description  string
		route        string
		expectedCode int
	}{
		{
			description:  "GET status 200",
			route:        "/api/marketplace/listings",
			expectedCode: 200,
		},
	}

	for _, test := range tests {
		req := httptest.NewRequest("GET", test.route, nil)
		rr := httptest.NewRecorder()
		r := mux.NewRouter()
		r.HandleFunc("/api/marketplace/listings", mockGetMarketplaceListings(testClient)).Methods("GET")
		r.ServeHTTP(rr, req)

		// Asserting the status code
		assert.Equal(t, test.expectedCode, rr.Code, test.description)
	}
}

func TestCreateCurrencyExchangeRequest(t *testing.T) {
	// Set up a test MongoDB client
	testClient, err := mongo.Connect(context.Background(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		t.Fatalf("Failed to connect to test MongoDB: %v", err)
	}
	defer testClient.Disconnect(context.Background())

	tests := []struct {
		description  string
		route        string
		expectedCode int
		reqBody      string
	}{
		{
			description:  "POST status 200",
			route:        "/api/currency/exchange",
			expectedCode: 200,
			reqBody:      `{"user_id": "12345", "amount": 100, "from_currency": "USD", "to_currency": "EUR"}`,
		},
	}

	for _, test := range tests {
		req := httptest.NewRequest("POST", test.route, bytes.NewReader([]byte(test.reqBody)))
		req.Header.Add("Content-Type", "application/json")

		// Setting up the test server
		rr := httptest.NewRecorder()
		r := mux.NewRouter()
		r.HandleFunc("/api/currency/exchange", mockCreateCurrencyExchangeRequest(testClient)).Methods("POST")
		r.ServeHTTP(rr, req)

		// Asserting the status code
		assert.Equal(t, test.expectedCode, rr.Code, test.description)
	}
}

func TestPostSubleasingRequest(t *testing.T) {
	// Set up a test MongoDB client
	testClient, err := mongo.Connect(context.Background(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		t.Fatalf("Failed to connect to test MongoDB: %v", err)
	}
	defer testClient.Disconnect(context.Background())

	tests := []struct {
		description  string
		route        string
		expectedCode int
		reqBody      string
	}{
		{
			description:  "POST status 200",
			route:        "/api/subleasing",
			expectedCode: 200,
			reqBody:      `{"user_id": "12345", "title": "Room for Rent", "description": "Spacious room in a shared apartment", "location": {"city": "Gainesville", "state": "FL", "country": "USA"}, "pictures": ["img1.jpg"], "rent": 500, "period": {"start_date": "2025-04-01", "end_date": "2025-08-01"}}`,
		},
	}

	for _, test := range tests {
		req := httptest.NewRequest("POST", test.route, bytes.NewReader([]byte(test.reqBody)))
		req.Header.Add("Content-Type", "application/json")

		// Setting up the test server
		rr := httptest.NewRecorder()
		r := mux.NewRouter()
		r.HandleFunc("/api/subleasing", mockPostSubleasingRequest(testClient)).Methods("POST") // Fixed function reference
		r.ServeHTTP(rr, req)

		// Asserting the status code
		assert.Equal(t, test.expectedCode, rr.Code, test.description)
	}
}

func TestGetCurrencyExchangeRequests(t *testing.T) {
	// Set up a test MongoDB client
	testClient, err := mongo.Connect(context.Background(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		t.Fatalf("Failed to connect to test MongoDB: %v", err)
	}
	defer testClient.Disconnect(context.Background())

	// Insert test data
	collection := testClient.Database("uni_marketplace").Collection("currency_exchange_requests")
	collection.InsertMany(context.Background(), []interface{}{
		bson.M{"user_id": "12345", "amount": 100, "from_currency": "USD", "to_currency": "EUR", "request_date": time.Now()},
		bson.M{"user_id": "67890", "amount": 200, "from_currency": "GBP", "to_currency": "USD", "request_date": time.Now()},
	})

	tests := []struct {
		description  string
		route        string
		expectedCode int
	}{
		{
			description:  "GET status 200 with data",
			route:        "/api/currency/exchange",
			expectedCode: 200,
		},
	}

	for _, test := range tests {
		req := httptest.NewRequest("GET", test.route, nil)
		req.Header.Add("Content-Type", "application/json")

		// Setting up the test server
		rr := httptest.NewRecorder()
		r := mux.NewRouter()
		r.HandleFunc("/api/currency/exchange", mockGetCurrencyExchangeRequests(testClient)).Methods("GET")
		r.ServeHTTP(rr, req)

		// Asserting the status code
		assert.Equal(t, test.expectedCode, rr.Code, test.description)

		// Check if response contains expected data
		var response map[string]interface{}
		err := json.Unmarshal(rr.Body.Bytes(), &response)
		assert.Nil(t, err, "Failed to parse response")
		assert.GreaterOrEqual(t, int(response["request_count"].(float64)), 2, "Expected at least 2 exchange requests")
	}
}

func mockGetUserActivities(testClient *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		userID := r.URL.Query().Get("user_id")
		if userID == "" {
			http.Error(w, "user_id is required", http.StatusBadRequest)
			return
		}

		ctx := context.Background()

		// Query marketplace_listings
		marketplaceCollection := testClient.Database("uni_marketplace_test").Collection("marketplace_listings")
		var marketplaceListings []MarketplaceListing
		cursor, err := marketplaceCollection.Find(ctx, bson.M{"user_id": userID})
		if err == nil {
			cursor.All(ctx, &marketplaceListings)
		}

		// Query currency_exchange_requests
		currencyExchangeCollection := testClient.Database("uni_marketplace_test").Collection("currency_exchange_requests")
		var currencyExchangeRequests []CurrencyExchangeRequest
		cursor, err = currencyExchangeCollection.Find(ctx, bson.M{"user_id": userID})
		if err == nil {
			cursor.All(ctx, &currencyExchangeRequests)
		}

		// Query subleasing_requests
		subleasingCollection := testClient.Database("uni_marketplace_test").Collection("subleasing_requests")
		var subleasingRequests []SubleasingRequest
		cursor, err = subleasingCollection.Find(ctx, bson.M{"user_id": userID})
		if err == nil {
			cursor.All(ctx, &subleasingRequests)
		}

		// Aggregate results
		userActivities := UserActivities{
			MarketplaceListings:      marketplaceListings,
			CurrencyExchangeRequests: currencyExchangeRequests,
			SubleasingRequests:       subleasingRequests,
		}

		json.NewEncoder(w).Encode(userActivities)
	}
}

func TestGetUserActivities(t *testing.T) {
	testClient, err := mongo.Connect(context.Background(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		t.Fatalf("Failed to connect to test MongoDB: %v", err)
	}
	defer testClient.Disconnect(context.Background())

	userID := "12345"
	collection := testClient.Database("uni_marketplace_test").Collection("marketplace_listings")
	collection.InsertOne(context.Background(), MarketplaceListing{
		UserID:      userID,
		Title:       "Bike for Sale",
		Description: "Good condition",
		Category:    "Vehicles",
		Price:       150.00,
		Condition:   "Used",
		DatePosted:  time.Now(),
	})

	req := httptest.NewRequest("GET", "/api/user/activities?user_id="+userID, nil)
	rr := httptest.NewRecorder()
	r := mux.NewRouter()
	r.HandleFunc("/api/user/activities", mockGetUserActivities(testClient)).Methods("GET")
	r.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
}
