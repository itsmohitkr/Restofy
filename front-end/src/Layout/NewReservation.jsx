import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RestaurantContext } from "../Context/RestaurantContext";
import ReservationForm from "./ReservationForm";
import { createNewReservation } from "../utils/api";

function NewReservation() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    numberOfGuests: "",
    specialRequests: "",
    reservationTime: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { selectedRestaurant } = useContext(RestaurantContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.contact ||
      !form.numberOfGuests ||
      !form.reservationTime
    ) {
      setError("All fields except special requests are required.");
      setSuccess("");
      return;
    }
    if (!selectedRestaurant) {
      setError("Please select a restaurant first.");
      setSuccess("");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const reservationTimeISO = new Date(form.reservationTime).toISOString();

      const reservationResponse = await createNewReservation({
        restaurantId: selectedRestaurant.restaurantId,
        data: {
          ...form,
          numberOfGuests: Number(form.numberOfGuests),
          reservationTime: reservationTimeISO,
        },
      });
      console.log(reservationResponse);
      
      if (reservationResponse.status === 201) {
        setSuccess("Reservation created successfully!");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          contact: "",
          numberOfGuests: "",
          specialRequests: "",
          reservationTime: "",
        });
        setTimeout(() => navigate("/reservations"), 1200);
      }
    } catch (err) {
      console.log(err);

      if (err.error && err.status === 400) {
        setError(`${err.error} : ${err.message}`);
      } else {
        setError("Failed to create reservation.");
      }
      setSuccess("");
    }
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <ReservationForm
      form={form}
      error={error}
      success={success}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitLabel="Reserve"
      selectedRestaurant={selectedRestaurant}
      isSubmitting={isSubmitting}
    />
  );
}

export default NewReservation;
