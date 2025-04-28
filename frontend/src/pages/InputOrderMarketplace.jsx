import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, Paper, Tabs, Tab, Typography } from "@mui/material";

const tabs = [
  { label: "Shopee", path: "shopee" },
  { label: "Tokopedia", path: "tokopedia" },
  { label: "TikTok Shop", path: "tiktokshop" },
];

function InputOrderMarketplace() {
  const location = useLocation();
  const navigate = useNavigate();

  // Handle active tab berdasarkan URL path
  const currentTab = tabs.findIndex((tab) =>
    location.pathname.includes(tab.path)
  );
  const [tabIndex, setTabIndex] = useState(currentTab !== -1 ? currentTab : 0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
    navigate(tabs[newValue].path);
  };

  // Load Shopee tab automatically if it's not already in the URL
  useEffect(() => {
    if (currentTab === -1) {
      navigate(tabs[0].path); // Navigasi ke Shopee jika tidak ada path yang cocok
    }
  }, [currentTab, navigate]);

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Input Order Marketplace
      </Typography>

      {/* Tabs */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab) => (
            <Tab key={tab.path} label={tab.label} />
          ))}
        </Tabs>
      </Paper>

      {/* Content Container */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Outlet />
      </Paper>
    </Box>
  );
}

export default InputOrderMarketplace;
