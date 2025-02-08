import React, { useState } from "react";
import emailjs from "emailjs-com";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
} from "@mui/material";
import { Logout } from "@mui/icons-material";

const OTPPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [step, setStep] = useState(1);
  const [emailError, setEmailError] = useState("");

  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@ufl\.edu$/;
    return emailRegex.test(email);
  };

  const sendOtp = async () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid @ufl.edu email address.");
      return;
    }

    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);

    const templateParams = {
      user_email: email,
      otp: newOtp,
    };

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAIL_SERVICE_ID,
        import.meta.env.VITE_EMAIL_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAIL_USER_ID
      );
      alert("OTP sent to your email!");
      setStep(2);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const verifyOtp = async () => {
    if (otp === generatedOtp) {
      const user = {
        email: email,
        last_login: new Date().toISOString(),
      };
      console.log("Sending user data to backend:", user); // Debug log
  
      try {
        const response = await fetch("http://localhost:8080/api/saveUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
  
        console.log("Backend response status:", response.status); // Debug log
        if (response.ok) {
          localStorage.setItem("isLoggedIn", "true");
          onLogin();
        } else {
          const errorData = await response.json(); // Parse error response
          console.error("Backend error:", errorData); // Debug log
          alert("Failed to save user details.");
        }
      } catch (error) {
        console.error("Error saving user details:", error);
        alert("Failed to save user details.");
      }
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      {step === 1 && 
      (
        <Box sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Welcome Back!
          </Typography>
          <TextField
            fullWidth
            label="Enter your @ufl.edu email"
            variant="outlined"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            error={!!emailError}
            helperText={emailError}
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={sendOtp}
            sx={{ bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }}
          >
            Send OTP
          </Button>
        </Box>
      )}

      {step === 2 && (
        <Box sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Verify OTP
          </Typography>
          <TextField
            fullWidth
            label="Enter the OTP"
            variant="outlined"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={verifyOtp}
            sx={{ bgcolor: "success.main", "&:hover": { bgcolor: "success.dark" } }}
          >
            Verify and Login
          </Button>
        </Box>
      )}
    </Container>
  );
};

const MainWebsite = () => {
  const [tab, setTab] = useState("Home");

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
            <Tab label="Home" value="Home" />
            <Tab label="Item Listing" value="Item Listing" />
            <Tab label="Currency Exchange Listing" value="Currency Exchange Listing" />
            <Tab label="Sub Leasing Listing" value="Sub Leasing Listing" />
          </Tabs>
          <Button
            color="inherit"
            startIcon={<Logout />}
            onClick={logout}
            sx={{ marginLeft: "auto" }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h3" gutterBottom>
          {tab}
        </Typography>
        <Typography variant="body1">Welcome to the {tab} page!</Typography>
      </Container>
    </Box>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  return isLoggedIn ? <MainWebsite /> : <OTPPage onLogin={() => setIsLoggedIn(true)} />;
};

export default App;