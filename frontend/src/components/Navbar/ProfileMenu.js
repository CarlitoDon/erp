//src/components/Navbar/ProfileMenu.js
import React from "react";
import { Menu, MenuItem, Divider, ListItemIcon } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";

function ProfileMenu({ anchorEl, onClose, onLogout }) {
  const handleLogoutClick = () => {
     console.log("Logout MenuItem clicked"); // Tambahkan log
     onClose(); // Tutup menu sebelum logout
     onLogout(); // Panggil fungsi logout dari props
  };

  return (
    <Menu
      id="profile-menu-appbar" // ID harus sama dengan aria-controls di Navbar
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      // Opsi positioning tambahan jika perlu
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem component={Link} to="/settings" onClick={onClose}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        Pengaturan
      </MenuItem>
      <Divider />
      {/* Panggil handleLogoutClick atau langsung onLogout jika onClose sudah dihandle di Navbar */}
      <MenuItem onClick={handleLogoutClick}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
}

export default ProfileMenu;