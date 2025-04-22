//src/pages/Register.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  InputAdornment,
  CircularProgress,
  Link,
  Paper,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}auth/register`, form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal register");
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
      <Container maxWidth="sm" sx={{ height: "auto" }}>
        <Paper
          elevation={5}
          sx={{
            borderRadius: 2,
            overflow: "auto",
            maxHeight: "calc(100vh - 100px)",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Box sx={{ flex: 1, p: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{ mb: 3, fontWeight: "bold", color: "#4F46E5" }}
              >
                Daftar Akun Baru
              </Typography>

              {error && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    bgcolor: "rgba(244, 67, 54, 0.08)",
                    borderLeft: "4px solid #f44336",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="error">
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

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    background: "linear-gradient(to right, #4F46E5, #8B5CF6)",
                    "&:hover": {
                      background: "linear-gradient(to right, #4338CA, #7C3AED)",
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
                    "Daftar"
                  )}
                </Button>

                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Typography variant="body2">
                    Sudah punya akun?{" "}
                    <Link href="/login" underline="hover" color="primary">
                      Masuk sekarang
                    </Link>
                  </Typography>
                </Box>
              </form>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
