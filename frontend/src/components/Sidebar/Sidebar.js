// src/components/Sidebar/Sidebar.js

import React, { useEffect, useRef, useState, useContext, useMemo } from "react";
import {
  Drawer,
  List,
  IconButton,
  Avatar,
  Divider,
  Box,
  useTheme,
} from "@mui/material";
import * as Icons from "@mui/icons-material";
import sidebarItems from "../../config/sidebar-list";
import { ThemeContext } from "../../contexts/ThemeContext"; // Import ThemeContext
import SidebarMenu from "./SidebarMenu"; // Import SidebarMenu

const SIDEBAR_WIDTH = 240; // Define constant for sidebar width

export default function Sidebar({ open, onClose }) {
  const drawerRef = useRef(null);
  const theme = useTheme();
  const { mode, toggleMode } = useContext(ThemeContext); // Access theme context
  const [openMenus, setOpenMenus] = useState({});

  // Memoize filteredSidebarItems to prevent unnecessary re-renders
  const filteredSidebarItems = useMemo(
    () => sidebarItems.filter((item) => item.showInSidebar !== false),
    []
  );

  // Close sidebar if clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) onClose();
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  const toggleMenu = (key) =>
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      ref={drawerRef}
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
          borderRight: "none",
          zIndex: theme.zIndex.drawer + 1,
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ mr: 1 }} />
            <span>Nama Pengguna</span>
          </Box>
          <IconButton onClick={onClose}>
            <Icons.Close />
          </IconButton>
        </Box>
        <Divider />

        {/* Sidebar Menu */}
        <List sx={{ flexGrow: 1 }}>
          {filteredSidebarItems && filteredSidebarItems.length > 0 ? (
            <SidebarMenu
              items={filteredSidebarItems} // Use memoized items
              openMenus={openMenus}
              toggleMenu={toggleMenu}
              onClose={onClose}
            />
          ) : (
            <Box sx={{ p: 2, textAlign: "center" }}>No menu items available</Box>
          )}
        </List>
        <Divider />

        {/* Dark Mode Toggle */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            p: 2,
          }}
        >
          <IconButton onClick={toggleMode}>
            {mode === "dark" ? <Icons.Brightness7 /> : <Icons.Brightness4 />}
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
}
