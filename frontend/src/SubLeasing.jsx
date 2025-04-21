import React, { useEffect, useState } from "react";
import {
  Box, Button, Card, CardContent, Modal, TextField, Typography
} from "@mui/material";

const SubLeasingListing = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pictures: ["", "", ""],
    rent: "",
    location: { city: "", state: "", country: "" },
    period: { start_date: "", end_date: "" },
    date_posted: new Date().toISOString(),
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/getSubleasingRequests")
      .then((res) => res.json())
      .then((data) => {
        setListings(data.requests || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load listings");
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (["city", "state", "country"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else if (["start_date", "end_date"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        period: { ...prev.period, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateListing = async () => {
    try {
      const userID = localStorage.getItem("userID");
      if (!userID) throw new Error("User not authenticated");

      const response = await fetch("http://localhost:8080/api/subleasing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          user_id: userID,
          rent: parseFloat(formData.rent),
          period: {
            start_date: new Date(formData.period.start_date),
            end_date: new Date(formData.period.end_date),
          },
          date_posted: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to post listing");

      const updated = await fetch("http://localhost:8080/api/getSubleasingRequests");
      const data = await updated.json();
      setListings(data.requests);
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <div>
      <Button variant="contained" onClick={() => setShowForm(true)}>
        Create Sublease Listing
      </Button>

      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <Box sx={{ p: 4, bgcolor: "background.paper", maxWidth: 600, margin: "20px auto", overflowY: "auto" }}>
          <Button onClick={() => setShowForm(false)} sx={{ position: "absolute", right: 8, top: 8 }}>✕</Button>
          <Typography variant="h6" gutterBottom>Create Sublease</Typography>

          <TextField fullWidth label="Title" name="title" value={formData.title} onChange={handleInputChange} margin="normal" />
          <TextField fullWidth label="Description" name="description" multiline rows={4} value={formData.description} onChange={handleInputChange} />

          <TextField fullWidth label="Rent Amount" name="rent" type="number" value={formData.rent} onChange={handleInputChange} inputProps={{ step: "0.01" }} />

          {formData.pictures.map((url, i) => (
            <TextField
              key={i}
              fullWidth label={`Image URL ${i + 1}`}
              value={url}
              onChange={(e) => {
                const newPics = [...formData.pictures];
                newPics[i] = e.target.value;
                setFormData(prev => ({ ...prev, pictures: newPics }));
              }}
              margin="normal"
            />
          ))}

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField fullWidth label="City" name="city" value={formData.location.city} onChange={handleInputChange} />
            <TextField fullWidth label="State" name="state" value={formData.location.state} onChange={handleInputChange} />
            <TextField fullWidth label="Country" name="country" value={formData.location.country} onChange={handleInputChange} />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField fullWidth type="date" name="start_date" value={formData.period.start_date} onChange={handleInputChange} label="Start Date" InputLabelProps={{ shrink: true }} />
            <TextField fullWidth type="date" name="end_date" value={formData.period.end_date} onChange={handleInputChange} label="End Date" InputLabelProps={{ shrink: true }} />
          </Box>

          <Button variant="contained" onClick={handleCreateListing} sx={{ mt: 3 }}>
            Submit
          </Button>
        </Box>
      </Modal>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, mt: 4 }}>
        {listings.map((listing, i) => (
          <Card key={i}>
            <CardContent>
              <Typography variant="h6">{listing.title}</Typography>
              <Typography>{listing.description}</Typography>
              <Typography>Rent: ${listing.rent}</Typography>
              <Typography>{listing.location.city}, {listing.location.state}, {listing.location.country}</Typography>
              <Typography>From: {new Date(listing.period?.start_date).toLocaleDateString()}</Typography>
              <Typography>To: {new Date(listing.period?.end_date).toLocaleDateString()}</Typography>
              <Typography variant="caption">Posted: {new Date(listing.date_posted).toLocaleDateString()}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
};

export default SubLeasingListing;
