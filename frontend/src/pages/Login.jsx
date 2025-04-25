//src/pages/Login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  CircularProgress,
  Link,
  Paper,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "../contexts/AuthContext";


const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}auth/login`,
        form
      );
  
      // Ambil data dari respons
      const { token, username, isAdmin } = res.data;
  
      // Gunakan context login
      login(token, { username, isAdmin });
  
      // Redirect setelah login
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(to right, #4F46E5, #8B5CF6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={5}
          sx={{ borderRadius: 2, maxHeight: "calc(100vh - 100px)" }}
        >
          <Box sx={{ p: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}
            >
              Selamat Datang 👋
            </Typography>

            {error && (
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: "error.light",
                  borderLeft: "4px solid",
                  borderColor: "error.main",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" color="error.main">
                  ⚠️ {error}
                </Typography>
              </Box>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                name="username"
                label="Username"
                value={form.username}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                type="password"
                name="password"
                label="Password"
                value={form.password}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                  mb: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">Ingat saya</Typography>}
                />
                <Link
                  href="#"
                  variant="body2"
                  underline="hover"
                  color="primary"
                >
                  Lupa password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  background: "primary.main",
                  "&:hover": {
                    background: "primary.dark",
                  },
                }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress
                      size={20}
                      sx={{ color: "white", mr: 1 }}
                    />
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </Button>

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="body2">
                  Belum punya akun?{" "}
                  <Link href="/register" underline="hover" color="primary">
                    Daftar sekarang
                  </Link>
                </Typography>
              </Box>
            </form>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
