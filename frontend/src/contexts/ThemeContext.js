//src/contexts/ThemeContext.js

import { createContext, useMemo, useState } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

export const ThemeContext = createContext();

const colors = {
  primary: "#4F46E5",
  secondary: "#8B5CF6",
  error: "#f44336",
  backgroundLight: "#f9fafb",
  backgroundDark: "#121212",
};

export default function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light");

  const toggleMode = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: colors.primary,
          },
          secondary: {
            main: colors.secondary,
          },
          error: {
            main: colors.error,
          },
          background: {
            default: mode === "light" ? colors.backgroundLight : colors.backgroundDark,
          },
          text: {
            primary: mode === "light" ? "#000000" : "#ffffff", // Warna teks untuk light/dark mode
            secondary: mode === "light" ? "#6b7280" : "#d1d5db", // Warna teks sekunder
          },
        },
        typography: {
          fontFamily: `'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif`,
          button: {
            textTransform: "none",
          },
          h4: {
            fontWeight: "bold",
            color: colors.primary,
          },
          body2: {
            fontSize: "0.875rem",
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                padding: "10px 20px",
                background: "linear-gradient(to right, #4F46E5, #8B5CF6)",
                "&:hover": {
                  background: "linear-gradient(to right,rgb(224, 223, 233),rgb(216, 206, 233))",
                },
              },
            },
          },
          MuiTextField: {
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
            styleOverrides: {
              label: {
                fontSize: "0.875rem",
              },
            },
          },
          MuiCheckbox: {
            styleOverrides: {
              root: {
                color: colors.primary,
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
