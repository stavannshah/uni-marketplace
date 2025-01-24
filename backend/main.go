package main

import (
	"uni-marketplace/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.POST("/send-otp", handlers.SendOTP)
	router.POST("/verify-otp", handlers.VerifyOTP)

	router.Run(":8080")
}
