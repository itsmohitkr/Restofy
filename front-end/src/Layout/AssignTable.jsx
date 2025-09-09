import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Stack,
  Card,
  Button,
} from "@mui/material";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import GroupIcon from "@mui/icons-material/Group";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { RestaurantContext } from "../Context/RestaurantContext";
import { assignReservationToTable, getAvailableTables } from "../utils/api";

function AssignTable() {
  const { reservation, setReservation } = useOutletContext();

  const { reservationId } = useParams();
  const { selectedRestaurant } = useContext(RestaurantContext);
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState("");
  const [loadingTables, setLoadingTables] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [assignSuccess, setAssignSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedRestaurant) return;
    setLoadingTables(true);
    const abortController = new AbortController();
    const signal = abortController.signal;
    const fetchAvailableTables = async () => {
      try {
        const res = await getAvailableTables(
          {
            restaurantId: selectedRestaurant.restaurantId,
          },
          signal
        );
        if (res.status === 200 && (res.data || [])) {
          setAvailableTables(
            res.data.filter((table) => table.tableStatus === "Available")
          );
        }
      } catch (err) {
        setAvailableTables([]);
        setAssignError(err.message || "Failed to fetch available tables.");
      }
      setLoadingTables(false);
    };
    fetchAvailableTables();
    return () => abortController.abort();
  }, [selectedRestaurant]);

  const handleAssignTable = async () => {
    if (!selectedTableId) {
      setAssignError("Please select a table.");
      setAssignSuccess("");
      return;
    }
    setAssignError("");
    setActionLoading(true);
    try {
      const res = await assignReservationToTable({
        restaurantId: selectedRestaurant.restaurantId,
        reservationId,
        tableId: selectedTableId,
      });
      if (res.status === 200) {
        setAssignSuccess(res.message || "Table assigned successfully!");
      }
      setTimeout(() => navigate(`/reservations/${reservationId}/manage`), 500);

      setReservation({
        ...reservation,
        tableId: selectedTableId,
        status: "Seated",
      });
    } catch (err) {
      setAssignError(err.message || "Failed to assign table.");
      setAssignSuccess("");
    }
    setActionLoading(false);
  };

  return (
    <Box sx={{ minWidth: 320 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Assign Table
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {loadingTables ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : availableTables.length === 0 ? (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          No available tables found.
        </Typography>
      ) : (
        <Box sx={{ maxHeight: 560, overflowY: "auto", pr: 1 }}>
          <Stack spacing={2}>
            {availableTables.map((table) => {
              const isSelected = selectedTableId === table.id;
              return (
                <Card
                  key={table.id}
                  variant="outlined"
                  sx={{
                    borderColor: isSelected ? "primary.main" : "grey.300",
                    borderWidth: isSelected ? 2 : 1,
                    borderRadius: 2,
                    boxShadow: isSelected ? 2 : 0,
                    backgroundColor: isSelected
                      ? "action.hover"
                      : "background.paper",
                    cursor: "pointer",
                    transition:
                      "border-color 0.2s, box-shadow 0.2s, background-color 0.2s",
                    p: 2,
                    position: "relative",
                    minWidth: 220,
                  }}
                  onClick={() => setSelectedTableId(table.id)}
                >
                  {/* Top Row */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Top Left: Table Name */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <TableRestaurantIcon fontSize="small" />
                      <Typography variant="subtitle1" fontWeight={600}>
                        {table.tableName}
                      </Typography>
                    </Box>
                    {/* Top Right: Table Type */}
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {table.tableType}
                    </Typography>
                  </Box>
                  {/* Middle: Capacity */}
                  <Box
                    sx={{ display: "flex", alignItems: "center", mt: 1, mb: 1 }}
                  >
                    <GroupIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      Capacity: {table.tableCapacity}
                    </Typography>
                  </Box>
                  {/* Bottom Row */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      mt: 2,
                    }}
                  >
                    {/* Bottom Left: Table Name (optional) */}
                    <Typography variant="caption" color="text.secondary">
                      {table.tableName}
                    </Typography>
                    {/* Bottom Right: Buttons (only if selected) */}
                    {isSelected && (
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
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
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAssignTable();
                          }}
                          disabled={
                            !selectedTableId || assignSuccess || actionLoading
                          }
                        >
                          Confirm
                        </Button>
                      </Stack>
                    )}
                  </Box>
                </Card>
              );
            })}
          </Stack>
        </Box>
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
    </Box>
  );
}

export default AssignTable;
