import React, { useContext, useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import Divider from "@mui/material/Divider";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { RestaurantContext } from "../../Context/RestaurantContext";

function SideBar() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { selectedRestaurant } =
    useContext(RestaurantContext);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  return (
    <Box>
      <List>
        <ListItemButton
          selected={selectedIndex === 1}
          onClick={(event) => handleListItemClick(event, 1)}
          component={Link}
          to="/"
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

     
          <ListItemButton
            selected={selectedIndex === 2}
            onClick={(event) => handleListItemClick(event, 2)}
            component={Link}
            to="/new-restaurant"
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="New Restaurant" />
          </ListItemButton>

        {selectedRestaurant && (
          <>
            <ListItemButton
              selected={selectedIndex === 3}
              onClick={(event) => handleListItemClick(event, 3)}
              component={Link}
              to="/new-reservation"
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="New Reservation" />
            </ListItemButton>

            <ListItemButton
              selected={selectedIndex === 4}
              onClick={(event) => handleListItemClick(event, 4)}
              component={Link}
              to="/new-table"
            >
              <ListItemIcon>
                <TableRestaurantIcon />
              </ListItemIcon>
              <ListItemText primary="New Tables" />
            </ListItemButton>

            <ListItemButton
              selected={selectedIndex === 5}
              onClick={(event) => handleListItemClick(event, 5)}
              component={Link}
              to="/menu-items"
            >
              <ListItemIcon>
                <RestaurantMenuIcon />
              </ListItemIcon>
              <ListItemText primary="Menu Items" />
            </ListItemButton>

            <ListItemButton
              selected={selectedIndex === 6}
              onClick={(event) => handleListItemClick(event, 6)}
              component={Link}
              to="/reservations"
            >
              <ListItemIcon>
                <VisibilityIcon />
              </ListItemIcon>
              <ListItemText primary="Reservations" />
            </ListItemButton>
          </>
        )}
      </List>
    </Box>
  );
}

export default SideBar;
