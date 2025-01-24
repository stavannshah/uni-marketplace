package handlers

import (
	"net/http"
	"uni-marketplace/utils"

	"github.com/gin-gonic/gin"
)

var otpStore = make(map[string]string) // email -> OTP

func SendOTP(c *gin.Context) {
	email := c.PostForm("email")
	otp := utils.GenerateOTP()
	otpStore[email] = otp
	if err := utils.SendEmail(email, otp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to send OTP"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "OTP sent successfully"})
}

func VerifyOTP(c *gin.Context) {
	email := c.PostForm("email")
	otp := c.PostForm("otp")
	if otpStore[email] == otp {
		delete(otpStore, email) // Clear OTP after verification
		c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid OTP"})
	}
}
