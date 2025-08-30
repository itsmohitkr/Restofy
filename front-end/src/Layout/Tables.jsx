import React, { useEffect, useState, useContext } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { RestaurantContext } from "../Context/RestaurantContext";
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Table,
  Chip,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function getStatusColor(status) {
  switch (status) {
    case "Available":
      return "success";
    case "Reserved":
      return "warning";
    case "Occupied":
      return "error";
    default:
      return "default";
  }
}

function Tables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [tableToDelete, setTableToDelete] = useState(null);
  const { selectedRestaurant } = useContext(RestaurantContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTables = async () => {
      if (!selectedRestaurant) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/table`,
          { withCredentials: true }
        );
        setTables(res.data.data || []);
      } catch (err) {
        setTables([]);
        console.log(err);
      }
      setLoading(false);
    };
    fetchTables();
  }, [selectedRestaurant]);

  const handleEdit = (tableId) => {
    // Implement edit logic (e.g., open dialog or navigate)
    navigate(`/edit-table/${tableId}`);
  };

  const handleDelete = async (tableId) => {
    if (!selectedRestaurant) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/table/${tableId}`,
        { withCredentials: true }
      );
      setTables((prev) => prev.filter((table) => table.id !== tableId));
    } catch (err) {
      // Optionally show error
      console.error("Error deleting table:", err);
    }
  };

  const openDeleteDialog = (tableId) => {
    setTableToDelete(tableId);
    setOpenDialog(true);
  };

  if (!selectedRestaurant) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" align="center">
          Please select a restaurant to view tables.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ flexGrow: 1 }}>
          Tables
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate("/new-table")}
          size="small"
          sx={{ fontWeight: 600, textTransform: "none" }}
        >
          + New Table
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />

      <TableContainer
        component={Paper}
        sx={{
          mt: 2,
          maxHeight: 580,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Capacity</strong>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : tables.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No tables found.
                </TableCell>
              </TableRow>
            ) : (
              tables.map((table) => (
                <TableRow key={table.id}>
                  <TableCell>{table.tableName}</TableCell>
                  <TableCell>{table.tableCapacity}</TableCell>
                  <TableCell>{table.tableType}</TableCell>
                  <TableCell>
                    <Chip
                      label={table.tableStatus}
                      color={getStatusColor(table.tableStatus)}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(table.id)}
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => openDeleteDialog(table.id)}
                        aria-label="delete"
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Table</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this table? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await handleDelete(tableToDelete);
              setOpenDialog(false);
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Tables;