import React from "react";
import { List, ListItem, ListItemText, ListItemIcon, Collapse, IconButton } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import * as Icons from "@mui/icons-material"; // Import Icons
import { getIcon } from "../../utils/sidebarUtils";

const SidebarMenu = ({ items = [], level = 0, openMenus, toggleMenu, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pl = 2 + level * 2;

  return items.map((item, idx) => {
    const key = item.id || `${item.title}-${level}-${idx}`; // Gunakan id jika tersedia
    const isActive = item.path && location.pathname.startsWith(item.path);

    if (item.children && item.children.length > 0) {
      return (
        <React.Fragment key={key}>
          <ListItem
            button
            onClick={() => {
              toggleMenu(key); // Buka/tutup submenu
              if (item.path) navigate(item.path); // Navigasi jika ada path
              onClose(); // Tutup sidebar jika diperlukan
            }}
            selected={isActive}
            sx={{
              pl,
              color: "text.primary", // Gunakan warna teks default
              cursor: "pointer", // Pastikan kursor menjadi pointer
              ...(isActive && { bgcolor: "action.selected" }),
            }}
          >
            {getIcon(item.icon) && <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>}
            <ListItemText primary={item.title} />
            {/* Expand/Collapse Icon */}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation(); // Prevent parent click event
                toggleMenu(key);
              }}
            >
              {openMenus[key] ? <Icons.ExpandLess /> : <Icons.ExpandMore />}
            </IconButton>
          </ListItem>
          <Collapse in={openMenus[key]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <SidebarMenu
                items={item.children}
                level={level + 1}
                openMenus={openMenus}
                toggleMenu={toggleMenu}
                onClose={onClose}
              />
            </List>
          </Collapse>
        </React.Fragment>
      );
    }

    return (
      <ListItem
        key={key}
        button
        onClick={() => {
          navigate(item.path);
          onClose();
        }}
        selected={location.pathname === item.path}
        sx={{
          pl,
          color: "text.primary", // Gunakan warna teks default
          cursor: "pointer", // Pastikan kursor menjadi pointer
          ...(location.pathname === item.path && { bgcolor: "action.selected" }),
        }}
      >
        {getIcon(item.icon) && <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>}
        <ListItemText primary={item.title} />
      </ListItem>
    );
  });
};

export default SidebarMenu;