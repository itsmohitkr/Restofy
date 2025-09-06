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
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";


function MenuItems() {
  const { selectedRestaurant } = useContext(RestaurantContext);
  const [menu, setMenu] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [creatingMenu, setCreatingMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  // Filter menu items by search term
  const filteredMenuItems = menuItems.filter((item) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      item.itemName?.toLowerCase().includes(term) ||
      String(item.itemPrice).includes(term) ||
      item.itemDescription?.toLowerCase().includes(term) ||
      item.itemCategory?.toLowerCase().includes(term) ||
      item.itemType?.toLowerCase().includes(term)
    );
  });

  // Fetch menu for the selected restaurant
  useEffect(() => {
    if (!selectedRestaurant) return;
    const fetchMenu = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/menu`,
          { withCredentials: true }
        );
        setMenu(res.data.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setMenu(null);
        } else {
          setError("Failed to fetch menu.");
        }
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
      setError("");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/menu/${menu.id}/menuItem`,
          { withCredentials: true }
        );
        setMenuItems(res.data.data || []);
      } catch (err) {
        setMenuItems([]);
        setError("Failed to fetch menu items.");
        console.log(err);
      }
      setLoading(false);
    };
    fetchMenuItems();
  }, [menu, selectedRestaurant]);

  // Create menu if not exists
  const handleCreateMenu = async () => {
    setCreatingMenu(true);
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/menu`,
        {}, // Add menu data if needed
        { withCredentials: true }
      );
      setMenu(res.data.data);
    } catch (err) {
      setError("Failed to create menu.");
      console.log(err);

    }
    setCreatingMenu(false);
  };

  // Delete menu item
  const handleDeleteMenuItem = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    setError("");
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/menu/${menu.id}/menuItem/${itemToDelete}`,
        { withCredentials: true }
      );
      setMenuItems((prev) => prev.filter((item) => item.id !== itemToDelete));
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (err) {
      setError("Failed to delete menu item.");
      console.log(err);

    }
    setDeleting(false);
  };

  // Consistent colors
  const mainTextColor = "#374151";
  const labelColor = "#607d8b";
  const greenColor = "#317433ff";
  const redColor = "#d93c30ff";

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
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ color: mainTextColor, flexGrow: 1 }}>
          Menu Items
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            size="small"
            label="Search by any field."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 250 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          {menu && (
            <Button
              variant="outlined"
              onClick={() => navigate("/menu-items/new")}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              + New Menu Item
            </Button>
          )}
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {loading || creatingMenu ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : !menu ? (
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography sx={{ mb: 2 }} color="warning.main">
            No menu found for this restaurant.
          </Typography>
          <Button
            variant="contained"
            onClick={handleCreateMenu}
            disabled={creatingMenu}
          >
            Create Menu
          </Button>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ maxHeight: 550, overflow: "auto" }}
        >
          <Table size="small">
            <TableHead
              sx={{
                position: "sticky",
                top: 0,
                bgcolor: "background.paper",
                zIndex: 1,
                height: 50,
              }}
            >
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
              {filteredMenuItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography color="text.secondary">
                      No menu items found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMenuItems.map((item) => (
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
                      <Chip
                        label={item.itemType}
                        sx={{
                          bgcolor:
                            item.itemType === "Veg" ? greenColor : redColor,
                          color: "white",
                        }}
                        size="small"
                      />
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
            Are you sure you want to delete this menu item? This action cannot
            be undone.
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
