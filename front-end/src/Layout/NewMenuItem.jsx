import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RestaurantContext } from "../Context/RestaurantContext";
import MenuItemForm from "./MenuItemForm";

function NewMenuItem() {
  const { selectedRestaurant } = useContext(RestaurantContext);
  const [form, setForm] = useState({
    itemName: "",
    itemDescription: "",
    itemPrice: "",
    itemCategory: "General",
    itemType: "",
    itemStatus: "Available",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menu, setMenu] = useState(null);
  const navigate = useNavigate();

  // Fetch menu on mount
  React.useEffect(() => {
    const fetchMenu = async () => {
      if (!selectedRestaurant) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/menu`,
          { withCredentials: true }
        );
        setMenu(res.data.data);
      } catch (err) {
        setMenu(null);
        console.log(err);
      }
    };
    fetchMenu();
  }, [selectedRestaurant]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.itemName || !form.itemPrice) {
      setError("Item name and price are required.");
      return;
    }
    if (!selectedRestaurant || !menu) {
      setError("Menu not found for this restaurant.");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/menu/${menu.id}/menuItem`,
        {
          ...form,
          itemPrice: Number(form.itemPrice),
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setSuccess("Menu item created!");
      setTimeout(() => navigate("/menu-items"), 1200);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create menu item."
      );
      setSuccess("");
    }
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    navigate("/menu-items");
  };

  return (
    <MenuItemForm
      form={form}
      error={error}
      success={success}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitLabel="Add Item"
      isSubmitting={isSubmitting}
    />
  );
}

export default NewMenuItem;