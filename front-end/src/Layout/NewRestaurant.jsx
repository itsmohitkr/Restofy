import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NewRestaurant() {

  const [form, setForm] = useState({
    restaurantName: "",
    restaurantLocation: "",
    restaurantEmail: "",
    restaurantPhoneNumber: "",
    restaurantDescription: "",
    restaurantAddress: "",
  });
    const [error, setError] = useState("");
    const [setRestaurant] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple validation
    if (!form.restaurantName || !form.restaurantEmail || !form.restaurantPhoneNumber || !form.restaurantLocation || !form.restaurantDescription || !form.restaurantAddress) {
      setError("all fields are required.");
      return;
    }
      setError("");
      try {
        const restaurantData = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants`,
          form,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (restaurantData.status === 201) {
            setRestaurant(restaurantData.data);
            navigate("/");
        }
      } catch (error) {
          if (error.response && error.response.status === 400) {
            setError(error.response.data?.message || "Invalid data provided.");
          }
          else{
              setError("Failed to register restaurant.");
          }
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
          maxWidth: 520,
          width: "100%",
          boxShadow: 6,
          borderRadius: 3,
          bgcolor: "#f5f5f5d7",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          fontWeight={700}
          color="primary.main"
        >
          Register Restaurant
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box
          component="form"
          onSubmit={handleSubmit}
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
            onChange={handleInputChange}
          />
          <TextField
            name="restaurantLocation"
            label="Location"
            placeholder="Your Restaurant Location"
            fullWidth
            size="small"
            value={form.restaurantLocation}
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
          />
          <TextField
            name="restaurantDescription"
            label="Description"
            placeholder="Your Restaurant Description"
            multiline
            minRows={2}
            fullWidth
            size="small"
            value={form.restaurantDescription}
            onChange={handleInputChange}
          />
          <TextField
            name="restaurantAddress"
            label="Address"
            placeholder="Your Address"
            fullWidth
            size="small"
            value={form.restaurantAddress}
            onChange={handleInputChange}
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
              Register
            </Button>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
}

export default NewRestaurant;
