import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";

function SignupPage() {
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Simple client-side validation
  const validate = () => {
    if (!input.firstName || input.firstName.length < 2)
      return "First name is required and must be at least 2 characters.";
    if (!input.lastName || input.lastName.length < 2)
      return "Last name is required and must be at least 2 characters.";
    if (!input.email || !/^\S+@\S+\.\S+$/.test(input.email))
      return "Valid email is required.";
    if (!input.phoneNumber || !/^[0-9]{10}$/.test(input.phoneNumber))
      return "Phone number must be exactly 10 digits.";
    if (!input.password || input.password.length < 6)
      return "Password must be at least 6 characters.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response);

      if (response.statusText === "Created") {
        setInput({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
        });
        navigate("/auth/login");
      }
    } catch (error) {
      console.log(error);

      setError(
        "An unexpected error occurred, while signing up. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
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
          Sign up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            name="firstName"
            label="First Name"
            fullWidth
            size="small"
            value={input.firstName}
            onChange={handleInputChange}
          />
          <TextField
            name="lastName"
            label="Last Name"
            fullWidth
            size="small"
            value={input.lastName}
            onChange={handleInputChange}
          />
          <TextField
            name="email"
            type="email"
            label="Email"
            fullWidth
            size="small"
            value={input.email}
            onChange={handleInputChange}
          />
          <TextField
            name="phoneNumber"
            label="Phone Number"
            fullWidth
            size="small"
            value={input.phoneNumber}
            onChange={handleInputChange}
          />
          <TextField
            name="password"
            type="password"
            label="Password"
            fullWidth
            size="small"
            value={input.password}
            onChange={handleInputChange}
          />

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: -1 }}>
              {error}
            </Typography>
          )}
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
              "Sign up"
            )}
          </Button>
          <Divider>or</Divider>
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            <Link to="/auth/login">Already have an account? Sign in</Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default SignupPage;
