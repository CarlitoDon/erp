// src/components/Navbar.js

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Sidebar from "../Sidebar/Sidebar"; // Pastikan path ini benar
import ProfileMenu from "./ProfileMenu";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { logout: contextLogout } = useAuth();

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
    console.log("Navbar handleLogout called");
    handleProfileMenuClose();
    contextLogout(navigate);
  };

  return (
    <>
      {/* AppBar tetap di atas */}
      <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {/* Hapus `display: { sm: 'none' }` dari sx atau hapus sx jika tidak perlu */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleSidebarToggle}
            sx={{ mr: 2 }} // Hanya sisakan margin jika perlu, atau hapus sx={}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Logo Perusahaan
          </Typography>

          <IconButton
            edge="end"
            color="inherit"
            aria-label="account of current user"
            aria-controls="profile-menu-appbar"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
          >
            <AccountCircleIcon />
          </IconButton>

          <ProfileMenu
            id="profile-menu-appbar"
            anchorEl={anchorEl}
            onClose={handleProfileMenuClose}
            onLogout={handleLogout}
          />
        </Toolbar>
      </AppBar>

      {/* Sidebar dirender di sini, dikontrol oleh state openSidebar */}
      <Sidebar
        open={openSidebar}
        onClose={handleSidebarToggle}
        // zIndex sebaiknya diatur di dalam komponen Sidebar jika memungkinkan
      />
    </>
  );
}

export default Navbar;


// //src/components/Navbar.js

// import React, { useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Typography,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import Sidebar from "../Sidebar/Sidebar";
// import ProfileMenu from "./ProfileMenu"; // Import ProfileMenu
// import { logout } from "../../utils/auth";
// import { useNavigate } from "react-router-dom";

// function Navbar() {
//   const [openSidebar, setOpenSidebar] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const navigate = useNavigate();

//   const handleSidebarToggle = () => {
//     setOpenSidebar(!openSidebar);
//   };

//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleProfileMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     logout(navigate);
//   };

//   return (
//     <>
//       <AppBar position="sticky" sx={{ zIndex: 1200 }}>
//         <Toolbar>
//           <IconButton
//             edge="start"
//             color="inherit"
//             aria-label="menu"
//             onClick={handleSidebarToggle}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" sx={{ flexGrow: 1 }}>
//             Logo Perusahaan
//           </Typography>

//           {/* Profile Icon */}
//           <IconButton
//             edge="end"
//             color="inherit"
//             aria-label="account"
//             onClick={handleProfileMenuOpen}
//           >
//             <AccountCircleIcon />
//           </IconButton>

//           {/* Profile Menu */}
//           <ProfileMenu
//             anchorEl={anchorEl}
//             onClose={handleProfileMenuClose}
//             onLogout={handleLogout}
//           />
//         </Toolbar>
//       </AppBar>

//       {/* Sidebar */}
//       <Sidebar
//         open={openSidebar}
//         onClose={handleSidebarToggle}
//         sx={{ zIndex: 1200 }}
//       />
//     </>
//   );
// }

// export default Navbar;
