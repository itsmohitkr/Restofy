import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  CircularProgress,
  Paper,
} from "@mui/material";
// Charts removed — no chart library imports

function DashboardAnalytics({ restaurant }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!restaurant) return;
    setLoading(true);
    // Simulate API call for analytics data
    setTimeout(() => {
      setAnalytics({
        totalReservations: 2340,
        reservationsToday: 12,
        reservationsThisMonth: 320,
        totalRevenue: 120000,
        revenueThisMonth: 15000,
        avgPartySize: 4.2,
        peakHour: "7:00 PM - 8:00 PM",
        mostPopularMenuItem: "Paneer Tikka",
        cancelledReservations: 23,
        noShows: 8,
        tableUtilization: 76, // percent
  // ...removed duplicate small topCustomers; fuller list provided below
        // Simulated reservation trend data for the chart
        reservationTrends: [
          { date: "2025-08-01", reservations: 8 },
          { date: "2025-08-02", reservations: 12 },
          { date: "2025-08-03", reservations: 10 },
          { date: "2025-08-04", reservations: 15 },
          { date: "2025-08-05", reservations: 9 },
          { date: "2025-08-06", reservations: 14 },
          { date: "2025-08-07", reservations: 18 },
        ],
        revenueTrends: [
          { date: "2025-08-01", revenue: 1200 },
          { date: "2025-08-02", revenue: 1600 },
          { date: "2025-08-03", revenue: 900 },
          { date: "2025-08-04", revenue: 2200 },
          { date: "2025-08-05", revenue: 1500 },
          { date: "2025-08-06", revenue: 2400 },
          { date: "2025-08-07", revenue: 3000 },
        ],
        cancellationsBreakdown: [
          { name: "Cancelled", value: 23 },
          { name: "No-shows", value: 8 },
          { name: "Completed (no issue)", value: 2309 },
        ],
        utilizationTrends: [
          { date: "2025-08-01", utilization: 60 },
          { date: "2025-08-02", utilization: 65 },
          { date: "2025-08-03", utilization: 55 },
          { date: "2025-08-04", utilization: 70 },
          { date: "2025-08-05", utilization: 62 },
          { date: "2025-08-06", utilization: 75 },
          { date: "2025-08-07", utilization: 80 },
        ],
        topMenuItems: [
          { item: "Paneer Tikka", orders: 420 },
          { item: "Butter Chicken", orders: 380 },
          { item: "Margherita Pizza", orders: 300 },
          { item: "Caesar Salad", orders: 180 },
        ],
        topCustomers: [
          { name: "Rohan Kumar", visits: 12 },
          { name: "Priya Singh", visits: 10 },
          { name: "Amit Patel", visits: 8 },
          { name: "Sneha Rao", visits: 6 },
        ],
      });
      setLoading(false);
    }, 1000);
  }, [restaurant]);

  if (!restaurant) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">No restaurant selected</Typography>
      </Paper>
    );
  }

  if (loading || !analytics) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Analytics for {restaurant.restaurantName}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {restaurant.restaurantDescription}
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Reservations</Typography>
              <Typography variant="h4">{analytics.totalReservations}</Typography>
              <Typography variant="body2" color="text.secondary">
                Today: {analytics.reservationsToday}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This Month: {analytics.reservationsThisMonth}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h4">₹{analytics.totalRevenue.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">
                This Month: ₹{analytics.revenueThisMonth.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Avg. Party Size</Typography>
              <Typography variant="h4">{analytics.avgPartySize}</Typography>
              <Typography variant="body2" color="text.secondary">
                Peak Hour: {analytics.peakHour}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Table Utilization</Typography>
              <Typography variant="h4">{analytics.tableUtilization}%</Typography>
              <Typography variant="body2" color="text.secondary">
                Most Popular: {analytics.mostPopularMenuItem}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cancellations & No-shows
              </Typography>
              <Typography variant="body2">
                Cancelled Reservations: <b>{analytics.cancelledReservations}</b>
              </Typography>
              <Typography variant="body2">
                No-shows: <b>{analytics.noShows}</b>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Customers
              </Typography>
              {analytics.topCustomers.map((customer, idx) => (
                <Typography key={idx} variant="body2">
                  {customer.name} — {customer.visits} visits
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </Box>
  );
}

export default DashboardAnalytics