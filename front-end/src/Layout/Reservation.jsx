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
import { Link } from "react-router-dom";
import { RestaurantContext } from "../Context/RestaurantContext";

function Reservation() {
  const [reservations, setReservations] = useState([]);
  const [filterDate, setFilterDate] = useState("");
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

  // Filter reservations by selected date (YYYY-MM-DD)
  const filteredReservations = filterDate
    ? reservations.filter((reservation) =>
        reservation.reservationTime.startsWith(filterDate)
      )
    : reservations;

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
    <Box sx={{ p: 2 }}>
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
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
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
      <TableContainer component={Paper}>
        <Table>
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
                  <TableCell>{reservation.status}</TableCell>
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
