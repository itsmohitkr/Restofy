import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RestaurantForm from "./RestaurantForm";
import { RestaurantContext } from "../Context/RestaurantContext";
import { getRestaurantById, updateRestaurant } from "../utils/api";

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
    const abortController = new AbortController();
    const signal = abortController.signal;
    const fetchRestaurant = async () => {
      try {

        const res = await getRestaurantById({ restaurantId }, signal);
        if (res.status === 200 && res.data) {
          setForm({
            restaurantName: res.data.restaurantName || "",
            restaurantLocation: res.data.restaurantLocation || "",
            restaurantEmail: res.data.restaurantEmail || "",
            restaurantPhoneNumber: res.data.restaurantPhoneNumber || "",
            restaurantDescription: res.data.restaurantDescription || "",
            restaurantAddress: res.data.restaurantAddress || "",
          });
        }
      } catch (err) {
        if (err.error) {
          setError(`${err.error} : ${err.message}`);
        } else {
          setError("Failed to fetch restaurant details.");
        }
        console.log(err);
      }
    };
    fetchRestaurant();
    return () => abortController.abort();
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

      const restaurantData = await updateRestaurant({
        restaurantId,
        data: { ...form },
      });

      if (restaurantData.status === 200) {
        navigate("/restaurant");
      }
    } catch (err) {
      if (err.error && err.status === 400) {
        setError(err.message || "Invalid data provided.");
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