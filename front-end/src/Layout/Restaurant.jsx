import { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { RestaurantContext } from '../Context/RestaurantContext';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ListIcon from '@mui/icons-material/List';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function Restaurant() {
  const [restaurants, setRestaurants] = useState([]);
  const { selectedRestaurant, setSelectedRestaurant } = useContext(RestaurantContext);
  const navigate = useNavigate();

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);

  // View state: "card" or "list"
  const [viewMode, setViewMode] = useState("card");

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
        setRestaurants(Array.isArray(response.data.data) ? response.data.data : [response.data.data]);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };
    fetchRestaurant();
  }, []);

  const handleSelectedRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    navigate("/dashboard");
  };

  const handleEdit = (restaurant) => {
      navigate(`/edit-restaurant/${restaurant.restaurantId}`);
  };

  const handleDeleteClick = (restaurant) => {
    setRestaurantToDelete(restaurant);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!restaurantToDelete) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${restaurantToDelete.restaurantId}`,
        { withCredentials: true }
      );
      setRestaurants((prev) =>
        prev.filter((r) => r.restaurantId !== restaurantToDelete.restaurantId)
      );
      setOpenDialog(false);
      setRestaurantToDelete(null);
    } catch (error) {
      setOpenDialog(false);
      setRestaurantToDelete(null);
    }
  };

  // Use a softer color for text (Material UI grey[800] or grey[700])
  const mainTextColor = "#374151";
  const labelColor = "#607d8b";

  // Toggle view mode on icon click
  const handleToggleView = () => {
    setViewMode((prev) => (prev === "card" ? "list" : "card"));
  };

  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
        <Typography variant="h5" sx={{ color: mainTextColor, flexGrow: 1 }}>
          {selectedRestaurant
            ? selectedRestaurant.restaurantName
            : "Restaurants"}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate("/new-restaurant")}
          size="small"
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          + New Restaurant
        </Button>
        <IconButton
          onClick={handleToggleView}
          size="small"
          sx={{
            border: "1px solid #e0e0e0",
            bgcolor: "#f5f5f5",
            ml: 1,
          }}
        >
          {viewMode === "card" ? <ListIcon /> : <ViewModuleIcon />}
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {viewMode === "card" ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {restaurants.map((restaurant) => (
            <Card
              key={restaurant.restaurantId}
              sx={{
                minWidth: 300,
                maxWidth: 350,
                p: 2,
                cursor: "pointer",
                position: "relative",
                boxShadow: 2,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  gap: 1,
                }}
              >
                <IconButton size="small" onClick={() => handleEdit(restaurant)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(restaurant)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Box
                onClick={() => handleSelectedRestaurant(restaurant)}
                sx={{ cursor: "pointer" }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontWeight: 700,
                    color: mainTextColor,
                  }}
                >
                  <HomeIcon fontSize="small" />
                  {restaurant.restaurantName}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: labelColor,
                  }}
                >
                  <InfoOutlinedIcon fontSize="small" />
                  {restaurant.restaurantDescription}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: mainTextColor,
                  }}
                >
                  <LocationOnIcon fontSize="small" />
                  <span style={{ fontWeight: 600, color: labelColor }}>
                    Location:
                  </span>{" "}
                  {restaurant.restaurantLocation}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: mainTextColor,
                  }}
                >
                  <HomeIcon fontSize="small" />
                  <span style={{ fontWeight: 600, color: labelColor }}>
                    Address:
                  </span>{" "}
                  {restaurant.restaurantAddress}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: mainTextColor,
                  }}
                >
                  <EmailIcon fontSize="small" />
                  <span style={{ fontWeight: 600, color: labelColor }}>
                    Email:
                  </span>{" "}
                  {restaurant.restaurantEmail}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: mainTextColor,
                  }}
                >
                  <PhoneIphoneIcon fontSize="small" />
                  <span style={{ fontWeight: 600, color: labelColor }}>
                    Phone:
                  </span>{" "}
                  {restaurant.restaurantPhoneNumber}
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
                <TableCell>
                  <strong>Location</strong>
                </TableCell>
                <TableCell>
                  <strong>Address</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Phone</strong>
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
              {restaurants.map((restaurant) => (
                <TableRow key={restaurant.restaurantId} sx={{ "&:hover": { backgroundColor: "#f5f5f5" }, cursor: "pointer" }} onClick={() => handleSelectedRestaurant(restaurant)}>
                  <TableCell>{restaurant.restaurantName}</TableCell>
                  <TableCell>{restaurant.restaurantDescription}</TableCell>
                  <TableCell>{restaurant.restaurantLocation}</TableCell>
                  <TableCell>{restaurant.restaurantAddress}</TableCell>
                  <TableCell>{restaurant.restaurantEmail}</TableCell>
                  <TableCell>{restaurant.restaurantPhoneNumber}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(restaurant)
                              }}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(restaurant)
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Restaurant</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <b>{restaurantToDelete?.restaurantName}</b>? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Restaurant;