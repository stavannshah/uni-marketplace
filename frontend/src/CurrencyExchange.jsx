import React, { useState, useEffect } from "react";
import {
  Card, CardContent, Typography, Button, Modal, TextField, Box, MenuItem, Select
} from "@mui/material";

const CurrencyExchangeListing = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    from_currency: "",
    to_currency: "",
    request_date: new Date().toISOString()
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/getCurrencyExchangeListings")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch listings");
        return res.json();
      })
      .then((data) => {
        setListings(data.listings);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateListing = async () => {
    try {
      const userID = localStorage.getItem("userID");
      if (!userID) throw new Error("User not authenticated");

      const response = await fetch("http://localhost:8080/api/postCurrencyListing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, user_id: userID, amount: parseFloat(formData.amount) })
      });

      if (!response.ok) throw new Error("Submission failed");

      const updated = await fetch("http://localhost:8080/api/getCurrencyListings");
      const data = await updated.json();
      alert("Listing posted successfully.");
      setListings(data.listings);
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <div>
      <Button variant="contained" onClick={() => setShowForm(true)}>
        Create Currency Exchange Listing
      </Button>

      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <Box sx={{
          p: 4, bgcolor: 'background.paper',
          position: 'relative', maxWidth: 600, maxHeight: '80vh',
          overflowY: 'auto', margin: '20px auto'
        }}>
          <Button onClick={() => setShowForm(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            ✕
          </Button>

          <Typography variant="h6" gutterBottom>New Currency Listing</Typography>

          <TextField
            fullWidth label="Amount" name="amount" type="number"
            value={formData.amount} onChange={handleInputChange} inputProps={{ step: "0.01" }} margin="normal"
          />

          <Select
            fullWidth name="from_currency" value={formData.from_currency}
            onChange={handleInputChange} displayEmpty sx={{ mt: 2 }}
          >
            <MenuItem value="" disabled>From Currency</MenuItem>
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="INR">INR</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
          </Select>

          <Select
            fullWidth name="to_currency" value={formData.to_currency}
            onChange={handleInputChange} displayEmpty sx={{ mt: 2 }}
          >
            <MenuItem value="" disabled>To Currency</MenuItem>
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="INR">INR</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
          </Select>

          <Button variant="contained" onClick={handleCreateListing} sx={{ mt: 3 }}>
            Submit
          </Button>
        </Box>
      </Modal>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginTop: '20px'
      }}>
        {listings.map((listing, index) => (
          <Card key={index}>
            <CardContent>
              <Typography variant="h6">
                {listing.amount} {listing.from_currency} ➡ {listing.to_currency}
              </Typography>
              <Typography variant="caption">
                {new Date(listing.request_date).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CurrencyExchangeListing;
