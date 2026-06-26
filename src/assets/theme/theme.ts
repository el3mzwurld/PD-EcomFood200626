import { createTheme } from "styled-components";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF6B35",
      light: "#FF9F5B",
      dark: "#C84A24",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F4A261",
      light: "#FFD6A0",
      dark: "#C0763F",
      contrastText: "#1A1A1A",
    },
    error: {
      main: "#D14343",
      light: "#E47575",
      dark: "#942F2F",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#F2C94C",
      light: "#F9DC7A",
      dark: "#B28D2E",
      contrastText: "#1A1620",
    },
    info: {
      main: "#2A9D8F",
      light: "#6FC3B0",
      dark: "#1E7462",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#4C956C",
      light: "#86B99B",
      dark: "#34614A",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFF8F0",
      paper: "#FFF2E6",
    },
    text: {
      primary: "#1F2937",
      secondary: "#4B5563",
      disabled: "#9CA3AF",
    },
    divider: "#F5C9A9",
    action: {
      active: "#FF6B35",
      hover: "rgba(255, 107, 53, 0.12)",
      selected: "rgba(255, 107, 53, 0.18)",
      disabled: "rgba(44, 44, 45, 0.26)",
      disabledBackground: "rgba(31, 41, 55, 0.08)",
    },
  },
  typography: {
    fontFamily: [
      '"Inter","Open Sans","Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    ].join(","),
    fontSize: 14,
    htmlFontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.25,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.35,
    },
    h5: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.35,
    },
    subtitle1: {
      fontSize: "0.8rem",
      fontWeight: 500,
      lineHeight: 1.75,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: "0.9rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.8rem",
      fontWeight: 400,
      lineHeight: 1.43,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 600,
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: 8,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 1024,
      xl: 1440,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: "8px 20px",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
        variant: "outlined",
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 4px rgba(0,0,0,0.06)",
          borderRadius: 4,
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderBottom: "1px solid #E5E7EB",
          backgroundColor: "#FFFFFF",
          color: "#1A1A1A",
        },
      },
    },
  },
});

export default theme;
