import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { RestaurantContext } from "../Context/RestaurantContext";
import MenuItemForm from "./MenuItemForm";

function EditMenuItem() {
  const { menuItemId } = useParams();
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

  // Fetch menu and menu item on mount
  useEffect(() => {
    const fetchMenuAndItem = async () => {
      if (!selectedRestaurant) return;
      try {
        const menuRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/menu`,
          { withCredentials: true }
        );
        setMenu(menuRes.data.data);

        const itemRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/menu/${menuRes.data.data.id}/menuItem/${menuItemId}`,
          { withCredentials: true }
        );
        const item = itemRes.data.data;
        setForm({
          itemName: item.itemName || "",
          itemDescription: item.itemDescription || "",
          itemPrice: item.itemPrice?.toString() || "",
          itemCategory: item.itemCategory || "General",
          itemType: item.itemType || "",
          itemStatus: item.itemStatus || "Available",
        });
      } catch (err) {
        setError("Failed to fetch menu item.");
        console.log(err);
      }
    };
    fetchMenuAndItem();
  }, [selectedRestaurant, menuItemId]);

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
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/menu/${menu.id}/menuItem/${menuItemId}`,
        {
          ...form,
          itemPrice: Number(form.itemPrice),
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setSuccess("Menu item updated!");
      setTimeout(() => navigate("/menu-items"), 1200);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update menu item."
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
      submitLabel="Update Item"
      isSubmitting={isSubmitting}
    />
  );
}

export default EditMenuItem;