// src/pages/MarketplaceSettings.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Stack,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StorefrontIcon from "@mui/icons-material/Storefront";

const Marketplace = {
  Shopee: "Shopee",
  TiktokShop: "TiktokShop",
  Tokopedia: "Tokopedia",
  Lazada: "Lazada",
};

const StoreSyncType = {
  API: "API",
  MANUAL: "MANUAL",
};

const StoreConnectionForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    erpStoreName: "",
    platform: "",
    syncType: StoreSyncType.MANUAL,
    platformStoreId: "",
    platformStoreName: "",
    apiKey: "",
    apiSecret: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        erpStoreName: initialData.erpStoreName || "",
        platform: initialData.platform || "",
        syncType: initialData.syncType || StoreSyncType.MANUAL,
        platformStoreId: initialData.platformStoreId || "",
        platformStoreName: initialData.platformStoreName || "",
        apiKey: "",
        apiSecret: "",
      });
    } else {
      setFormData({
        erpStoreName: "",
        platform: "",
        syncType: StoreSyncType.MANUAL,
        platformStoreId: "",
        platformStoreName: "",
        apiKey: "",
        apiSecret: "",
      });
    }
    setFormError("");
  }, [initialData, open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSyncTypeChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      syncType: event.target.value,
      apiKey: event.target.value === StoreSyncType.MANUAL ? "" : prev.apiKey,
      apiSecret:
        event.target.value === StoreSyncType.MANUAL ? "" : prev.apiSecret,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");
    if (!formData.erpStoreName || !formData.platform) {
      setFormError("Nama Toko ERP dan Platform wajib diisi.");
      return;
    }
    if (
      formData.syncType === StoreSyncType.API &&
      (!formData.apiKey || !formData.apiSecret)
    ) {
      setFormError("API Key dan Secret wajib diisi untuk sinkronisasi API.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Edit Store Connection" : "Add New Store Connection"}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={3}>
            {formError && <Alert severity="error">{formError}</Alert>}
            <TextField
              required
              label="Nama Toko (di ERP)"
              name="erpStoreName"
              value={formData.erpStoreName}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
            />
            <FormControl
              required
              fullWidth
              disabled={isLoading || !!initialData}
            >
              <InputLabel id="platform-select-label">Platform</InputLabel>
              <Select
                labelId="platform-select-label"
                label="Platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
              >
                {Object.values(Marketplace).map((platform) => (
                  <MenuItem key={platform} value={platform}>
                    {platform}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl component="fieldset" disabled={isLoading}>
              <FormLabel component="legend">Tipe Sinkronisasi</FormLabel>
              <RadioGroup
                row
                name="syncType"
                value={formData.syncType}
                onChange={handleSyncTypeChange}
              >
                <FormControlLabel
                  value={StoreSyncType.MANUAL}
                  control={<Radio />}
                  label="Manual Input"
                />
                <FormControlLabel
                  value={StoreSyncType.API}
                  control={<Radio />}
                  label="API Sync"
                />
              </RadioGroup>
            </FormControl>

            {formData.syncType === StoreSyncType.API && (
              <>
                <TextField
                  label="Platform Store ID (Opsional)"
                  name="platformStoreId"
                  value={formData.platformStoreId}
                  onChange={handleChange}
                  fullWidth
                  disabled={isLoading}
                />
                <TextField
                  label="Platform Store Name (Opsional)"
                  name="platformStoreName"
                  value={formData.platformStoreName}
                  onChange={handleChange}
                  fullWidth
                  disabled={isLoading}
                />
                <TextField
                  required={!initialData}
                  label="API Key"
                  name="apiKey"
                  value={formData.apiKey}
                  onChange={handleChange}
                  fullWidth
                  type="password"
                  disabled={isLoading || !!initialData}
                  helperText={
                    initialData
                      ? "API Key tidak ditampilkan. Update via proses terpisah jika perlu."
                      : ""
                  }
                />
                <TextField
                  required={!initialData}
                  label="API Secret"
                  name="apiSecret"
                  value={formData.apiSecret}
                  onChange={handleChange}
                  fullWidth
                  type="password"
                  disabled={isLoading || !!initialData}
                  helperText={
                    initialData
                      ? "API Secret tidak ditampilkan. Update via proses terpisah jika perlu."
                      : ""
                  }
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: "16px 24px" }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? (
              <CircularProgress size={24} />
            ) : initialData ? (
              "Save Changes"
            ) : (
              "Add Connection"
            )}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

function MarketplaceSettings() {
  const [storeConnections, setStoreConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  const fetchStoreConnections = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("TODO: Fetch store connections from API");
      await new Promise((resolve) => setTimeout(resolve, 500));
      const dummyData = [
        {
          id: 1,
          userId: 1,
          platform: Marketplace.Shopee,
          erpStoreName: "Toko Shopee Utama",
          syncType: StoreSyncType.API,
          isActive: true,
          isConnected: true,
          platformStoreId: "12345",
        },
        {
          id: 2,
          userId: 1,
          platform: Marketplace.Tokopedia,
          erpStoreName: "Toko Coba Tokped",
          syncType: StoreSyncType.MANUAL,
          isActive: true,
          isConnected: false,
          platformStoreId: "67890",
        },
        {
          id: 3,
          userId: 1,
          platform: Marketplace.TiktokShop,
          erpStoreName: "TikTok Fun",
          syncType: StoreSyncType.API,
          isActive: false,
          isConnected: false,
          platformStoreId: "11223",
        },
        {
          id: 4,
          userId: 1,
          platform: Marketplace.Shopee,
          erpStoreName: "Shopee Gudang Baru",
          syncType: StoreSyncType.MANUAL,
          isActive: true,
          isConnected: false,
        },
      ];
      setStoreConnections(dummyData);
    } catch (err) {
      setError(err.message || "Could not fetch store connections.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreConnections();
  }, []);

  const handleOpenAddModal = () => {
    setEditingStore(null);
    setIsModalOpen(true);
    setSuccess(null);
    setError(null);
  };

  const handleOpenEditModal = (store) => {
    setEditingStore(store);
    setIsModalOpen(true);
    setSuccess(null);
    setError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStore(null);
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const isEditing = !!editingStore;
    const url = isEditing
      ? `/api/store-connections/${editingStore.id}`
      : "/api/store-connections";
    const method = isEditing ? "PUT" : "POST";

    console.log("TODO: Call API to save data", { method, url, data: formData });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(
        `Store connection ${isEditing ? "updated" : "added"} successfully!`
      );
      handleCloseModal();
      fetchStoreConnections();
    } catch (err) {
      setError(
        err.message ||
          `An error occurred while ${
            isEditing ? "updating" : "adding"
          } the connection.`
      );
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this store connection? This cannot be undone."
      )
    ) {
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    console.log("TODO: Call API to delete store connection", storeId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSuccess("Store connection deleted successfully!");
      fetchStoreConnections();
    } catch (err) {
      setError(err.message || "Failed to delete store connection.");
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h2" fontWeight="medium">
          Marketplace Store Settings
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleOpenAddModal}
          disabled={loading}
        >
          Add Store Connection
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {loading && !isModalOpen && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && storeConnections.length === 0 && (
        <Typography sx={{ textAlign: "center", my: 3 }}>
          No store connections found. Add your first store!
        </Typography>
      )}

      {!loading && storeConnections.length > 0 && (
        <Paper elevation={2}>
          <List disablePadding>
            {storeConnections.map((store, index) => (
              <ListItem
                key={store.id}
                divider={index < storeConnections.length - 1}
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleOpenEditModal(store)}
                      disabled={loading}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      sx={{ ml: 1 }}
                      onClick={() => handleDeleteStore(store.id)}
                      disabled={loading}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: store.isActive ? "primary.light" : "grey.400",
                    }}
                  >
                    <StorefrontIcon fontSize="small" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={store.erpStoreName}
                  secondary={`${store.platform} - ${store.syncType}${
                    store.syncType === StoreSyncType.API
                      ? store.isConnected
                        ? " (Connected)"
                        : " (Disconnected)"
                      : ""
                  }`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <StoreConnectionForm
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={editingStore}
        isLoading={loading}
      />
    </Box>
  );
}

export default MarketplaceSettings;
