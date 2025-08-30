import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RestaurantContext } from "../Context/RestaurantContext";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Divider,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

function MenuItems() {
  const { selectedRestaurant } = useContext(RestaurantContext);
  const [menu, setMenu] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  // Fetch menu for the selected restaurant
  useEffect(() => {
    if (!selectedRestaurant) return;
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/menu`,
          { withCredentials: true }
        );
        setMenu(res.data.data);
      } catch (err) {
          setMenu(null);
          console.log(err);
      }
      setLoading(false);
    };
    fetchMenu();
  }, [selectedRestaurant]);

  // Fetch menu items if menu exists
  useEffect(() => {
    if (!menu) {
      setMenuItems([]);
      return;
    }
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/menu/${menu.id}/menuItem`,
          { withCredentials: true }
        );
        setMenuItems(res.data.data || []);
      } catch (err) {
          setMenuItems([]);
          console.log(err);
      }
      setLoading(false);
    };
    fetchMenuItems();
  }, [menu, selectedRestaurant]);

  // Delete menu item
  const handleDeleteMenuItem = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/menu/${menu.id}/menuItem/${itemToDelete}`,
        { withCredentials: true }
      );
      setMenuItems((prev) => prev.filter((item) => item.id !== itemToDelete));
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (err) {
        // Optionally show error
        console.log(err);
    }
    setDeleting(false);
  };

  // Consistent colors
  const mainTextColor = "#374151";
  const labelColor = "#607d8b";

  if (!selectedRestaurant) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" align="center">
          Please select a restaurant to manage menu items.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
        <Typography variant="h5" sx={{ color: mainTextColor, flexGrow: 1 }}>
          {selectedRestaurant.restaurantName
            ? `${selectedRestaurant.restaurantName} Menu Items`
            : "Menu Items"}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/menu-items/new")}
          size="small"
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          New Menu Item
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : !menu ? (
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography sx={{ mb: 2 }}>
            No menu found for this restaurant.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Price</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
                <TableCell>
                  <strong>Category</strong>
                </TableCell>
                <TableCell>
                  <strong>Type</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Edit</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Delete</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menuItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography color="text.secondary">
                      No menu items found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                menuItems.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      cursor: "pointer",
                    }}
                  >
                    <TableCell sx={{ color: mainTextColor }}>
                      {item.itemName}
                    </TableCell>
                    <TableCell sx={{ color: mainTextColor }}>
                      ₹{item.itemPrice}
                    </TableCell>
                    <TableCell sx={{ color: labelColor }}>
                      {item.itemDescription}
                    </TableCell>
                    <TableCell sx={{ color: labelColor }}>
                      {item.itemCategory}
                    </TableCell>
                    <TableCell sx={{ color: labelColor }}>
                      {item.itemType}
                    </TableCell>
                    <TableCell sx={{ color: labelColor }}>
                      {item.itemStatus}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Menu Item">
                        <IconButton
                          edge="end"
                          aria-label="edit-menu-item"
                          onClick={() =>
                            navigate(`/menu-items/edit/${item.id}`)
                          }
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Delete Menu Item">
                        <IconButton
                          edge="end"
                          aria-label="delete-menu-item"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            setItemToDelete(item.id);
                            setDeleteDialogOpen(true);
                          }}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Menu Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this menu item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            color="primary"
            variant="outlined"
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteMenuItem}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MenuItems;
