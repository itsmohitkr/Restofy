import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axios from "axios";
import { RestaurantContext } from "../Context/RestaurantContext";
import ReservationForm from "./ReservationForm";

function EditReservation() {
  const { reservationId } = useParams();
        const { reservation, setReservation } = useOutletContext();

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

  useEffect(() => {
    const fetchReservation = async () => {
      if (!selectedRestaurant) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/reservations/${reservationId}`,
          { withCredentials: true }
        );
        if (res.data && res.data.data) {
            const r = res.data.data;
            console.log(r);
            
          setForm({
            firstName: r.firstName || "",
            lastName: r.lastName || "",
            email: r.email || "",
            contact: r.contact || "",
            numberOfGuests: r.numberOfGuests?.toString() || "",
            specialRequests: r.specialRequests || "",
            reservationTime: r.reservationTime
              ? r.reservationTime.slice(0, 16)
              : "",
          });
        }
      } catch (err) {
          setError("Failed to fetch reservation details.");
          console.log(err);
      }
    };
    fetchReservation();
  }, [selectedRestaurant, reservationId]);

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
      const reservationData = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/reservations/${reservationId}`,
        {
          ...form,
          numberOfGuests: Number(form.numberOfGuests),
          reservationTime: reservationTimeISO,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (reservationData.status === 200) {
        setSuccess("Reservation updated successfully!");
        setTimeout(
          () => navigate(`/reservations/${reservationId}/manage`),
          500
        );

        setReservation({
          ...reservation,
          ...form,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data?.message || "Invalid data provided.");
      } else {
        setError("Failed to update reservation.");
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
      submitLabel="Update"
      selectedRestaurant={selectedRestaurant}
      isSubmitting={isSubmitting}
    />
  );
}

export default EditReservation;