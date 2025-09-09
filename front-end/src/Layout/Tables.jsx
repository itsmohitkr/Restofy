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
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useNavigate } from "react-router-dom";
import { deleteTable, getAllTables } from "../utils/api";

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
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedRestaurant } = useContext(RestaurantContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTables = async () => {
      if (!selectedRestaurant) return;
      const abortController = new AbortController();
      const signal = abortController.signal;
      setLoading(true);
      try {
        const res = await getAllTables(
          {
            restaurantId: selectedRestaurant.restaurantId,
          },
          signal
        );

        res.status === 200 && res.data ? setTables(res.data) : setTables([]);
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
      await deleteTable({
        restaurantId: selectedRestaurant.restaurantId,
        tableId,
      });
      setTables((prev) => prev.filter((table) => table.id !== tableId));
    } catch (err) {
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

  // Filter tables by search term
  const filteredTables = tables.filter((table) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      table.tableName?.toLowerCase().includes(term) ||
      String(table.tableCapacity).includes(term) ||
      table.tableType?.toLowerCase().includes(term) ||
      table.tableStatus?.toLowerCase().includes(term)
    );
  });

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
        <Typography variant="h5" gutterBottom sx={{ flexGrow: 1 }}>
          Tables
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
          <Button
            variant="outlined"
            onClick={() => navigate("/new-table")}
            sx={{ fontWeight: 600, textTransform: "none" }}
          >
            + New Table
          </Button>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />

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
            ) : filteredTables.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No tables found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTables.map((table) => (
                <TableRow
                  key={table.id}
                  sx={{
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    cursor: "pointer",
                  }}
                >
                  <TableCell>{table.tableName}</TableCell>
                  <TableCell>{table.tableCapacity}</TableCell>
                  <TableCell>{table.tableType}</TableCell>
                  <TableCell>
                    <Chip
                      label={table.tableStatus}
                      color={getStatusColor(table.tableStatus)}
                      size="small"
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
