import React, { useState, useContext } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RestaurantContext } from "../Context/RestaurantContext";

const TABLE_TYPES = ["Regular", "VIP", "Outdoor"];

function NewTable() {
  const [form, setForm] = useState({
    tableName: "",
    tableCapacity: "",
    tableType: "Regular",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { selectedRestaurant } = useContext(RestaurantContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "tableCapacity" ? value.replace(/\D/, "") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tableName || !form.tableCapacity) {
      setError("Table name and capacity are required.");
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
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/table`,
        {
          ...form,
          tableCapacity: Number(form.tableCapacity),
          tableStatus: "Available", // Always send as "Available" by default
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.status === 201) {
        setSuccess("Table created successfully!");
        setForm({
          tableName: "",
          tableCapacity: "",
          tableType: "Regular",
        });
        
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data?.message || "Invalid data provided.");
      } else {
        setError("Failed to create table.");
      }
      setSuccess("");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
      }}
    >
      <Card
        sx={{
          p: 4,
          maxWidth: 420,
          width: "100%",
          boxShadow: 6,
          borderRadius: 3,
          bgcolor: "#f5f5f5d7",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          fontWeight={700}
          color="primary.main"
        >
          Create New Table
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box
          component="form"
          onSubmit={handleSubmit}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
          />
          <TextField
            select
            name="tableType"
            label="Table Type"
            required
            fullWidth
            size="small"
            value={form.tableType}
            onChange={handleInputChange}
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
              Create Table
            </Button>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
}

export default NewTable;