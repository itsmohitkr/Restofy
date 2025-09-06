import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Checkbox,
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useOutletContext, useNavigate } from "react-router-dom";
import { RestaurantContext } from "../Context/RestaurantContext";
import axios from "axios";

function TakeOrder() {
  const { reservation } = useOutletContext();
  const { selectedRestaurant } = useContext(RestaurantContext);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!selectedRestaurant) return;
      setLoading(true);
      try {
        const menuRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/menu`,
          { withCredentials: true }
        );
        const menuId = menuRes.data.data.id;
        const itemsRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/menu/${menuId}/menuItem`,
          { withCredentials: true }
        );
        setMenuItems(itemsRes.data.data || []);
      } catch (err) {
        setMenuItems([]);
          setError("Failed to fetch menu items.");
          console.log(err);
      }
      setLoading(false);
    };
    fetchMenuItems();
  }, [selectedRestaurant]);

  const handleToggle = (itemId) => {
    setSelectedItems((prev) =>
      prev[itemId]
        ? (() => {
            const copy = { ...prev };
            delete copy[itemId];
            return copy;
          })()
        : { ...prev, [itemId]: 1 }
    );
  };

  const handleIncrease = (itemId) => {
    setSelectedItems((prev) =>
      prev[itemId]
        ? { ...prev, [itemId]: prev[itemId] + 1 }
        : { ...prev, [itemId]: 1 }
    );
  };

  const handleDecrease = (itemId) => {
    setSelectedItems((prev) =>
      prev[itemId] && prev[itemId] > 1
        ? { ...prev, [itemId]: prev[itemId] - 1 }
        : prev
    );
  };

  const handleConfirm = async () => {
    if (Object.keys(selectedItems).length === 0) return;
    setSubmitting(true);
    setError("");
    setSuccess("");

    let existingOrder = null;
    try {
      // Try to get all orders for this reservation
      const ordersRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/reservations/${reservation.id}/order`,
        { withCredentials: true }
      );
      existingOrder = (ordersRes.data.data && ordersRes.data.data[0]) || null;
    } catch (err) {
      // If 404, treat as no existing order
      if (err.response?.status === 404) {
        existingOrder = null;
      } else {
        setError("Failed to check existing orders.");
        setSubmitting(false);
        return;
      }
    }

    const orderItems = Object.entries(selectedItems).map(
      ([menuItemId, quantity]) => ({
        menuItemId: Number(menuItemId),
        quantity,
      })
    );

    try {
      if (existingOrder && existingOrder.status === "Open") {
        // Update open order
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/reservations/${reservation.id}/order/${existingOrder.id}`,
          { orderItems },
          { withCredentials: true }
        );
        setSuccess("Order updated successfully!");
      } else if (!existingOrder) {
        // Create new order
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/reservations/${reservation.id}/order`,
          { orderItems },
          { withCredentials: true }
        );
        setSuccess("Order placed successfully!");
      } else {
        setError("Cannot create or update order. Existing order is not open.");
        setSubmitting(false);
        return;
      }
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to place/update order. Please try again."
      );
    }
    setSubmitting(false);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ minWidth: 320, height: '75vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Take Order
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4, flex: 1 }}>
          <CircularProgress />
        </Box>
      ) : menuItems.length === 0 ? (
        <Typography color="text.secondary">No menu items available.</Typography>
      ) : (
        <>
          <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', mb: 2 }}>
            <List>
              {menuItems.map((item) => {
                const isChecked = !!selectedItems[item.id];
                return (
                  <ListItem
                    key={item.id}
                    divider
                    sx={{ alignItems: "center" }}
                  >
                    <Checkbox
                      edge="start"
                      checked={isChecked}
                      onChange={() => handleToggle(item.id)}
                      tabIndex={-1}
                      sx={{ mr: 2 }}
                    />
                    <ListItemText
                      primary={`${item.itemName} - ₹${item.itemPrice}`}
                      secondary={item.itemDescription}
                    />
                    {isChecked && (
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ ml: 2 }}
                      >
                        <Typography variant="body2" sx={{ minWidth: 80 }}>
                          Qty: {selectedItems[item.id]}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleDecrease(item.id)}
                          edge="end"
                          sx={{ ml: 0.5 }}
                          disabled={selectedItems[item.id] <= 1}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleIncrease(item.id)}
                          edge="end"
                          sx={{ ml: 0.5 }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    )}
                  </ListItem>
                );
              })}
            </List>
          </Box>
          <Typography sx={{ mt: 1 }}>
            <strong>Selected Items:</strong> {Object.keys(selectedItems).length}
          </Typography>
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" sx={{ mt: 1 }}>
              {success}
            </Typography>
          )}
          <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirm}
              disabled={Object.keys(selectedItems).length === 0 || submitting}
            >
              {submitting ? "Placing Order..." : "Confirm Order"}
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
}

export default TakeOrder;