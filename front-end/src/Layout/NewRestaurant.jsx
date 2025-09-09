import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RestaurantForm from "./RestaurantForm";
import { createNewRestaurant } from "../utils/api";

function NewRestaurant() {
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
    
      const restaurantData = await createNewRestaurant(form);
      if (restaurantData.status === 201) {
        navigate("/restaurant");
      }
    } catch (err) {
      if (err.error && err.status === 400) {
        setError(`${err.error} : ${err.message}`);
      } else {
        setError("Failed to register restaurant.");
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
      submitLabel="Register"
      isSubmitting={isSubmitting}
    />
  );
}

export default NewRestaurant;
