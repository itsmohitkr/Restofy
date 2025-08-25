import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React, { useContext } from 'react'
import Stack from '@mui/material/Stack';
import { Link, Outlet } from 'react-router-dom';
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import SideBar from '../Component/SideBar/SideBar';
import Dashboard from '../Component/MainContent/Dashboard';
import AllRoutes from './AllRoutes';
import { RestaurantContext } from '../Context/RestaurantContext';



function Layout() {
  const { authState, setAuthState } = useContext(AuthContext);
    

  const handleLogout = async() => {
    try {
      // Perform logout logic here
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setAuthState({ user: null, isAuthenticated: false });

    } catch (error) {
      // Handle error
      console.error("Logout error:", error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, height: "100vh", overflow: "hidden" }}>
      <Grid container>
        <Grid
          size={12}
          sx={{
            bgcolor: "grey.100",
            height: "10%",
            overflow: "auto",
            margin: 0,
          }}
        >
          <Box sx={{ p: 0 }}>
            <AppBar position="static" color="transparent">
              <Toolbar>
                <Typography
                  variant="h6"
                  sx={{ flexGrow: 1, fontWeight: "bold" }}
                >
                  Restofy
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Button color="inherit" sx={{ textTransform: "none" }}>
                    <Link
                      to="/"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Home
                    </Link>
                  </Button>
                  <Button color="inherit" sx={{ textTransform: "none" }}>
                    <Link
                      to="/profile"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Profile
                    </Link>
                  </Button>
                  <Button
                    color="inherit"
                    sx={{ textTransform: "none" }}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Stack>
              </Toolbar>
            </AppBar>
          </Box>
        </Grid>
      </Grid>
      <Grid container>
        <Grid
          size={2}
          sx={{
            bgcolor: "grey.300",
            height: "100vh",
            overflow: "auto",
            margin: 0,
          }}
        >
          <Box sx={{ p: 2 }}>
            <SideBar />
          </Box>
        </Grid>
        <Grid
          size={10}
          sx={{
            height: "100vh",
            overflow: "auto",
            bgcolor: "grey.200",
            margin: 0,
          }}
        >
          <Box sx={{ p: 2 }}>
            <Outlet />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Layout