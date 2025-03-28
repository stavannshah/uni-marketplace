import React, { useState, useEffect } from "react";
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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { Logout, AccountCircle } from "@mui/icons-material";

// OTPPage component as is
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

// UsersList component to fetch and display user list
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/users")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched users:", data);
        setUsers(Array.isArray(data.users) ? data.users : []);
      })
      .catch((err) => console.error("Error fetching users:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom align="center">
        Registered Users
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress />
        </Box>
      ) : users.length === 0 ? (
        <Typography align="center">No users found.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Last Login</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
};

// User Profile Popup Component
const UserProfilePopup = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    preferences: "",
    preferred_email: "",
    city: "",
    state: "",
    country: "",
  });

  const handleDialogOpen = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    const payload = {
      ...userData,
      preferences: userData.preferences.split(",").map((pref) => pref.trim()),
      location: {
        city: userData.city,
        state: userData.state,
        country: userData.country,
      },
    };
    try {
      const response = await fetch("http://localhost:8080/api/saveUserProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert("Profile saved successfully!");
        handleDialogClose();
      } else {
        alert("Failed to save profile.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving profile.");
    }
  };
  return (
    <div>
      <IconButton color="inherit" onClick={handleDialogOpen} sx={{ marginLeft: 2 }}>
        <AccountCircle />
      </IconButton>
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Name" name="name" onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Preferred Email" name="preferred_email" onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Preferences (comma-separated)" name="preferences" onChange={handleChange} />
          <TextField fullWidth margin="dense" label="City" name="city" onChange={handleChange} />
          <TextField fullWidth margin="dense" label="State" name="state" onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Country" name="country" onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// MainWebsite component with tabs and users list in the "Home" tab
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
          <UserProfilePopup />
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
        {tab === "Home" && <UsersList />}
        <Typography variant="body1">Welcome to the {tab} page!</Typography>
      </Container>
    </Box>
  );
};

// App component to manage login state
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  return isLoggedIn ? <MainWebsite /> : <OTPPage onLogin={() => setIsLoggedIn(true)} />;
};

export default App;