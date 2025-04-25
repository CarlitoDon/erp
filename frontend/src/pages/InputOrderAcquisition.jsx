//src/pages/InputOrder.jsx

import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

function InputOrderAcquisition() {
  const [formData, setFormData] = useState({
    nama: "",
    nomorTelepon: "",
    alamat: "",
    pesanan: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Kirim data ke backend pakai axios nanti
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Input Order
        </Typography>
        <form onSubmit={handleSubmit}>
          {["nama", "nomorTelepon", "alamat", "pesanan"].map((field, index) => (
            <TextField
              key={index}
              fullWidth
              margin="normal"
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              type={field === "nomorTelepon" ? "number" : "text"}
            />
          ))}
          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
            fullWidth
          >
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default InputOrderAcquisition;
