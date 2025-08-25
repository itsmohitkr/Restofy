import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

function ResetPasswordPage() {
  const [input, setInput] = React.useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  // useParams
  const { resetToken } = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!input.newPassword || !input.confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (input.newPassword !== input.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/auth/reset-password?token=${resetToken}`,
        {
          newPassword: input.newPassword,
          confirmPassword: input.confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response);

      if (response.statusText === "OK") {
        setInput({ newPassword: "", confirmPassword: "" });
        setSuccess("Password reset successfully");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to reset password");
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
          Reset Password
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            id="newPassword"
            type="password"
            name="newPassword"
            label="New Password"
            placeholder="Enter new password"
            autoComplete="new-password"
            fullWidth
            size="small"
            value={input.password}
            onChange={handleInputChange}
          />
          <TextField
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            label="Confirm New Password"
            placeholder="Confirm new password"
            autoComplete="new-password"
            fullWidth
            size="small"
            value={input.confirmPassword}
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

          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            <Link to="/auth/login" variant="body2">
              Login
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default ResetPasswordPage;
