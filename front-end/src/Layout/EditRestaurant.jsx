import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import RestaurantForm from "./RestaurantForm";
import { RestaurantContext } from "../Context/RestaurantContext";

function EditRestaurant() {
  const { restaurantId } = useParams();
  const [form, setForm] = useState({
    restaurantName: "",
    restaurantLocation: "",
    restaurantEmail: "",
    restaurantPhoneNumber: "",
    restaurantDescription: "",
    restaurantAddress: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch restaurant details for editing
    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${restaurantId}`,
          { withCredentials: true }
        );
        if (res.data && res.data.data) {
          setForm({
            restaurantName: res.data.data.restaurantName || "",
            restaurantLocation: res.data.data.restaurantLocation || "",
            restaurantEmail: res.data.data.restaurantEmail || "",
            restaurantPhoneNumber: res.data.data.restaurantPhoneNumber || "",
            restaurantDescription: res.data.data.restaurantDescription || "",
            restaurantAddress: res.data.data.restaurantAddress || "",
          });
        }
      } catch (err) {
          setError("Failed to fetch restaurant details.");
          console.log(err);
      }
    };
    fetchRestaurant();
  }, [restaurantId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.restaurantName ||
      !form.restaurantEmail ||
      !form.restaurantPhoneNumber ||
      !form.restaurantLocation ||
      !form.restaurantDescription ||
      !form.restaurantAddress
    ) {
      setError("All fields are required.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const restaurantData = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${restaurantId}`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (restaurantData.status === 200) {
        navigate("/restaurant");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data?.message || "Invalid data provided.");
      } else {
        setError("Failed to update restaurant.");
      }
    }
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <RestaurantForm
      form={form}
      error={error}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitLabel="Update"
      isSubmitting={isSubmitting}
    />
  );
}

export default EditRestaurant;