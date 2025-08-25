import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const RestaurantContext = createContext();

export function RestaurantProvider({ children }) {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  return (
    <RestaurantContext.Provider value={{ selectedRestaurant, setSelectedRestaurant }}>
      {children}
    </RestaurantContext.Provider>
  );
}

