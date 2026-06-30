import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/landing";
import Restaurants from "../pages/restaurants";
import Menu from "../pages/menu";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />}></Route>
      <Route path="/restaurants" element={<Restaurants />}></Route>
      <Route path="/restaurant/:id" element={<Menu />}></Route>
    </Routes>
  );
};
