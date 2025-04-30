import React, { useCallback, memo } from "react";
import {
  List,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton,
  ListItemButton, // <-- Import ListItemButton
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import * as Icons from "@mui/icons-material";
import { getIcon } from "../../utils/sidebarUtils";
import routes from "../../routes/routes";

const SidebarMenu = memo(
  ({ items = routes, level = 0, openMenus, toggleMenu, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const pl = 2 + level * 2;

    const handleItemClick = useCallback(
      (key, path) => {
        const shouldNavigate = path && location.pathname !== path;

        if (shouldNavigate) {
          navigate(path);
        }

        if (onClose) {
          if (shouldNavigate) {
            setTimeout(() => {
              onClose();
            }, 50);
          } else {
            onClose();
          }
        }

        if (!path && toggleMenu) {
          toggleMenu(key);
        }
      },
      [navigate, location.pathname, toggleMenu, onClose]
    );

    const handleExpandClick = (e, key) => {
      e.stopPropagation();
      toggleMenu(key);
    };

    return items.map((item, idx) => {
      const key = item.id || `${item.component}-${level}-${idx}`;
      const isActive = item.path && location.pathname.startsWith(item.path);

      if (item.children && item.children.length > 0) {
        return (
          <React.Fragment key={key}>
            <ListItemButton // <-- Ganti ListItem dengan ListItemButton
              onClick={() => handleItemClick(key, item.path)}
              selected={isActive}
              sx={{
                pl,
                color: "text.primary",
                cursor: "pointer",
                ...(isActive && { bgcolor: "action.selected" }),
              }}
            >
              {getIcon(item.icon) && (
                <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>
              )}
              <ListItemText
                primary={item.title || item.component || "Untitled"}
              />
              <IconButton
                size="small"
                onClick={(e) => handleExpandClick(e, key)}
              >
                {openMenus[key] ? <Icons.ExpandLess /> : <Icons.ExpandMore />}
              </IconButton>
            </ListItemButton> {/* <-- Tutup ListItemButton */}
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
        <ListItemButton // <-- Ganti ListItem dengan ListItemButton
          key={key}
          onClick={() => handleItemClick(key, item.path)}
          selected={location.pathname === item.path}
          sx={{
            pl,
            color: "text.primary",
            cursor: "pointer",
            ...(location.pathname === item.path && {
              bgcolor: "action.selected",
            }),
          }}
        >
          {getIcon(item.icon) && (
            <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>
          )}
          <ListItemText
            primary={item.title || item.component || "Untitled"}
          />
        </ListItemButton> // <-- Tutup ListItemButton
      );
    });
  }
);

export default SidebarMenu;