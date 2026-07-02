import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { CartProvider } from "./assets/context/cartContext.tsx";
import { LocationProvider } from "./assets/context/locationContext";
import { UserProvider } from "./assets/context/userContext";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { RestaurantProvider } from "./assets/context/restaurantContext.tsx";
import "./assets/styles/global.css";
import theme from "./assets/theme/theme.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LocationProvider>
        <RestaurantProvider>
          <CartProvider>
            <UserProvider>
              <ThemeProvider theme={theme}>
                <App />
              </ThemeProvider>
            </UserProvider>
          </CartProvider>
        </RestaurantProvider>
      </LocationProvider>
    </BrowserRouter>
  </StrictMode>,
);
