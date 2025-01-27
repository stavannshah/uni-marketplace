package handlers

import (
	"log"
	"net/http"
	"uni-marketplace/utils"

	"github.com/gin-gonic/gin"
)

func SendOTP(c *gin.Context) {
	type Request struct {
		Email string `json:"email" binding:"required,email"`
	}

	var req Request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email address"})
		return
	}

	otp := "123456" // Generate an actual OTP here
	body := "Your OTP is: " + otp

	err := utils.SendEmail(req.Email, "Your OTP", body)
	if err != nil {
		log.Printf("Error sending OTP: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send OTP"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "OTP sent successfully"})
}
