import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

function ReservationForm({
  form,
  error,
  success,
  onChange,
  onSubmit,
  onCancel,
  submitLabel = "Reserve",
  selectedRestaurant,
  isSubmitting = false,
}) {
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
        {submitLabel === "Reserve" ? "New Reservation" : "Edit Reservation"}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box
        component="form"
        onSubmit={onSubmit}
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
            onChange={onChange}
          />
          <TextField
            name="lastName"
            label="Last Name"
            placeholder="Last Name"
            required
            fullWidth
            size="small"
            value={form.lastName}
            onChange={onChange}
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
            onChange={onChange}
          />
          <TextField
            name="contact"
            label="Contact Number"
            placeholder="Contact Number"
            required
            fullWidth
            size="small"
            value={form.contact}
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
          onChange={onChange}
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
            onClick={onCancel}
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          >
            {submitLabel}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default ReservationForm;