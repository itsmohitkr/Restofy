import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

function RestaurantForm({
  form,
  error,
  onChange,
  onSubmit,
  onCancel,
  submitLabel = "Register",
  isSubmitting = false,
}) {
  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, border: '1px solid #ddd', p: 3, borderRadius: 3 }}>
      <Typography
        variant="h5"
        align="left"
        gutterBottom
        fontWeight={700}
        color="primary.main"
      >
        {submitLabel === "Register" ? "Register Restaurant" : "Edit Restaurant"}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          name="restaurantName"
          label="Restaurant Name"
          placeholder="Your Restaurant Name"
          required
          fullWidth
          size="small"
          value={form.restaurantName}
          onChange={onChange}
        />
        <TextField
          name="restaurantLocation"
          label="Location"
          placeholder="Your Restaurant Location"
          required
          fullWidth
          size="small"
          value={form.restaurantLocation}
          onChange={onChange}
        />
        <TextField
          name="restaurantEmail"
          type="email"
          label="Email"
          placeholder="Your Restaurant Email"
          required
          fullWidth
          size="small"
          value={form.restaurantEmail}
          onChange={onChange}
        />
        <TextField
          name="restaurantPhoneNumber"
          type="tel"
          label="Phone Number"
          placeholder="Phone Number"
          required
          fullWidth
          size="small"
          value={form.restaurantPhoneNumber}
          onChange={onChange}
        />
        <TextField
          name="restaurantDescription"
          label="Description"
          placeholder="Your Restaurant Description"
          multiline
          minRows={2}
          required
          fullWidth
          size="small"
          value={form.restaurantDescription}
          onChange={onChange}
        />
        <TextField
          name="restaurantAddress"
          label="Address"
          placeholder="Your Address"
          required
          fullWidth
          size="small"
          value={form.restaurantAddress}
          onChange={onChange}
        />
        {error && (
          <Typography color="error" variant="body2" align="center">
            {error}
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

export default RestaurantForm;