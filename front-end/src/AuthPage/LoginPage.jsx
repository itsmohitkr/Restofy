import React, { useContext, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { AuthContext } from "../Context/AuthContext";

function LoginPage() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuthState } = useContext(AuthContext); // Get setAuthState from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        {
          email: input.email,
          password: input.password,
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
        const { data } = response.data;
        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: true,
          user: data?.email || "",
          isLoading: false,
        }));
        setInput({ email: "", password: "" });
      }
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 401)
      ) {
        setError(error.response.data?.message);
      } else {
        setError(
          "An unexpected error occurred, while logging in. Please try again."
        );
      }
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
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
          Sign in
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
            error={!!error && !input.email}
            helperText={!!error && !input.email ? "Email is required" : ""}
          />
          <TextField
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            label="Password"
            autoComplete="current-password"
            fullWidth
            size="small"
            value={input.password}
            onChange={handleInputChange}
            error={!!error && !input.password}
            helperText={
              !!error && !input.password ? "Password is required" : ""
            }
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
              "Sign in"
            )}
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center" }}>
            <Link to="/auth/forgot-password">Forgot your password?</Link>
          </Typography>
          <Divider>or</Divider>
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            <Link to="/auth/signup">Don't have an account? Sign up</Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default LoginPage;
