import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Modal, TextField, Box, MenuItem, Select } from "@mui/material";

const ItemListing = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    pictures: ["", "", ""],
    description: "",
    category: "",
    price: "",
    condition: "",
    location: { city: "", state: "", country: "" },
    date_posted: new Date().toISOString()
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/getMarketplaceListings")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch listings");
        return response.json();
      })
      .then((data) => {
        setListings(data.listings);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "city" || name === "state" || name === "country") {
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateListing = async () => {
    try {
      const userID = localStorage.getItem("userID");
      if (!userID) throw new Error("User not authenticated");

      const response = await fetch("http://localhost:8080/api/postMarketplaceListing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          user_id: userID,
          price: parseFloat(formData.price)
        })
      });

      if (!response.ok) throw new Error("Submission failed");

      // Refresh listings
      const updated = await fetch("http://localhost:8080/api/getMarketplaceListings");
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
        Create Listing
      </Button>

      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <Box sx={{ 
          p: 4, 
          bgcolor: 'background.paper', 
          position: 'relative',
          maxWidth: 600,
          maxHeight: '80vh',
          overflowY: 'auto',
          margin: '20px auto'
        }}>
          <Button onClick={() => setShowForm(false)} sx={{ 
            position: 'absolute', 
            right: 8, 
            top: 8 
          }}>
            ✕
          </Button>

          <Typography variant="h6" gutterBottom>New Listing</Typography>

          <TextField
            fullWidth label="Title" name="title" value={formData.title}
            onChange={handleInputChange} margin="normal" required
          />

          <TextField
            fullWidth label="Description" name="description" multiline rows={4}
            value={formData.description} onChange={handleInputChange} required
          />

          <TextField
            fullWidth label="Price" name="price" type="number"
            value={formData.price} onChange={handleInputChange} inputProps={{ step: "0.01" }}
          />

          {formData.pictures.map((url, index) => (
            <TextField
              key={index}
              fullWidth label={`Image URL ${index + 1}`}
              value={url} onChange={(e) => {
                const newPics = [...formData.pictures];
                newPics[index] = e.target.value;
                setFormData(prev => ({ ...prev, pictures: newPics }));
              }}
              required={index === 0}
            />
          ))}

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              fullWidth label="City" name="city"
              value={formData.location.city} onChange={handleInputChange}
            />
            <TextField
              fullWidth label="State" name="state"
              value={formData.location.state} onChange={handleInputChange}
            />
            <TextField
              fullWidth label="Country" name="country"
              value={formData.location.country} onChange={handleInputChange}
            />
          </Box>

          <Select
            fullWidth name="category" value={formData.category}
            onChange={handleInputChange} displayEmpty sx={{ mt: 2 }}
          >
            <MenuItem value="" disabled>Select Category</MenuItem>
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Furniture">Furniture</MenuItem>
            <MenuItem value="Books">Books</MenuItem>
          </Select>

          <Select
            fullWidth name="condition" value={formData.condition}
            onChange={handleInputChange} displayEmpty sx={{ mt: 2 }}
          >
            <MenuItem value="" disabled>Select Condition</MenuItem>
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="Like New">Like New</MenuItem>
            <MenuItem value="Used">Used</MenuItem>
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
              <Typography variant="h6">{listing.title}</Typography>
              <Typography color="textSecondary">{listing.category}</Typography>
              <Typography paragraph>{listing.description}</Typography>
              <Typography>${listing.price}</Typography>
              <Typography>{listing.condition}</Typography>
              <Typography>
                {listing.location.city}, {listing.location.state}, {listing.location.country}
              </Typography>
              <Typography variant="caption">
                {new Date(listing.date_posted).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ItemListing;
