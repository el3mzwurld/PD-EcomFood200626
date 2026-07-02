import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/landing";
import Restaurants from "../pages/restaurants";
import Menu from "../pages/menu";
import Checkout from "../pages/checkout";
import Authenticator from "../pages/authentication";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />}></Route>
      <Route path="/restaurants" element={<Restaurants />}></Route>
      <Route path="/restaurant/:id" element={<Menu />}></Route>
      <Route path="/restaurant/checkout/:id" element={<Checkout />}></Route>
      <Route path="/auth" element={<Authenticator />}></Route>
    </Routes>
  );
};
