import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RestaurantContext } from "../Context/RestaurantContext";
import MenuItemForm from "./MenuItemForm";
import { getMenu, getMenuItemById, updateMenuItem } from "../utils/api";

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
    const abortController = new AbortController();
    const signal = abortController.signal;
    const fetchMenuAndItem = async () => {
      if (!selectedRestaurant) return;

      try {
        const menuRes = await getMenu(
          { restaurantId: selectedRestaurant.restaurantId },
          signal
        );
        setMenu(menuRes.data);

        const itemRes = await getMenuItemById(
          {
            restaurantId: selectedRestaurant.restaurantId,
            menuId: menuRes.data.id,
            menuItemId,
          },
          signal
        );
        setForm({
          itemName: itemRes.data.itemName || "",
          itemDescription: itemRes.data.itemDescription || "",
          itemPrice: itemRes.data.itemPrice?.toString() || "",
          itemCategory: itemRes.data.itemCategory || "General",
          itemType: itemRes.data.itemType || "",
          itemStatus: itemRes.data.itemStatus || "Available",
        });
      } catch (err) {
        setError("Failed to fetch menu item.");
        console.log(err);
      }
    };
    fetchMenuAndItem();
    return () => abortController.abort();
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
      const res = await updateMenuItem({
        restaurantId: selectedRestaurant.restaurantId,
        menuId: menu.id,
        menuItemId,
        data: {
          ...form,
          itemPrice: Number(form.itemPrice),
        },
      });
      if(res.status === 200) {
        setSuccess("Menu item updated!");
        setTimeout(() => navigate("/menu-items"), 1200);
      }
    } catch (err) {
      setError(err.message || "Failed to update menu item.");
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
