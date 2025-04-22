# UniMarketplace 🧑‍🎓🛒

## University Student Marketplace

### 🔒 A Secure Campus-Only Platform  
**UniMarketplace** is a modern full-stack web application built using **ReactJS** and **Golang**, connected to **MongoDB Atlas**, enabling university students to:
- Buy & Sell items
- Exchange currency
- List and manage subleases

Every user logs in securely using their **@ufl.edu email** via OTP-based authentication (EmailJS). The app auto-generates a unique user ID on first login — no profile setup required!

---

## 🔧 Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | ReactJS + Material UI         |
| Backend    | Go (Golang) + Gorilla Mux     |
| Database   | MongoDB Atlas                 |
| Email Auth | EmailJS                       |
| Testing    | Cypress (UI) + Postman (API)  |

---

## 👨‍💻 Contributors

| Role              | Name                     |
|-------------------|--------------------------|
| Frontend Engineers| Stavan Shah, Priyanshu Mathur |
| Backend Engineers | Ahmed Ali, Vedant Upganlawar |

---

## 💡 Core Features

### 1. 🔐 OTP Login with Auto-ID
- Uses EmailJS to send a 6-digit OTP to **@ufl.edu** emails
- Auto-registers user with ID and login timestamp

### 2. 🏠 Personalized Homepage
- Displays **user-specific** active listings:
  - Items
  - Currency exchanges
  - Subleases
- Offers in-place **Edit**, **Delete**, or **Mark as Sold** functionality

### 3. 🛒 Item Listing Module
- Add listings with:
  - Title, price, condition, category
  - Up to 3 image URLs
  - Location (City, State, Country)
- View all posted items in card view

### 4. 💱 Currency Exchange Listings
- Add conversion requests with:
  - From/To currencies
  - Amount
- View and manage all your currency requests

### 5. 🏠 Subleasing Management
- List rental properties with:
  - Title, rent, description
  - Location and lease period
  - Multiple images
- View all subleases posted by users

### 6. ❓ FAQs
- Integrated **accordion-based FAQs** explaining:
  - How to list items/subleases
  - Currency exchange flow
  - Edit/delete rules

### 7. 👤 Profile (Optional)
- Users can update:
  - Name, Preferred Email, Preferences, Location
- Auto-filled from MongoDB on login

### 8. 🚪 Logout
- Logout button clears session and redirects to login

---

## 🧪 Testing & Reliability

| Tool     | Purpose                     |
|----------|-----------------------------|
| Cypress  | Full E2E frontend testing    |
| Postman  | API collection for backend   |

All major actions (create, edit, delete, login, logout) are covered with test scripts.

---

## 📸 Screenshot

![UniMarketplace Homepage Screenshot](./homepage.png)

---

## 🚀 How to Run the Project

### Frontend (Reactjs)

```bash
# Step into the backend directory (if applicable)
cd frontend/

npm install
npm run dev

### Backend (Golang)

```bash
# Step into the backend directory (if applicable)
cd backend/

# Set up .env with:
# MONGODB_USERNAME, MONGODB_PASSWORD
go run main.go
