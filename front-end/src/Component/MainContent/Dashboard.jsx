import React, { useContext, useEffect, useState } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import AllRoutes from '../../Layout/AllRoutes'
import NewRestaurant from '../../Layout/NewRestaurant';
import NewTable from '../../Layout/NewTable';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { RestaurantContext } from '../../Context/RestaurantContext';
import Divider from '@mui/material/Divider';


function Dashboard() {
    const [restaurants, setRestaurants] = useState([]);
    const {selectedRestaurant, setSelectedRestaurant } = useContext(RestaurantContext);


  useEffect(() => {
    // Fetch restaurant data if needed
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          });
        console.log(response.data.data);
        // Assume response.data.data is an array
        setRestaurants(Array.isArray(response.data.data) ? response.data.data : [response.data.data]);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };
    fetchRestaurant();
  }, []);

  const handleSelectedRestaurant = (restaurant) => {
    // Handle restaurant selection
      console.log("Selected restaurant:", restaurant);
      setSelectedRestaurant(restaurant);
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {selectedRestaurant ? selectedRestaurant.restaurantName : "Restaurants"}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {restaurants.map((restaurant) => (
          <Card
            key={restaurant.restaurantId}
            onClick={() => handleSelectedRestaurant(restaurant)}
            sx={{ minWidth: 300, maxWidth: 350, p: 2, cursor: "pointer" }}
          >
            <Typography variant="h6" color="primary.main">
              {restaurant.restaurantName}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {restaurant.restaurantDescription}
            </Typography>
            <Typography variant="body2">
              <b>Location:</b> {restaurant.restaurantLocation}
            </Typography>
            <Typography variant="body2">
              <b>Address:</b> {restaurant.restaurantAddress}
            </Typography>
            <Typography variant="body2">
              <b>Email:</b> {restaurant.restaurantEmail}
            </Typography>
            <Typography variant="body2">
              <b>Phone:</b> {restaurant.restaurantPhoneNumber}
            </Typography>
          </Card>
        ))}
      </Box>
      {/* <Outlet /> */}
    </div>
  );
}

export default Dashboard;