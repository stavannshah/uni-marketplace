package utils

import (
	"math/rand"
	"strconv"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

const apiKey = ""

func GenerateOTP() string {
	return strconv.Itoa(100000 + rand.Intn(900000)) // Generate 6-digit OTP
}

func SendEmail(to string, otp string) error {
	from := mail.NewEmail("Your App", "noreply@yourapp.com")
	subject := "Your OTP Code"
	toEmail := mail.NewEmail("User", to)
	plainTextContent := "Your OTP is: " + otp
	htmlContent := "<strong>Your OTP is: " + otp + "</strong>"
	message := mail.NewSingleEmail(from, subject, toEmail, plainTextContent, htmlContent)
	client := sendgrid.NewSendClient(apiKey)
	_, err := client.Send(message)
	return err
}
