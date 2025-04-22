//src/components/Navbar.js

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Sidebar from "../Sidebar/Sidebar";
import ProfileMenu from "./ProfileMenu"; // Import ProfileMenu
import { logout } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleSidebarToggle = () => {
    setOpenSidebar(!openSidebar);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <>
      <AppBar position="sticky" sx={{ zIndex: 1200 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleSidebarToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Logo Perusahaan
          </Typography>

          {/* Profile Icon */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="account"
            onClick={handleProfileMenuOpen}
          >
            <AccountCircleIcon />
          </IconButton>

          {/* Profile Menu */}
          <ProfileMenu
            anchorEl={anchorEl}
            onClose={handleProfileMenuClose}
            onLogout={handleLogout}
          />
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Sidebar
        open={openSidebar}
        onClose={handleSidebarToggle}
        sx={{ zIndex: 1200 }}
      />
    </>
  );
}

export default Navbar;
