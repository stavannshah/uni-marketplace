package utils

import (
	"log"
	"os"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

// SendEmail sends an email using SendGrid
func SendEmail(toEmail, subject, body string) error {
	from := mail.NewEmail("Uni Marketplace", "noreply@yourdomain.com")
	to := mail.NewEmail("User", toEmail)
	message := mail.NewSingleEmail(from, subject, to, body, body)
	client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))

	response, err := client.Send(message)
	if err != nil {
		log.Printf("Failed to send email: %v\n", err)
		return err
	}

	if response.StatusCode >= 200 && response.StatusCode < 300 {
		log.Printf("Email sent successfully: %s\n", response.Body)
		return nil
	} else {
		log.Printf("Failed to send email. Status Code: %d, Body: %s\n", response.StatusCode, response.Body)
		return err
	}
}
