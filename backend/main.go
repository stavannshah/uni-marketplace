// Here's a complete implementation for an email OTP verification project using Golang as the backend and ReactJS for the frontend.
// Let's divide the project into backend and frontend code.

// Backend (Golang)

// main.go
package main

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"math/big"
	"net/http"
	"net/smtp"
)

var userOTPs = make(map[string]string)

func generateOTP() string {
	otp := ""
	for i := 0; i < 6; i++ {
		num, _ := rand.Int(rand.Reader, big.NewInt(10))
		otp += fmt.Sprintf("%d", num.Int64())
	}
	return otp
}

func sendEmail(email string, otp string) error {
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"
	senderEmail := "shahstavan62@gmail.com"
	senderPassword := "$tavaN05o4"

	auth := smtp.PlainAuth("", senderEmail, senderPassword, smtpHost)

	message := []byte("Subject: OTP Verification\n\nYour OTP is: " + otp)

	return smtp.SendMail(smtpHost+":"+smtpPort, auth, senderEmail, []string{email}, message)
}

func sendOTPHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email string `json:"email"`
	}
	json.NewDecoder(r.Body).Decode(&req)

	otp := generateOTP()
	userOTPs[req.Email] = otp

	if err := sendEmail(req.Email, otp); err != nil {
		http.Error(w, "Failed to send OTP", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OTP sent successfully"))
}

func verifyOTPHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email string `json:"email"`
		OTP   string `json:"otp"`
	}
	json.NewDecoder(r.Body).Decode(&req)

	if userOTPs[req.Email] == req.OTP {
		delete(userOTPs, req.Email)
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OTP verified successfully"))
		return
	}

	http.Error(w, "Invalid OTP", http.StatusUnauthorized)
}

func main() {
	http.HandleFunc("/send-otp", sendOTPHandler)
	http.HandleFunc("/verify-otp", verifyOTPHandler)

	fmt.Println("Server is running on port 8080...")
	http.ListenAndServe(":8080", nil)
}
