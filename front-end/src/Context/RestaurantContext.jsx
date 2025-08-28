import { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const RestaurantContext = createContext();

export function RestaurantProvider({ children }) {
  const [selectedRestaurant, setSelectedRestaurant] = useState(() => {
    const stored = localStorage.getItem("selectedRestaurant");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (selectedRestaurant) {
      localStorage.setItem("selectedRestaurant", JSON.stringify(selectedRestaurant));
    } else {
      localStorage.removeItem("selectedRestaurant");
    }
  }, [selectedRestaurant]);

  return (
    <RestaurantContext.Provider value={{ selectedRestaurant, setSelectedRestaurant }}>
      {children}
    </RestaurantContext.Provider>
  );
}

