// src/pages/MarketplaceSettings.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Switch,
  FormControlLabel,
} from "@mui/material";

// Placeholder untuk data settings (nantinya diambil dari API)
const initialSettings = {
  shopee: { connected: false, apiKey: "", shopId: "", autoSyncOrders: true },
  tokopedia: { connected: false, apiKey: "", shopId: "", autoSyncOrders: false },
  tiktok: { connected: false, apiKey: "", shopId: "", autoSyncOrders: true },
};

// Fungsi untuk mendapatkan komponen panel tab
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`marketplace-tabpanel-${index}`}
      aria-labelledby={`marketplace-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function MarketplaceSettings() {
  const [selectedTab, setSelectedTab] = useState(0); // 0: Shopee, 1: Tokopedia, 2: TikTok
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false); // Untuk loading fetch/save
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // TODO: Nanti, gunakan useEffect untuk fetch settings dari API saat komponen mount
  useEffect(() => {
    // fetchMarketplaceSettings().then(data => setSettings(data)).catch(err => setError...);
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setError(null); // Reset error/success saat ganti tab
    setSuccess(null);
  };

  // Placeholder untuk handle perubahan input
  const handleInputChange = (marketplace, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [marketplace]: {
        ...prev[marketplace],
        [field]: value,
      },
    }));
  };

   // Placeholder untuk handle toggle switch
   const handleSwitchChange = (marketplace, field, checked) => {
    setSettings((prev) => ({
      ...prev,
      [marketplace]: {
        ...prev[marketplace],
        [field]: checked,
      },
    }));
  };

  // Placeholder untuk handle save/connect
  const handleSaveChanges = (marketplace) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    console.log("Saving settings for:", marketplace, settings[marketplace]);
    // TODO: Panggil API untuk menyimpan settings[marketplace]
    // saveMarketplaceSettings(marketplace, settings[marketplace])
    //   .then(() => setSuccess(`${marketplace} settings saved!`))
    //   .catch(err => setError(`Failed to save ${marketplace}: ${err.message}`))
    //   .finally(() => setLoading(false));

    // Simulasi sukses setelah 1 detik
    setTimeout(() => {
        setSuccess(`${marketplace.charAt(0).toUpperCase() + marketplace.slice(1)} settings saved successfully!`);
        setLoading(false);
    }, 1000);
  };

  const renderSettingsForm = (marketplaceKey) => {
    const currentData = settings[marketplaceKey];
    if (!currentData) return <Alert severity="warning">Configuration not available.</Alert>;

    return (
      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {marketplaceKey.charAt(0).toUpperCase() + marketplaceKey.slice(1)} Connection
            </Typography>
             {/* Nanti bisa diganti logic autentikasi yg lebih kompleks */}
             <Alert severity={currentData.connected ? "success" : "info"} sx={{ mb: 2}}>
                Status: {currentData.connected ? "Connected" : "Not Connected"}
             </Alert>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="API Key / Secret" // Sesuaikan labelnya
              variant="outlined"
              value={currentData.apiKey}
              onChange={(e) => handleInputChange(marketplaceKey, "apiKey", e.target.value)}
              disabled={loading}
              type="password" // Sembunyikan API key
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Shop ID / Identifier" // Sesuaikan labelnya
              variant="outlined"
              value={currentData.shopId}
              onChange={(e) => handleInputChange(marketplaceKey, "shopId", e.target.value)}
              disabled={loading}
            />
          </Grid>

           <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2}}>
                 Synchronization
              </Typography>
              <FormControlLabel
                 control={
                    <Switch
                       checked={currentData.autoSyncOrders}
                       onChange={(e) => handleSwitchChange(marketplaceKey, 'autoSyncOrders', e.target.checked)}
                       disabled={loading}
                    />
                 }
                 label="Automatically Sync Orders"
              />
               {/* Tambahkan setting sync lainnya di sini (frekuensi, dll) */}
           </Grid>

          {/* ... Tambahkan field setting lainnya sesuai kebutuhan ... */}

          <Grid item xs={12}>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                variant="contained"
                onClick={() => handleSaveChanges(marketplaceKey)}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Save Settings"}
              </Button>
               {/* Mungkin perlu tombol "Connect/Disconnect" terpisah */}
            </Box>
             {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
             {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Box> {/* Ganti Container/Paper jika layout induk sudah menyediakannya */}
      <Typography variant="h5" component="h2" gutterBottom fontWeight="medium">
        Marketplace Store Settings
      </Typography>

      <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="Marketplace settings tabs"
            variant="scrollable" // Jika tab banyak
            scrollButtons="auto" // Jika tab banyak
          >
            <Tab label="Shopee" id="marketplace-tab-0" aria-controls="marketplace-tabpanel-0" />
            <Tab label="Tokopedia" id="marketplace-tab-1" aria-controls="marketplace-tabpanel-1" />
            <Tab label="TikTok Shop" id="marketplace-tab-2" aria-controls="marketplace-tabpanel-2" />
            {/* Tambahkan Tab untuk marketplace lain jika perlu */}
          </Tabs>
        </Box>
        <TabPanel value={selectedTab} index={0}>
          {renderSettingsForm("shopee")}
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          {renderSettingsForm("tokopedia")}
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          {renderSettingsForm("tiktok")}
        </TabPanel>
         {/* Tambahkan TabPanel untuk marketplace lain */}
      </Paper>
    </Box>
  );
}

export default MarketplaceSettings;