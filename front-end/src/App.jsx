import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { AuthContext } from "./Context/AuthContext";
import ResetPasswordPage from "./AuthPage/ResetPasswordPage";
import ForgotPasswordPage from "./AuthPage/ForgotPasswordPage";
import LoginPage from "./AuthPage/LoginPage";
import SignupPage from "./AuthPage/SignupPage";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Layout from "./Layout/Layout";
import "./App.css";
import Dashboard from "./Component/MainContent/Dashboard";
import NewRestaurant from "./Layout/NewRestaurant";
import NewTable from "./Layout/NewTable";
import NewReservation from "./Layout/NewReservation";
import Reservation from "./Layout/Reservation";
import MenuItems from "./Layout/MenuItems";

function App() {
  const { authState } = useContext(AuthContext);

  if (authState.isLoading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/auth/reset-password/:resetToken"
          element={<ResetPasswordPage />}
        />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/auth/login"
          element={
            authState.isAuthenticated ? <Navigate to="/" /> : <LoginPage />
          }
        />
        <Route
          path="/auth/signup"
          element={
            authState.isAuthenticated ? <Navigate to="/" /> : <SignupPage />
          }
        />
        <Route
          path="/"
          element={
            authState.isAuthenticated ? (
              <Layout />
            ) : (
              <Navigate to="/auth/login" />
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="new-restaurant" element={<NewRestaurant />} />
          <Route path="new-reservation" element={<NewReservation />} />
          <Route path="reservations" element={<Reservation />} />
          <Route path="menu-items" element={<MenuItems />} />
          <Route path="new-table" element={<NewTable />} />
          {/* Add more nested routes here */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
