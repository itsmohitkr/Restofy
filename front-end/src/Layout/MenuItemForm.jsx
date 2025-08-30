import React from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  MenuItem,
  Typography,
} from "@mui/material";

const CATEGORY_OPTIONS = [
  "General",
  "Main Course",
  "Dessert",
  "Beverage",
  "Breakfast",
  "Lunch",
  "Snacks",
  "Dinner",
];

const TYPE_OPTIONS = [
  { value: "Veg", label: "Veg" },
  { value: "Non-Veg", label: "Non-Veg" },
];

const STATUS_OPTIONS = [
  { value: "Available", label: "Available" },
  { value: "Unavailable", label: "Unavailable" },
];

function MenuItemForm({
  form,
  error,
  success,
  onChange,
  onSubmit,
  onCancel,
  submitLabel = "Add Item",
  isSubmitting = false,
}) {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 500,
        mx: "auto",
        mt: 4,
        p: 3,
        border: "1px solid #ddd",
        borderRadius: 3,
        background: "#fff",
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        {submitLabel === "Add Item" ? "New Menu Item" : "Edit Menu Item"}
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          name="itemName"
          label="Item Name"
          required
          fullWidth
          size="small"
          value={form.itemName}
          onChange={onChange}
        />
        <TextField
          name="itemPrice"
          label="Price"
          required
          fullWidth
          size="small"
          type="number"
          inputProps={{ min: 0, step: "0.01" }}
          value={form.itemPrice}
          onChange={onChange}
        />
      </Stack>
      <TextField
        name="itemDescription"
        label="Description"
        fullWidth
        size="small"
        multiline
        minRows={2}
        value={form.itemDescription}
        onChange={onChange}
      />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          select
          name="itemCategory"
          label="Category"
          fullWidth
          size="small"
          value={form.itemCategory}
          onChange={onChange}
        >
          {CATEGORY_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          name="itemType"
          label="Type"
          fullWidth
          size="small"
          value={form.itemType}
          onChange={onChange}
        >
          <MenuItem value="">Select Type</MenuItem>
          {TYPE_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          name="itemStatus"
          label="Status"
          fullWidth
          size="small"
          value={form.itemStatus}
          onChange={onChange}
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="success.main" variant="body2">
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
  );
}

export default MenuItemForm;