// src/components/AcquisitionOrder/OrderItems.jsx
import React from "react";
import {
  TextField,
  FormControl,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const OrderItems = ({ orderItems, setOrderItems, handleAddItem }) => {
  const handleRemoveItem = (index) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  };

  const handleItemChange = (index, event) => {
    const { name, value } = event.target;
    const newItems = [...orderItems];
    newItems[index][name] = value;
    setOrderItems(newItems);
  };

  const calculateTotal = () => {
    return orderItems
      .reduce((total, item) => {
        return (
          total + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)
        );
      }, 0)
      .toLocaleString("id-ID");
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #f0f0f0",
          bgcolor: "#f9f9f9",
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
        }}
      >
        <ShoppingCartIcon sx={{ mr: 1.5, color: "#3f51b5" }} />
        <Typography variant="h6" fontWeight="600">
          Produk yang Dipesan
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        {orderItems.map((item, index) => (
          <Paper
            elevation={0}
            key={index}
            sx={{
              p: 2,
              borderRadius: 2,
              width: "100%",
              mb: 2,
              border: "1px solid #e8e8e8",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "6px",
                height: "100%",
                bgcolor: "#3f51b5",
              }}
            />

            <Box sx={{ pl: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Chip
                  label={`Produk ${index + 1}`}
                  size="small"
                  sx={{
                    bgcolor: "#e8eaf6",
                    color: "#3f51b5",
                    fontWeight: "bold",
                    mr: 2,
                  }}
                />
                {orderItems.length > 1 && (
                  <IconButton
                    onClick={() => handleRemoveItem(index)}
                    color="error"
                    size="small"
                    sx={{ ml: "auto" }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                )}
              </Box>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <TextField
                      label="Nama Produk"
                      name="productId"
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 1.5 },
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={3} md={2}>
                  <FormControl fullWidth>
                    <TextField
                      label="Kuantitas"
                      name="quantity"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 1.5 },
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <FormControl fullWidth>
                    <TextField
                      label="Harga per Item (Rp)"
                      name="price"
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 1.5 },
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <TextField
                      label="Catatan Produk (Opsional)"
                      name="note"
                      value={item.note}
                      onChange={(e) => handleItemChange(index, e)}
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 1.5 },
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              {item.quantity > 0 && item.price > 0 && (
                <Box sx={{ mt: 2, textAlign: "right" }}>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal: Rp{" "}
                    {(
                      parseFloat(item.price) * parseInt(item.quantity)
                    ).toLocaleString("id-ID")}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        ))}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Button
            onClick={handleAddItem}
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              borderRadius: 6,
              bgcolor: "#e8eaf6",
              color: "#3f51b5",
              "&:hover": {
                bgcolor: "#c5cae9",
              },
              px: 2,
            }}
          >
            Tambah Produk
          </Button>

          <Box
            sx={{
              bgcolor: "#f5f5f5",
              p: 2,
              borderRadius: 2,
              display: "inline-block",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Total Pesanan: Rp {calculateTotal()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default OrderItems;
