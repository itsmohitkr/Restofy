import { useContext } from "react";

import { RestaurantContext } from "../../Context/RestaurantContext";
import DashboardAnalytics from "../../Layout/DashboardAnalytics";

function Dashboard() {
  const { selectedRestaurant, setSelectedRestaurant } =
    useContext(RestaurantContext);

  return (
    <div>
      <DashboardAnalytics restaurant={selectedRestaurant} />
    </div>
  );
}

export default Dashboard;
