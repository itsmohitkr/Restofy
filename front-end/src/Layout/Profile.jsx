import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Stack,
  Grid,
  Paper,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { getProfile } from "../utils/api";

function Profile() {
  const { authState } = useContext(AuthContext);
  const email = authState.user;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal; 

    const fetchProfile = async () => {
      if (!email) return;
      setLoading(true);

      try {
        const res = await getProfile(signal);
        res.data?setProfile(res.data):setProfile(null);
      } catch (error) {
        setProfile(null);
        console.error("Error fetching profile:", error);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [email]);

  const displayValue = (value) => (value ? value : <span style={{ color: "#b0b0b0" }}>Missing</span>);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 6 }, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Profile
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              First Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {displayValue(profile?.firstName)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Last Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {displayValue(profile?.lastName)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {displayValue(profile?.email)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Phone Number
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {displayValue(profile?.phoneNumber)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Role
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {displayValue(profile?.role)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Verified
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {profile?.isVerified ? "Yes" : "No"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Active
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {profile?.isActive ? "Active" : "Inactive"}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <HomeIcon color="action" />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Address
          </Typography>
        </Stack>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Street
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {displayValue(profile?.address?.street)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              City
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {displayValue(profile?.address?.city)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              State
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {displayValue(profile?.address?.state)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Country
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {displayValue(profile?.address?.country)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Pin Code
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {displayValue(profile?.address?.pinCode)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Landmark
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {displayValue(profile?.address?.landmark)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default Profile;