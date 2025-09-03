import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useParams, useNavigate } from "react-router-dom";
import { RestaurantContext } from "../Context/RestaurantContext";
import axios from "axios";

function ViewOrder() {
  const { reservationId } = useParams();
  const { selectedRestaurant } = useContext(RestaurantContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [menuItemsMap, setMenuItemsMap] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [bill, setBill] = useState(null);
  const navigate = useNavigate();

  // Fetch order and menu items
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch the latest order for this reservation
        const orderRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/reservations/${reservationId}/order`,
          { withCredentials: true }
        );
        const fetchedOrder = orderRes.data.data[0] || null;
        setOrder(fetchedOrder);

        // Fetch all menu items for name lookup
        const menuRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/menu`,
          { withCredentials: true }
        );
        const menuId = menuRes.data.data.id;
        const itemsRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/menu/${menuId}/menuItem`,
          { withCredentials: true }
        );
        const map = {};
        (itemsRes.data.data || []).forEach((item) => {
          map[item.id] = item.itemName;
        });
        setMenuItemsMap(map);

        // If order is billed or paid, fetch the bill
        if (fetchedOrder && (fetchedOrder.status === "Billed" || fetchedOrder.status === "Paid")) {
          try {
            const billRes = await axios.get(
              `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/reservations/${reservationId}/order/${fetchedOrder.id}/bill`,
              { withCredentials: true }
            );
            // If your API returns an array, use the latest bill
            const billData = Array.isArray(billRes.data.data)
              ? billRes.data.data[billRes.data.data.length - 1]
              : billRes.data.data;
            setBill(billData);
          } catch {
            setBill(null);
          }
        } else {
          setBill(null);
        }
      } catch (err) {
        setOrder(null);
        setError("Failed to fetch order details.");
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line
  }, [selectedRestaurant, reservationId]);

  // Finalize order handler
  const handleFinalizeOrder = async () => {
    if (!order) return;
    setActionLoading(true);
    setError("");
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/reservations/${reservationId}/order/${order.id}/complete`,
        {},
        { withCredentials: true }
      );
      setOrder((prev) => ({
        ...prev,
        ...res.data.data,
      }));
      setSuccess("Order finalized successfully!");
    } catch (err) {
      setError("Failed to finalize order.");
    }
    setActionLoading(false);
  };

  // Generate bill handler
  const handleGenerateBill = async () => {
    if (!order) return;
    setActionLoading(true);
    setError("");
    try {
      // Generate bill
      const billRes = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/reservations/${reservationId}/order/${order.id}/bill`,
        {},
        { withCredentials: true }
      );
      setOrder((prev) => ({
        ...prev,
        status: "Billed",
      }));
      setBill(billRes.data.data); // Store bill details including bill.id
      setSuccess("Bill generated successfully!");
    } catch (err) {
      setError("Failed to generate bill.");
    }
    setActionLoading(false);
  };

  // Make payment handler
  const handleMakePayment = async () => {
    if (!order || !bill) return;
    setActionLoading(true);
    setError("");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/reservations/${reservationId}/order/${order.id}/bill/${bill.id}/payment`,
        { paymentMethod },
        { withCredentials: true }
      );
      setOrder((prev) => ({
        ...prev,
        status: "Paid",
      }));
      setSuccess("Payment completed successfully!");
      setPaymentDialogOpen(false);
    } catch (err) {
      setError("Failed to process payment.");
    }
    setActionLoading(false);
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!order || !order.orderItems || order.orderItems.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography>No order found for this reservation.</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Back
        </Button>
      </Box>
    );
  }

  const items = order.orderItems;
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Box sx={{ minWidth: 340, maxWidth: 520, mx: "auto", p: 0 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <ReceiptLongIcon color="primary" fontSize="large" />
        <Typography variant="h6" fontWeight={600} color="primary.main">
          Order Summary
        </Typography>
        <Chip
          label={order.status}
          color={
            order.status === "Paid"
              ? "success"
              : order.status === "Billed"
              ? "info"
              : order.status === "Finalized"
              ? "warning"
              : "default"
          }
          size="small"
          sx={{ ml: 2, fontWeight: 600, textTransform: "capitalize" }}
        />
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Order ID:</strong> #{order.id}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Table:</strong> #{order.tableId}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Placed:</strong>{" "}
          {order.placedAt
            ? new Date(order.placedAt).toLocaleString()
            : "-"}
        </Typography>
      </Stack>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          mb: 2,
          boxShadow: "none",
          borderRadius: 2,
        }}
      >
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Item</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Price</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Qty</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Subtotal</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id || item.menuItemId}>
                <TableCell>
                  <Tooltip title={`Menu Item ID: ${item.menuItemId}`}>
                    <span>
                      {item.itemName ||
                        menuItemsMap[item.menuItemId] ||
                        `#${item.menuItemId}`}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell align="right">₹{item.price}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">
                  ₹{item.price * item.quantity}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right">
                <Typography fontWeight={700}>Total</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight={700}>₹{total}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="success.main" sx={{ mb: 2 }}>
          {success}
        </Typography>
      )}
      <Divider sx={{ mb: 2 }} />
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        {order.status === "Open" && (
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={handleFinalizeOrder}
            disabled={actionLoading}
          >
            Finalize Order
          </Button>
        )}
        {order.status === "Finalized" && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<ReceiptIcon />}
            onClick={handleGenerateBill}
            disabled={actionLoading}
          >
            Generate Bill
          </Button>
        )}
        {order.status === "Billed" && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PaymentIcon />}
            onClick={() => setPaymentDialogOpen(true)}
            disabled={actionLoading}
          >
            Make Payment
          </Button>
        )}
        {order.status === "Paid" && (
          <Chip label="Payment Complete" color="success" />
        )}
      </Stack>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)}>
        <DialogTitle>Proceed to Payment</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            <strong>Amount:</strong> ₹{total}
          </Typography>
          <Select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleMakePayment}
            color="success"
            variant="contained"
            disabled={actionLoading}
          >
            Pay
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ViewOrder;
