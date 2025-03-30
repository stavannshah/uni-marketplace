import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import ItemListing from "./ItemListing"; 
import './App.css';
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
import { saveAs } from "file-saver";


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
          const data = await response.json();
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userID", data.userID);
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

const UserProfilePopup = ({ open, handleClose, saveProfile, profile }) => {
  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    saveProfile(formData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Preferred Email" name="preferred_email" value={formData.preferred_email} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Preferences" name="preferences" value={formData.preferences} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Location" name="location" value={formData.location} onChange={handleChange} sx={{ mb: 2 }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

// MainWebsite component with tabs and users list in the "Home" tab
const MainWebsite = () => {
  const [tab, setTab] = useState("Home");

  const [profileOpen, setProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({ name: "", preferred_email: "", preferences: "", location: "" });

  useEffect(() => {
    fetch("userProfile.json")
      .then((response) => response.json())
      .then((data) => setUserProfile(data))
      .catch((error) => console.error("Error loading profile:", error));
  }, []);

  const saveProfile = (profile) => {
    setUserProfile(profile);
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: "application/json" });
    saveAs(blob, "userProfile.json");
  };

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
          <IconButton color="inherit" onClick={() => setProfileOpen(true)} sx={{ marginLeft: "auto" }}>
            <AccountCircle />
          </IconButton>
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
        {tab === "Item Listing" && <ItemListing />}
        <Typography variant="body1">Welcome to the {tab} page!</Typography>
      </Container>
      <UserProfilePopup open={profileOpen} handleClose={() => setProfileOpen(false)} saveProfile={saveProfile} profile={userProfile} />
    </Box>
  );
};

// App component to manage login state
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  return isLoggedIn ? <MainWebsite /> : <OTPPage onLogin={() => setIsLoggedIn(true)} />;
};

export default App;