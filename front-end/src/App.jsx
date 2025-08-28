import React, { useContext, Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { AuthContext } from "./Context/AuthContext";
import "./App.css";
import Restaurant from "./Layout/Restaurant";

// Lazy load route components for better performance
const ResetPasswordPage = lazy(() => import("./AuthPage/ResetPasswordPage"));
const ForgotPasswordPage = lazy(() => import("./AuthPage/ForgotPasswordPage"));
const LoginPage = lazy(() => import("./AuthPage/LoginPage"));
const SignupPage = lazy(() => import("./AuthPage/SignupPage"));
const Layout = lazy(() => import("./Layout/Layout"));
const Dashboard = lazy(() => import("./Component/MainContent/Dashboard"));
const NewRestaurant = lazy(() => import("./Layout/NewRestaurant"));
const NewTable = lazy(() => import("./Layout/NewTable"));
const NewReservation = lazy(() => import("./Layout/NewReservation"));
const Reservation = lazy(() => import("./Layout/Reservation"));
const MenuItems = lazy(() => import("./Layout/MenuItems"));
const Tables = lazy(() => import("./Layout/Tables"));
const EditRestaurant = lazy(() => import("./Layout/EditRestaurant"));
const EditTable = lazy(() => import("./Layout/EditTable"));
const ManageReservation = lazy(() => import("./Layout/ManageReservation"));

const NotFound = () => (
  <Box sx={{ p: 4, textAlign: "center" }}>
    <h2>404 - Page Not Found</h2>
  </Box>
);

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
    <Suspense
      fallback={
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      }
    >
      <Routes>
        {/* Auth routes */}
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

        {/* Protected app routes */}
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
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="new-restaurant" element={<NewRestaurant />} />
          <Route path="new-reservation" element={<NewReservation />} />
          <Route path="reservations" element={<Reservation />} />
          <Route path="reservations/:reservationId/manage" element={<ManageReservation />} />
          <Route path="restaurant" element={<Restaurant />} />
          <Route path="edit-restaurant/:restaurantId" element={<EditRestaurant />} />
          <Route path="menu-items" element={<MenuItems />} />
          <Route path="new-table" element={<NewTable />} />
          <Route path="tables" element={<Tables />} />
          <Route path="edit-table/:tableId" element={<EditTable />} />
        </Route>

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
