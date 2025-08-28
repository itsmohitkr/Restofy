import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";

const TABLE_TYPES = ["Regular", "VIP", "Outdoor"];

function TableForm({
  form,
  error,
  success,
  onChange,
  onSubmit,
  onCancel,
  submitLabel = "Create Table",
  isSubmitting = false,
}) {
  return (
    <Box sx={{ maxWidth: 420, mx: "auto", mt: 4 }}>
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        fontWeight={700}
        color="primary.main"
      >
        {submitLabel}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          name="tableName"
          label="Table Name"
          placeholder="e.g. Table 3"
          required
          fullWidth
          size="small"
          value={form.tableName}
          onChange={onChange}
        />
        <TextField
          name="tableCapacity"
          label="Table Capacity"
          placeholder="e.g. 4"
          required
          fullWidth
          size="small"
          type="number"
          inputProps={{ min: 1 }}
          value={form.tableCapacity}
          onChange={onChange}
        />
        <TextField
          select
          name="tableType"
          label="Table Type"
          required
          fullWidth
          size="small"
          value={form.tableType}
          onChange={onChange}
        >
          {TABLE_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
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

export default TableForm;