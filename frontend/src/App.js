//src/App.js

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";

import Dashboard from "./pages/Dashboard";
import InputOrder from "./pages/InputOrder";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import Navbar from "./components/Navbar/Navbar";
import { PublicRoute, PrivateRoute } from "./routes/RouteGuards";

import ThemeProvider from "./contexts/ThemeContext";

function AppContent() {
  const location = useLocation();
  const isAuthPage = ["/login", "/", "/register"].includes(location.pathname);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!isAuthPage && <Navbar />}

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          ...(isAuthPage ? {} : { p: 2, mt: "64px" }),
        }}
      >
        <Routes>
          {/* Public routes with auto redirect if already logged in */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/input-order" element={<InputOrder />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <CssBaseline />
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
