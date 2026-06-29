import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/landing";
import Restaurants from "../pages/restaurants";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />}></Route>
      <Route path="/restaurants" element={<Restaurants />}></Route>
    </Routes>
  );
};
