import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/landing";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />}></Route>
    </Routes>
  );
};
