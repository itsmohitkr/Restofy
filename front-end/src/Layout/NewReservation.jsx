import React, { useState, useContext } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RestaurantContext } from "../Context/RestaurantContext";

function NewReservation() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    numberOfGuests: "",
    specialRequests: "",
    reservationTime: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { selectedRestaurant } = useContext(RestaurantContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.contact ||
      !form.numberOfGuests ||
      !form.reservationTime
    ) {
      setError("All fields except special requests are required.");
      setSuccess("");
      return;
    }
    if (!selectedRestaurant) {
      setError("Please select a restaurant first.");
      setSuccess("");
      return;
    }
    setError("");
    try {
      const reservationTimeISO = new Date(form.reservationTime).toISOString();
      const reservationData = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/reservations`,
        {
          ...form,
          numberOfGuests: Number(form.numberOfGuests),
          reservationTime: reservationTimeISO,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (reservationData.status === 201) {
        setSuccess("Reservation created successfully!");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          contact: "",
          numberOfGuests: "",
          specialRequests: "",
          reservationTime: "",
        });
        setTimeout(() => navigate("/reservations"), 1200);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data?.message || "Invalid data provided.");
      } else {
        setError("Failed to create reservation.");
      }
      setSuccess("");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, border: '1px solid #ddd', p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {selectedRestaurant
            ? `For: ${selectedRestaurant.restaurantName}`
            : "No restaurant selected"}
        </Typography>
        <Typography
          variant="h5"
          align="left"
          gutterBottom
          fontWeight={700}
          color="primary.main"
        >
          New Reservation
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              name="firstName"
              label="First Name"
              placeholder="First Name"
              required
              fullWidth
              size="small"
              value={form.firstName}
              onChange={handleInputChange}
            />
            <TextField
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              required
              fullWidth
              size="small"
              value={form.lastName}
              onChange={handleInputChange}
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              name="email"
              type="email"
              label="Email"
              placeholder="Email"
              required
              fullWidth
              size="small"
              value={form.email}
              onChange={handleInputChange}
            />
            <TextField
              name="contact"
              label="Contact Number"
              placeholder="Contact Number"
              required
              fullWidth
              size="small"
              value={form.contact}
              onChange={handleInputChange}
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              name="numberOfGuests"
              label="Number of Guests"
              placeholder="Number of Guests"
              required
              fullWidth
              size="small"
              type="number"
              inputProps={{ min: 1 }}
              value={form.numberOfGuests}
              onChange={handleInputChange}
            />
            <TextField
              name="reservationTime"
              label="Reservation Time"
              type="datetime-local"
              required
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={form.reservationTime}
              onChange={handleInputChange}
            />
          </Stack>
          <TextField
            name="specialRequests"
            label="Special Requests"
            placeholder="Any special requests?"
            multiline
            minRows={2}
            fullWidth
            size="small"
            value={form.specialRequests}
            onChange={handleInputChange}
          />
          {error && (
            <Typography color="error" variant="body2" align="center">
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" variant="body2" align="center">
              {success}
            </Typography>
          )}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              fullWidth
              size="medium"
              sx={{ textTransform: "none", fontWeight: 600 }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="medium"
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Reserve
            </Button>
          </Stack>
        </Box>
      </Box>
    );
}

export default NewReservation;
