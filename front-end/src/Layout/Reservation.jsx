import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { RestaurantContext } from "../Context/RestaurantContext";
import { Chip, Stack, InputAdornment } from "@mui/material";

function getStatusColor(status) {
  switch (status) {
    case "Booked":
      return "primary";
    case "Seated":
      return "info";
    case "Completed":
      return "success";
    case "Cancelled":
      return "error";
    default:
      return "default";
  }
}

function Reservation() {
  const [reservations, setReservations] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedRestaurant } = useContext(RestaurantContext);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        if (!selectedRestaurant) return;
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${
            selectedRestaurant.restaurantId
          }/reservations`,
          { withCredentials: true }
        );
        setReservations(res.data.data || []);
      } catch (err) {
        setReservations([]);
        console.log(err);
      }
    };
    fetchReservations();
  }, [selectedRestaurant]);

  // Real-time search and filter
  const filteredReservations = reservations.filter((r) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      r.firstName?.toLowerCase().includes(term) ||
      r.lastName?.toLowerCase().includes(term) ||
      r.email?.toLowerCase().includes(term) ||
      r.contact?.toLowerCase().includes(term) ||
      r.status?.toLowerCase().includes(term);
    const matchesDate =
      !filterDate || r.reservationTime.startsWith(filterDate);
    return matchesSearch && matchesDate;
  });

  if (!selectedRestaurant) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" align="center">
          Please select a restaurant to view reservations.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, pb:10 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Reservations
        </Typography>
        <Button
          component={Link}
          to="/new-reservation"
          variant="outlined"
          color="primary"
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          + New Reservation
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          justifyContent: "space-between",
        }}
      >
        {/* Filter by date on the left */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CalendarTodayIcon color="action" />
          <TextField
            type="date"
            size="small"
            label="Filter by Date"
            InputLabelProps={{ shrink: true }}
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </Box>
        {/* Search bar on the right */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            size="small"
            label="Search by Name, Email, Phone, Status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 350 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Contact</strong>
              </TableCell>
              <TableCell>
                <strong>Guests</strong>
              </TableCell>
              <TableCell>
                <strong>Reservation Time</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Special Requests</strong>
              </TableCell>
              <TableCell>
                <strong>Table</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No reservations found.
                </TableCell>
              </TableRow>
            ) : (
              filteredReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>
                    {reservation.firstName} {reservation.lastName}
                  </TableCell>
                  <TableCell>{reservation.email}</TableCell>
                  <TableCell>{reservation.contact}</TableCell>
                  <TableCell>{reservation.numberOfGuests}</TableCell>
                  <TableCell>
                    {new Date(reservation.reservationTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={reservation.status}
                      color={getStatusColor(reservation.status)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </TableCell>
                  <TableCell>{reservation.specialRequests || "-"}</TableCell>
                  <TableCell>
                    {reservation.tableId
                      ? `Table #${reservation.tableId}`
                      : "Not assigned"}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      component={Link}
                      to={`/reservations/${reservation.id}/manage`}
                      size="small"
                      sx={{ textTransform: "none", fontWeight: 600 }}
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Reservation;
