import React, { useState } from "react";
import { Card, CardContent, CardActions, Typography, Button } from "@mui/material";

const dummyListings = [
  {
    title: "iPhone 13 for sale",
    description: "Gently used iPhone 13 in excellent condition.",
    date_posted: "2025-02-27T10:00:00Z",
    price: 700,
    location: "Gainesville, FL",
    category: "Electronics",
  },
  ...Array(9).fill({
    title: "Laptop for sale",
    description: "Used laptop in good condition.",
    date_posted: "2025-02-25T09:00:00Z",
    price: 500,
    location: "Orlando, FL",
    category: "Computers",
  }),
];

const ItemListing = () => {
  const [listings, setListings] = useState(dummyListings);

  const handleCreateListing = () => {
    const newItem = {
      title: "New Item",
      description: "Brand new item for sale.",
      date_posted: new Date().toISOString(),
      price: 100,
      location: "Tampa, FL",
      category: "Miscellaneous",
    };
    setListings([newItem, ...listings]);
  };

  return (
    <div style={{ padding: "16px" }}>
      <Typography variant="h4" gutterBottom>
        Item Listings
      </Typography>
      <Button variant="contained" color="primary" onClick={handleCreateListing} style={{ marginBottom: "16px" }}>
        Create Listing
      </Button>
      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {listings.map((item, index) => (
          <Card key={index} variant="outlined">
            <CardContent>
              <Typography variant="h5">{item.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                {item.description}
              </Typography>
              <Typography variant="body1">
                <strong>Price:</strong> ${item.price}
              </Typography>
              <Typography variant="body1">
                <strong>Location:</strong> {item.location}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Posted on:</strong> {new Date(item.date_posted).toLocaleDateString()}
              </Typography>
              <Typography variant="caption" style={{ display: "block", marginTop: "8px" }}>
                Category: {item.category}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                View Details
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ItemListing;
