import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";

function AddStore() {
  const [formData, setFormData] = useState({
    name: "",
    platform: "",
    owner: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/add-store", formData);
      alert("Store added successfully!");
    } catch (error) {
      console.error("Error adding store:", error);
      alert("Failed to add store.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Add Marketplace Store
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Store Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Platform"
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Owner"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            fullWidth
          >
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default AddStore;