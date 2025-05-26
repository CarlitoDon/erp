// C:\Offline\Coding\erp\frontend\src\pages\ShippingProviders.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddShippingProviderModal from "../components/WarehouseManagement/AddShippingProviderModal";
import { useAuth } from "../contexts/AuthContext";

const ShippingProviders = () => {
  const { token } = useAuth();
  const [shippingProviders, setShippingProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchShippingProviders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/warehouse/shipping-providers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const text = await response.text();
        console.error("Gagal mengambil daftar shipping provider:", text);
        setError(text || "Gagal mengambil daftar shipping provider.");
        return;
      }
      const data = await response.json();
      setShippingProviders(data || []);
    } catch (fetchError) {
      console.error(
        "Terjadi kesalahan saat mengambil daftar shipping provider:",
        fetchError
      );
      setError("Terjadi kesalahan saat menghubungi server.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchShippingProviders();
  }, [fetchShippingProviders]);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddShippingProviderSuccess = (newProvider) => {
    setShippingProviders((prevProviders) => [...prevProviders, newProvider]);
    setIsAddModalOpen(false);
    fetchShippingProviders(); // Refetch data setelah menambah
  };

  const handleDeleteShippingProvider = async (id) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus penyedia pengiriman dengan ID ${id}?`
      )
    ) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/warehouse/shipping-providers/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const text = await response.text();
          console.error(
            `Gagal menghapus shipping provider dengan ID ${id}:`,
            text
          );
          setError(
            text || `Gagal menghapus shipping provider dengan ID ${id}.`
          );
          return;
        }

        console.log(`Berhasil menghapus shipping provider dengan ID ${id}`);
        // Perbarui state dengan menghapus provider yang dihapus
        setShippingProviders((prevProviders) =>
          prevProviders.filter((provider) => provider.id !== id)
        );
      } catch (deleteError) {
        console.error(
          `Terjadi kesalahan saat menghapus shipping provider dengan ID ${id}:`,
          deleteError
        );
        setError("Terjadi kesalahan saat menghubungi server untuk menghapus.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manajemen Pengiriman - Penyedia Pengiriman
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpenAddModal}
        sx={{ mb: 2 }}
      >
        Tambah Penyedia Pengiriman
      </Button>

      <AddShippingProviderModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAddSuccess={handleAddShippingProviderSuccess}
      />

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer>
            <Table stickyHeader aria-label="daftar penyedia pengiriman">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nama Penyedia</TableCell>
                  <TableCell align="right">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shippingProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell component="th" scope="row">
                      {provider.id}
                    </TableCell>
                    <TableCell>{provider.name}</TableCell>
                    <TableCell align="right">
                      <IconButton aria-label="edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() =>
                          handleDeleteShippingProvider(provider.id)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default ShippingProviders;
