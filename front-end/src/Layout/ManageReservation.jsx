import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { RestaurantContext } from "../Context/RestaurantContext";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoIcon from "@mui/icons-material/Info";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import NotesIcon from "@mui/icons-material/Notes";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function ManageReservation() {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const { selectedRestaurant } = useContext(RestaurantContext);

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignMode, setAssignMode] = useState(false);
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState("");
  const [assignError, setAssignError] = useState("");
  const [assignSuccess, setAssignSuccess] = useState("");
  const [loadingTables, setLoadingTables] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchReservation = async () => {
      if (!selectedRestaurant) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/reservations/${reservationId}`,
          { withCredentials: true }
        );
        setReservation(res.data.data);
      } catch (err) {
        setReservation(null);
      }
      setLoading(false);
    };
    fetchReservation();
  }, [selectedRestaurant, reservationId]);

  useEffect(() => {
    if (assignMode && selectedRestaurant) {
      setLoadingTables(true);
      const fetchAvailableTables = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/table`,
            { withCredentials: true }
          );
          setAvailableTables(
            (res.data.data || []).filter(
              (table) => table.tableStatus === "Available"
            )
          );
        } catch (err) {
          setAvailableTables([]);
        }
        setLoadingTables(false);
      };
      fetchAvailableTables();
    }
  }, [assignMode, selectedRestaurant]);

  const handleAssignTable = async () => {
    if (!selectedTableId) {
      setAssignError("Please select a table.");
      setAssignSuccess("");
      return;
    }
    setAssignError("");
    setActionLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/reservations/${reservation.id}/assign-table?tableId=${selectedTableId}`,
        {},
        { withCredentials: true }
      );
      setAssignSuccess("Table assigned successfully!");
      setReservation((prev) => ({
        ...prev,
        tableId: selectedTableId,
        status: "Assigned",
      }));
    } catch (err) {
      setAssignError("Failed to assign table.");
      setAssignSuccess("");
    }
    setActionLoading(false);
  };

  // Show confirmation dialog before cancelling
  const handleCancelReservation = async () => {
    setActionLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/reservations/${reservation.id}/cancel`,
        {},
        { withCredentials: true }
      );
      setReservation((prev) => ({ ...prev, status: "Cancelled" }));
    } catch (err) {}
    setActionLoading(false);
    setOpenCancelDialog(false);
  };

  // Show confirmation dialog before deleting
  const handleDeleteReservation = async () => {
    setActionLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/reservations/${reservation.id}`,
        { withCredentials: true }
      );
      navigate("/reservations");
    } catch (err) {}
    setActionLoading(false);
    setOpenDeleteDialog(false);
  };

  const handleEditReservation = () => {
    alert("Edit reservation feature not implemented.");
  };

  // If loading or reservation not found
  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!reservation) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">Reservation not found.</Typography>
        <Button variant="outlined" onClick={() => navigate("/reservations")}>
          Back to Reservations
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        variant="outlined"
        onClick={() => navigate("/reservations")}
        sx={{ mb: 2 }}
      >
        Back to Reservations
      </Button>
      <Divider sx={{ mb: 2 }} />
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={0}
        sx={{ alignItems: "stretch" }}
      >
        {/* Left: Reservation Details in Card */}
        <Box sx={{ flex: 1, minWidth: 340 }}>
          <Card variant="outlined" sx={{ mb: 2, p: 0 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <AssignmentTurnedInIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Reservation Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon fontSize="small" />
                  <Typography variant="body1" fontWeight={600}>
                    {reservation.firstName} {reservation.lastName}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EmailIcon fontSize="small" />
                  <Typography variant="body2">{reservation.email}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PhoneIphoneIcon fontSize="small" />
                  <Typography variant="body2">{reservation.contact}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <GroupIcon fontSize="small" />
                  <Typography variant="body2">
                    Guests: {reservation.numberOfGuests}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTimeIcon fontSize="small" />
                  <Typography variant="body2">
                    {new Date(reservation.reservationTime).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <InfoIcon fontSize="small" />
                  <Typography variant="body2">
                    Status: {reservation.status}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <NotesIcon fontSize="small" />
                  <Typography variant="body2">
                    {reservation.specialRequests || "-"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TableRestaurantIcon fontSize="small" />
                  <Typography variant="body2">
                    {reservation.tableId
                      ? `Table #${reservation.tableId}`
                      : "Not assigned"}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEditReservation}
              disabled={actionLoading}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<CancelIcon />}
              onClick={() => setOpenCancelDialog(true)}
              disabled={reservation.status === "Cancelled" || actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setOpenDeleteDialog(true)}
              disabled={actionLoading}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<AssignmentTurnedInIcon />}
              onClick={() => setAssignMode(true)}
              disabled={reservation.status === "Cancelled" || assignMode}
            >
              Assign Table
            </Button>
          </Stack>
        </Box>

        {/* Vertical Divider */}
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            mx: 3,
            display: { xs: "none", md: "block" },
            borderRightWidth: 2,
          }}
        />

        {/* Right: Assign Table */}
        <Box sx={{ flex: 1, minWidth: 320 }}>
          {assignMode && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Assign Table
              </Typography>
              {loadingTables ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : availableTables.length === 0 ? (
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  No available tables found.
                </Typography>
              ) : (
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {availableTables.map((table) => (
                    <Card
                      key={table.id}
                      variant="outlined"
                      sx={{
                        minWidth: 160,
                        mb: 2,
                        borderColor:
                          selectedTableId === table.id ? "primary.main" : "grey.300",
                        borderWidth: selectedTableId === table.id ? 2 : 1,
                        cursor: "pointer",
                        boxShadow:
                          selectedTableId === table.id ? 2 : 0,
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onClick={() => setSelectedTableId(table.id)}
                    >
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600}>
                          <TableRestaurantIcon fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
                          {table.tableName}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2">
                          <GroupIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: "middle" }} />
                          Capacity: {table.tableCapacity}
                        </Typography>
                        <Typography variant="body2">
                          <InfoIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: "middle" }} />
                          Type: {table.tableType}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
              {assignError && (
                <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                  {assignError}
                </Typography>
              )}
              {assignSuccess && (
                <Typography color="success.main" variant="body2" sx={{ mb: 1 }}>
                  {assignSuccess}
                </Typography>
              )}
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setAssignMode(false);
                    setSelectedTableId("");
                    setAssignError("");
                    setAssignSuccess("");
                  }}
                  disabled={assignSuccess}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAssignTable}
                  disabled={!selectedTableId || assignSuccess || actionLoading}
                >
                  Confirm Assignment
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      </Stack>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
      >
        <DialogTitle>Cancel Reservation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this reservation? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)} color="primary" variant="outlined">
            No
          </Button>
          <Button
            onClick={handleCancelReservation}
            color="warning"
            variant="contained"
            disabled={actionLoading}
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Reservation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this reservation? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary" variant="outlined">
            No
          </Button>
          <Button
            onClick={handleDeleteReservation}
            color="error"
            variant="contained"
            disabled={actionLoading}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManageReservation;