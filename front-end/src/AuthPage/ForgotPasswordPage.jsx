import React, {  useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

function ForgotPasswordPage() {
  const [input, setInput] = useState({ email: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!input.email || !/^\S+@\S+\.\S+$/.test(input.email)) {
      setError("Email is required");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`,
        { email: input.email },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response);

      if (response.statusText === "OK") {
          setInput({ email: "" });
          setSuccess("Password reset link sent successfully");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to send password reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5d7",
      }}
    >
      <Card
        variant="outlined"
        sx={{ p: 4, width: { xs: "90%", sm: "400px" }, boxShadow: 3 }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 6, textAlign: "center" }}
        >
          Resto-fy
        </Typography>
        <Typography
          variant="h5"
          component="h1"
          sx={{ mb: 2, textAlign: "left" }}
        >
          Forgot Password
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            id="email"
            type="email"
            name="email"
            label="Email"
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            fullWidth
            size="small"
            value={input.email}
            onChange={handleInputChange}
          />
          {error ? (
            <Typography color="error" variant="body2" sx={{ mt: -1 }}>
              {error}
            </Typography>
          ) : success ? (
            <Typography color="success" variant="body2" sx={{ mt: -1 }}>
              {success}
            </Typography>
          ) : null}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 1, mb: 1 }}
            fullWidth
            size="medium"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Reset Password"
            )}
          </Button>
        </Box>
      </Card>
    </Box>
  );
}

export default ForgotPasswordPage;
