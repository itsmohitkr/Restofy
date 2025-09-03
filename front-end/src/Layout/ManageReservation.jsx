import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
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
  const [actionLoading, setActionLoading] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchReservation = async () => {
      if (!selectedRestaurant) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${
            selectedRestaurant.restaurantId
          }/reservations/${reservationId}`,
          { withCredentials: true }
        );
        setReservation(res.data.data);
      } catch (err) {
        setReservation(null);
        console.log(err);
      }
      setLoading(false);
    };
    fetchReservation();
  }, [selectedRestaurant, reservationId]);

  const handleCancelReservation = async () => {
    setActionLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${
          selectedRestaurant.restaurantId
        }/reservations/${reservation.id}/cancel`,
        {},
        { withCredentials: true }
      );
      setReservation((prev) => ({ ...prev, status: "Cancelled" }));
    } catch (err) {
      console.log(err);
    }
    setActionLoading(false);
    setOpenCancelDialog(false);
  };

  const handleDeleteReservation = async () => {
    setActionLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${
          selectedRestaurant.restaurantId
        }/reservations/${reservation.id}`,
        { withCredentials: true }
      );
      navigate("/reservations");
    } catch (err) {
      console.log(err);
    }
    setActionLoading(false);
    setOpenDeleteDialog(false);
  };

  const handleEditReservation = () => {
    navigate(`/reservations/${reservation.id}/manage/edit`);
  };

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
        <Button
          variant="outlined"
          onClick={() => navigate("/reservations")}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
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
        sx={{ mb: 2, textTransform: "none", fontWeight: 600 }}
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
                <AssignmentTurnedInIcon
                  sx={{ mr: 1, verticalAlign: "middle" }}
                />
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
                    Special requests : {reservation.specialRequests || "-"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TableRestaurantIcon fontSize="small" />
                  <Typography variant="body2">
                    Assigned table : {reservation.tableId
                      ? `Table #${reservation.tableId}`
                      : "Not assigned"}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 2, flexWrap: "wrap", justifyContent: "space-around" }}
          >
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEditReservation}
              disabled={actionLoading}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<CancelIcon />}
              onClick={() => setOpenCancelDialog(true)}
              sx={{ textTransform: "none", fontWeight: 600 }}
              disabled={
                reservation.status === "Cancelled" ||
                reservation.status === "Seated" ||
                actionLoading
              }
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setOpenDeleteDialog(true)}
              sx={{ textTransform: "none", fontWeight: 600 }}
              disabled={actionLoading}
            >
              Delete
            </Button>
            {!reservation.tableId && (
              <Button
                variant="contained"
                color="success"
                startIcon={<AssignmentTurnedInIcon />}
                onClick={() =>
                  navigate(`/reservations/${reservation.id}/manage/assign-table`)
                }
                sx={{ textTransform: "none", fontWeight: 600 }}
                disabled={
                  reservation.status === "Cancelled" ||
                  reservation.status === "Seated"
                }
              >
                Assign Table
              </Button>
            )}
            {reservation.tableId && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AssignmentTurnedInIcon />}
                  onClick={() =>
                    navigate(`/reservations/${reservation.id}/manage/take-order`)
                  }
                  sx={{ textTransform: "none", fontWeight: 600 }}
                  disabled={reservation.status === "Cancelled"}
                >
                  Take Order
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  startIcon={<AssignmentTurnedInIcon />}
                  onClick={() =>
                    navigate(`/reservations/${reservation.id}/manage/view-order`)
                  }
                  sx={{ textTransform: "none", fontWeight: 600, ml: 1}}
                  disabled={reservation.status === "Cancelled"}
                >
                  View Order
                </Button>
              </>
            )}
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

        {/* Right: Render child route here */}
        <Box sx={{ flex: 1, minWidth: 320 }}>
          <Outlet context={{ reservation, setReservation }} />
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
            Are you sure you want to cancel this reservation? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenCancelDialog(false)}
            color="primary"
            variant="outlined"
          >
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
            Are you sure you want to delete this reservation? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            color="primary"
            variant="outlined"
          >
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
