import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

const UserActivitiesSection = () => {
  const [activities, setActivities] = useState({
    marketplace: [],
    currency: [],
    subleasing: [],
  });
  const [loading, setLoading] = useState(true);
  const userID = localStorage.getItem("userID");
  const [editItem, setEditItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  console.log(userID)
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/user/activities?user_id=${userID}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setActivities({
          marketplace: data.marketplace_listings || [],
          currency: data.currency_exchange_requests || [],
          subleasing: data.subleasingRequests || [],
        });
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [userID]);

  const handleEditClick = (item) => {
    setEditItem(item);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      await fetch(`http://localhost:8080/api/updateListing`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editItem),
      });
      alert("Listing updated!");
      setIsDialogOpen(false);
    } catch (err) {
      alert("Failed to update.");
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:8080/api/deleteListing/${editItem.id}`, {
        method: "DELETE",
      });
      alert("Listing deleted!");
      setIsDialogOpen(false);
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const handleMarkAsSold = async () => {
    try {
      await fetch(`http://localhost:8080/api/markAsSold`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editItem.id }),
      });
      alert("Marked as sold!");
      setIsDialogOpen(false);
    } catch (err) {
      alert("Failed to mark as sold.");
    }
  };

  const renderActivitySection = (title, items, fields) => (
    <Box sx={{ mb: 4, backgroundColor: "#FAF9F6" }}>
      <Box sx={{ bgcolor: "#FA4616", px: 2, py: 1, borderRadius: 1, mb: 2 }}>
        <Typography variant="h5" sx={{ color: "white", m: 0 }}>
          {title}
        </Typography>
      </Box>
      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No {title.toLowerCase()} found
        </Typography>
      ) : (
        <Table component={Paper}>
          <TableHead>
            <TableRow>
              {fields.map((field) => (
                <TableCell key={field}>{field}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                {fields.map((field) => (
                  <TableCell key={field}>
                    {item[field.toLowerCase()] || "N/A"}
                  </TableCell>
                ))}
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEditClick(item)}
                  >
                    Edit / Mark As Sold
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );

  if (loading) {
    return <CircularProgress sx={{ mt: 4 }} />;
  }

  return (
    <Box sx={{ p: 3 }}>
      {renderActivitySection("Active Item Listings", activities.marketplace, [
        "Title",
        "Price",
        "Condition",
        "Category",
      ])}

      {renderActivitySection(
        "Active Currency Exchange Listings",
        activities.currency,
        ["Amount", "FromCurrency", "ToCurrency", "RequestDate"]
      )}

      {renderActivitySection("Active Sub Leasing Listings", activities.subleasing, [
        "Title",
        "Rent",
        "Location",
        "Period",
      ])}

      {/* Dialog for editing/marking as sold */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Edit or Mark as Sold</DialogTitle>
        <DialogContent>
          {editItem && (
            <>
              <TextField
                margin="dense"
                fullWidth
                label="Title"
                value={editItem.title}
                onChange={(e) =>
                  setEditItem({ ...editItem, title: e.target.value })
                }
              />
              <TextField
                margin="dense"
                fullWidth
                label="Price"
                value={editItem.price}
                onChange={(e) =>
                  setEditItem({ ...editItem, price: e.target.value })
                }
              />
              <TextField
                margin="dense"
                fullWidth
                label="Condition"
                value={editItem.condition}
                onChange={(e) =>
                  setEditItem({ ...editItem, condition: e.target.value })
                }
              />
              <TextField
                margin="dense"
                fullWidth
                label="Category"
                value={editItem.category}
                onChange={(e) =>
                  setEditItem({ ...editItem, category: e.target.value })
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={handleMarkAsSold}>Mark as Sold</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserActivitiesSection;
