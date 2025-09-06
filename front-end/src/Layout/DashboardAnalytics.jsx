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
  Chip,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Tooltip,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import PaymentIcon from "@mui/icons-material/Payment";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import axios from "axios";

function DashboardAnalytics({ restaurant }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!restaurant) return;
    setLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${
          restaurant.restaurantId
        }/analytics`,
        { withCredentials: true }
      )
      .then((res) => {
        setAnalytics(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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

  // Helper for status chips
  const statusChip = (status) => (
    <Chip
      label={status}
      color={
        status === "Paid"
          ? "success"
          : status === "Cancelled"
          ? "error"
          : status === "Booked"
          ? "primary"
          : "default"
      }
      size="small"
      sx={{ mr: 1 }}
    />
  );

  // Filter only upcoming reservations (exclude Completed and Seated)
  const upcomingReservations = analytics.reservations.upcoming.filter(
    (r) => r.status === "Booked" || r.status === "Cancelled"
  );

  return (
    <Box sx={{ pb: 4, mb: 8, minHeight: "100vh" }}>
      <Box >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: 600, color: "#2e3b55" }}
      >
        <TrendingUpIcon
          sx={{ mr: 1, verticalAlign: "middle", color: "#43a047" }}
        />
        Restaurant Analytics Dashboard
        </Typography>
      </Box>
      <Box>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2} justifyContent="flex-start">
          {/* Orders */}
          <Grid item xs={12} sm={6} md={2.5}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, minWidth: 180 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <ReceiptLongIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Orders
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, color: "#43a047" }}
                >
                  {analytics.orders.count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total: <b>₹{analytics.orders.totalAmount}</b>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg: ₹{analytics.orders.averageAmount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Max: ₹{analytics.orders.maxAmount} | Min: ₹
                  {analytics.orders.minAmount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Reservations */}
          <Grid item xs={12} sm={6} md={2.5}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, minWidth: 180 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <EventAvailableIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Reservations
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, color: "#43a047" }}
                >
                  {analytics.reservations.count}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {analytics.reservations.statusStats.map((s, idx) => (
                    <Tooltip key={idx} title={s.status}>
                      <Chip
                        label={`${s._count.id} ${s.status}`}
                        color={
                          s.status === "Booked"
                            ? "primary"
                            : s.status === "Completed"
                            ? "success"
                            : s.status === "Cancelled"
                            ? "error"
                            : "default"
                        }
                        size="small"
                        sx={{ mr: 1, fontWeight: 600 }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Tables */}
          <Grid item xs={12} sm={6} md={2.5}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, minWidth: 180 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <TableRestaurantIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Tables
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, color: "#2e3b55" }}
                >
                  {analytics.tables.count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Occupied: <b>{analytics.tables.occupied}</b> | Available:{" "}
                  <b>{analytics.tables.available}</b>
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {analytics.tables.byType.map((t, idx) => (
                    <Chip
                      key={idx}
                      label={`${t.tableType} (${t._count.id})`}
                      color="info"
                      size="small"
                      sx={{ mr: 1, fontWeight: 600 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Menu Items */}
          <Grid item xs={12} sm={6} md={2.5}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, minWidth: 180 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <RestaurantMenuIcon color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Menu Items
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, color: "#d32f2f" }}
                >
                  {analytics.menuItems.count}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {analytics.menuItems.byCategory.map((c, idx) => (
                    <Chip
                      key={idx}
                      label={`${c.itemCategory} (${c._count.id})`}
                      color="secondary"
                      size="small"
                      sx={{ mr: 1, fontWeight: 600 }}
                    />
                  ))}
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Avg Price: ₹{analytics.menuItems.averagePrice?.toFixed(2)}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Max Price: ₹{analytics.menuItems.maxPrice}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Min Price: ₹{analytics.menuItems.minPrice}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Grid container spacing={2}>
          {/* Recent Orders */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Recent Orders
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Placed At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analytics.orders.recent.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{statusChip(order.status)}</TableCell>
                          <TableCell>₹{order.totalAmount}</TableCell>
                          <TableCell>
                            {new Date(order.placedAt).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          {/* Upcoming Reservations (Booked/Cancelled only) */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Upcoming Reservations
                </Typography>
                <List>
                  {upcomingReservations.length === 0 ? (
                    <ListItem>
                      <ListItemText primary="No upcoming reservations" />
                    </ListItem>
                  ) : (
                    upcomingReservations.map((r) => (
                      <ListItem key={r.id} disablePadding>
                        <ListItemText
                          primary={
                            <span>
                              <b>
                                {r.firstName} {r.lastName}
                              </b>{" "}
                              <Chip
                                label={r.status}
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            </span>
                          }
                          secondary={`Guests: ${r.numberOfGuests} | ${new Date(
                            r.reservationTime
                          ).toLocaleString()}`}
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
          {/* Payments */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <PaymentIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Payments by Method
                  </Typography>
                </Box>
                <List>
                  {analytics.payments.byMethod.map((p, idx) => (
                    <ListItem key={idx} disablePadding>
                      <ListItemText
                        primary={
                          <span>
                            <Chip
                              label={p.method}
                              color="primary"
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            ₹{p._sum.amount}
                          </span>
                        }
                        secondary={`Count: ${p._count.id}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          {/* Bills */}
          {/* Bills */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Bills by Status
                </Typography>
                <List>
                  {analytics.bills.byStatus.map((b, idx) => (
                    <ListItem key={idx} disablePadding>
                      <ListItemText
                        primary={
                          <span>
                            <Chip
                              label={b.status}
                              color="success"
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            ₹{b._sum.totalAmount}
                          </span>
                        }
                        secondary={`Count: ${b._count.id}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default DashboardAnalytics;
