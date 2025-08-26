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
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CancelIcon from "@mui/icons-material/Cancel";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { RestaurantContext } from "../Context/RestaurantContext";

function Reservation() {
  const [reservations, setReservations] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [tables, setTables] = useState([]);
  const [assignTableId, setAssignTableId] = useState({});
  const { selectedRestaurant } = useContext(RestaurantContext);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        if (!selectedRestaurant) return;
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/reservations`,
          { withCredentials: true }
        );
        setReservations(res.data.data || []);
      } catch (err) {
        setReservations([]);
      }
    };
    fetchReservations();
  }, [selectedRestaurant]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        if (!selectedRestaurant) return;
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/tables`,
          { withCredentials: true }
        );
        setTables(res.data.data || []);
      } catch (err) {
        setTables([]);
      }
    };
    fetchTables();
  }, [selectedRestaurant]);

  const handleDelete = async (reservationId) => {
    if (!selectedRestaurant) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/reservations/${reservationId}`,
        { withCredentials: true }
      );
      setReservations((prev) =>
        prev.filter((reservation) => reservation.id !== reservationId)
      );
    } catch (err) {
      console.error("Error deleting reservation:", err);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!selectedRestaurant) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/reservations/${reservationId}/cancel`,
        {},
        { withCredentials: true }
      );
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === reservationId
            ? { ...reservation, status: "Cancelled" }
            : reservation
        )
      );
    } catch (err) {
      console.error("Error cancelling reservation:", err);
    }
  };

  const handleEdit = (reservationId) => {
    // Implement your edit logic here, e.g., navigate to an edit page or open a dialog
    alert(`Edit reservation with ID: ${reservationId}`);
  };

  const handleAssignTable = async (reservationId) => {
    if (!selectedRestaurant || !assignTableId[reservationId]) return;
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/reservations/${reservationId}/assign-table`,
        { tableId: assignTableId[reservationId] },
        { withCredentials: true }
      );
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === reservationId
            ? { ...reservation, tableId: assignTableId[reservationId] }
            : reservation
        )
      );
    } catch (err) {
      console.error("Error assigning table:", err);
    }
  };

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
                <strong>Edit</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Cancel</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Delete</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Assign Table</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center">
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
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(reservation.id)}
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="warning"
                      onClick={() => handleCancelReservation(reservation.id)}
                      aria-label="cancel"
                      disabled={reservation.status === "Cancelled"}
                    >
                      <CancelIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(reservation.id)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      select
                      size="small"
                      value={assignTableId[reservation.id] || ""}
                      onChange={(e) =>
                        setAssignTableId((prev) => ({
                          ...prev,
                          [reservation.id]: e.target.value,
                        }))
                      }
                      sx={{ minWidth: 100 }}
                      disabled={reservation.status === "Cancelled"}
                    >
                      <MenuItem value="">Select Table</MenuItem>
                      {tables.map((table) => (
                        <MenuItem key={table.id} value={table.id}>
                          Table #{table.id}
                        </MenuItem>
                      ))}
                    </TextField>
                    <IconButton
                      color="success"
                      onClick={() => handleAssignTable(reservation.id)}
                      aria-label="assign"
                      disabled={
                        !assignTableId[reservation.id] ||
                        reservation.status === "Cancelled"
                      }
                    >
                      <AssignmentIcon />
                    </IconButton>
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