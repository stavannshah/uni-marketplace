import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import ItemListing from "./ItemListing"; 
import UserActivitiesSection from "./HomePage.jsx";
import CurrencyExchangeListing from "./CurrencyExchange.jsx";
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
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import { Logout, AccountCircle } from "@mui/icons-material";
import { saveAs } from "file-saver";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


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
  const defaultProfile = {
    name: "",
    email: "",
    preferred_email: "",
    preferences: "",
    location: ""
  };
  
  const [formData, setFormData] = useState(defaultProfile);
  
  useEffect(() => {
    if (open){
      setFormData(profile || defaultProfile);
    }
  }, [open,profile]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    saveProfile(formData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}  fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent
        dividers
        sx={{
          px: 3,
          py: 2,
          backgroundColor: "#f9f9fb",
          borderRadius: 2
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: "#0021A5", fontWeight: "bold" }}>
          ✏️ Update Profile Details
        </Typography>

        <Box sx={{ display: "grid", gap: 2, mt: 2 }}>
          <TextField
            label="Name"
            name="name"
            value={formData.name ?? ""}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: "white", borderRadius: 1 }}
          />
          <TextField
            label="Preferred Email"
            name="preferred_email"
            value={formData.preferred_email ?? ""}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: "white", borderRadius: 1 }}
          />
          <TextField
            label="Preferences"
            name="preferences"
            value={formData.preferences ?? ""}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: "white", borderRadius: 1 }}
          />
          <TextField
            label="Location"
            name="location"
            value={formData.location ?? ""}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: "white", borderRadius: 1 }}
          />
          <TextField
            label="Email (for login)"
            name="email"
            value={formData.email ?? ""}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            disabled
            sx={{ backgroundColor: "#f0f0f0", borderRadius: 1 }}
            helperText="This email is used to log into UniMarketplace"
          />
        </Box>
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
  const [userProfile, setUserProfile] = useState({ name: "", email:"",preferred_email: "", preferences: "", location: "" });

  useEffect(() => {
    const userID = localStorage.getItem("userID");
    if (!userID) return;
  
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/getUserProfile/${userID}`);
        if (!response.ok) throw new Error("Failed to fetch profile");
  
        const data = await response.json();
        setUserProfile(data.profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchProfile();
    
  }, []);
  //Stavan May 20 - Updated saveProfile to conncet it to backend
  const saveProfile = async (profile) => {
    try {
      const userID = localStorage.getItem("userID");
      const response = await fetch(`http://localhost:8080/api/updateUserProfile/${userID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });
  
      if (response.ok) {
        const updatedProfile = await response.json();
        setUserProfile(updatedProfile);
        alert("Profile updated successfully!");
      } else {
        console.error("Failed to update profile");
        alert("Update failed.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred.");
    }
  };
  

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
  };
  const userID = localStorage.getItem("userID");
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5", backgroundImage: "url('/uf-background.jpg')", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center"}}>

      <AppBar position="static">
      <Toolbar sx={{ bgcolor: "white  " }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0021A5", mr: 4 }}>
           UniMarketplace
        </Typography>
        <Tabs 
            value={tab} 
            onChange={(e, newValue) => setTab(newValue)} 
            textColor="primary" 
            indicatorColor="primary"
            sx={{
              '& .MuiTab-root': { color: '#FA4616' },
              '& .Mui-selected': { fontWeight: 'bold' }
            }}
          >

            <Tab label="Home" value="Home" />
            <Tab label="Item Listing" value="Item Listing" />
            <Tab label="Currency Exchange Listing" value="Currency Exchange Listing" />
            <Tab label="Sub Leasing Listing" value="Sub Leasing Listing" />
          </Tabs>
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
            <Typography
              variant="h6"
              sx={{
                color: "#0021A5",
                pr: 2,
                borderRight: "2px solid lightgrey"
              }}
            >
              Hi! {userProfile.email}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                borderRight: "2px solid lightgrey"
              }}
            >
              <IconButton
                color="primary"
                onClick={() => setProfileOpen(true)}
                sx={{ p: 0 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <span>Update Profile</span>
                  <AccountCircle />
                </Box>
              </IconButton>
            </Box>

            <Box sx={{ pl: 2 }}>
              <Button
                variant="contained"
                startIcon={<Logout />}
                onClick={logout}
                sx={{ backgroundColor: "green", color: "white" }}
              >
                Logout
              </Button>
            </Box>
          </Box>


        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        {tab === "Home" && <UserActivitiesSection />}
        {tab === "Item Listing" && <ItemListing />}
        {tab === "Currency Exchange Listing" && <CurrencyExchangeListing/>}
        <Box sx={{ bgcolor: '#0021A5', px: 2, py: 1, borderRadius: 1, mt: 4, mb: 2 }}>
          <Typography variant="h5" sx={{ color: 'white', m: 0 }}>
            Frequently Asked Questions
          </Typography>
        </Box>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How do I list an item for sale?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              To list an item, go to the 'Item Listing' tab, click on "Add Item," fill in the item name, condition, price, and upload an image.
            </Typography>
          </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>What currencies are supported in Currency Exchange?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            We support major currencies like USD, INR, EUR, and more. You can set your exchange rate and preferred currency.
          </Typography>
        </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>How do I post a sublease listing?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Use the 'Sub Leasing Listing' tab to enter details like rent, location, lease duration, and photos of the property.
        </Typography>
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Can I edit or delete my listings?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Yes, go to your profile to view all your listings. Each post has options to edit or delete.
        </Typography>
      </AccordionDetails>
    </Accordion>
      </Container>
      <UserProfilePopup open={profileOpen} handleClose={() => setProfileOpen(false)} saveProfile={saveProfile} profile={userProfile} />
      <Box sx={{ mt: 6, py: 2, textAlign: "center", bgcolor: "#0021A5", color: "white" }}>
        <Typography variant="body2">
          Built at University of Florida | UniMarketplace © 2025
        </Typography>
      </Box>

    </Box>
  );
};

// App component to manage login state
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  return isLoggedIn ? <MainWebsite /> : <OTPPage onLogin={() => setIsLoggedIn(true)} />;
};

export default App;