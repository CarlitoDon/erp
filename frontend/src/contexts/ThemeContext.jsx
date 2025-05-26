//src/contexts/ThemeContext.js

import { createContext, useMemo, useState } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  alpha,
} from "@mui/material/styles"; // Import alpha
import { grey } from "@mui/material/colors"; // Import grey

export const ThemeContext = createContext();

const colors = {
  primary: "#4F46E5",
  // secondary: "#8B5CF6", // Tidak dipakai langsung di palette lagi, tapi bisa disimpan
  error: "#f44336",
  backgroundLight: "#f9fafb",
  backgroundDark: "#121212",
};

export default function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light");

  const toggleMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: colors.primary,
            contrastText: "#ffffff", // Menambahkan kontras teks untuk primary
          },
          secondary: {
            // Mengganti warna ungu dengan abu-abu
            main: grey[700],
            contrastText: "#ffffff", // Teks putih kontras dengan abu-abu gelap
          },
          error: {
            main: colors.error,
            contrastText: "#ffffff", // Menambahkan kontras teks untuk error
          },
          background: {
            default:
              mode === "light" ? colors.backgroundLight : colors.backgroundDark,
            paper: mode === "light" ? "#ffffff" : "#1e1e1e", // Menambahkan warna kertas
          },
          text: {
            // Sedikit penyesuaian warna teks untuk kontras yang lebih baik
            primary: mode === "light" ? "#1f2937" : "#f9fafb",
            secondary: mode === "light" ? "#6b7280" : "#9ca3af",
          },
          // Menambahkan palet action jika belum ada (digunakan oleh hover)
          action: {
            hoverOpacity: 0.08, // Opacity hover standar MUI
          },
        },
        typography: {
          // === TAMBAHKAN ATAU UBAH BARIS BERIKUT ===
          fontSize: 11, // <--- Ubah angka ini ke ukuran font dasar yang kamu inginkan (misal: 12, 13, 14) // =========================================
          fontFamily: `'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif`,
          button: {
            textTransform: "none",
          },
          h4: {
            fontWeight: "bold",
            color: colors.primary, // h4 tetap pakai warna primer
          },
          body2: {
            fontSize: "0.875rem", // Ini adalah default untuk body2, yang akan relatif terhadap fontSize di atas
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              // Menggunakan fungsi callback untuk styling kondisional
              root: ({ ownerState, theme }) => ({
                borderRadius: 12,
                padding: "10px 20px",
                // Terapkan background gradient hanya untuk tombol primary contained
                ...(ownerState.variant === "contained" &&
                  ownerState.color === "primary" && {
                    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`, // Gradient dari main ke dark
                    color: theme.palette.primary.contrastText,
                    "&:hover": {
                      // Background solid saat hover agar lebih jelas
                      background: theme.palette.primary.dark, // Gunakan warna gelap dari palet primer
                    },
                  }),
                // Style untuk tombol secondary outlined (Tombol Cancel)
                ...(ownerState.variant === "outlined" &&
                  ownerState.color === "secondary" && {
                    borderColor: theme.palette.secondary.main, // Border abu-abu
                    color: theme.palette.secondary.main, // Teks abu-abu
                    "&:hover": {
                      backgroundColor: alpha(
                        theme.palette.secondary.main,
                        theme.palette.action.hoverOpacity
                      ), // Background hover abu-abu lembut
                      borderColor:
                        theme.palette.secondary.dark ||
                        theme.palette.secondary.main, // Border hover sedikit lebih gelap jika ada
                      color:
                        theme.palette.secondary.dark ||
                        theme.palette.secondary.main, // Teks hover sedikit lebih gelap jika ada
                    },
                  }),
                // Style untuk tombol error contained (misal: Tombol Delete)
                ...(ownerState.variant === "contained" &&
                  ownerState.color === "error" && {
                    backgroundColor: theme.palette.error.main,
                    color: theme.palette.error.contrastText,
                    "&:hover": {
                      backgroundColor: theme.palette.error.dark, // Warna error lebih gelap saat hover
                    },
                  }),
                // Style untuk tombol primary outlined (jika Anda gunakan)
                ...(ownerState.variant === "outlined" &&
                  ownerState.color === "primary" && {
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: alpha(
                        theme.palette.primary.main,
                        theme.palette.action.hoverOpacity
                      ),
                      borderColor: theme.palette.primary.dark,
                      color: theme.palette.primary.dark,
                    },
                  }),
              }),
            },
          },
          MuiTextField: {
            // Style MuiTextField tetap sama
            defaultProps: {
              variant: "outlined",
              fullWidth: true,
            },
            styleOverrides: {
              root: {
                margin: "8px 0",
              },
            },
          },
          MuiFormControlLabel: {
            // Style MuiFormControlLabel tetap sama
            styleOverrides: {
              label: {
                fontSize: "0.875rem",
              },
            },
          },
          MuiCheckbox: {
            // Style MuiCheckbox tetap sama
            styleOverrides: {
              root: {
                color: colors.primary, // Checkbox tetap pakai warna primer
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
