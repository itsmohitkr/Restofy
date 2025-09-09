import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { RestaurantContext } from "../Context/RestaurantContext";
import ReservationForm from "./ReservationForm";
import { getReservationById, updateReservation } from "../utils/api";

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
    const abortController = new AbortController();
    const signal = abortController.signal;
    const fetchReservation = async () => {
      if (!selectedRestaurant) return;
      try {
        const res = await getReservationById(
          {
            restaurantId: selectedRestaurant.restaurantId,
            reservationId,
          },
          signal
        );

        if (res.status === 200 && res.data) {
          setForm({
            firstName: res.data.firstName || "",
            lastName: res.data.lastName || "",
            email: res.data.email || "",
            contact: res.data.contact || "",
            numberOfGuests: res.data.numberOfGuests?.toString() || "",
            specialRequests: res.data.specialRequests || "",
            reservationTime: res.data.reservationTime
              ? toLocalDatetimeInputValue(res.data.reservationTime)
              : "",
          });
        }
      } catch (err) {
        setError(err.message || "Failed to fetch reservation details.");
      }
    };
    fetchReservation();
    return () => abortController.abort();
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
      
      const reservationResponse = await updateReservation({
        restaurantId: selectedRestaurant.restaurantId,
        reservationId,
        data: {
          ...form,
          numberOfGuests: Number(form.numberOfGuests),
          reservationTime: reservationTimeISO,
        },
      });

      if (reservationResponse.status === 200) {
        setSuccess(reservationResponse.message || "Reservation updated successfully!");
        setTimeout(
          () => navigate(`/reservations/${reservationId}/manage`),
          500
        );

        setReservation({
          ...reservation,
          ...form,
        });
      }
    } catch (err) {
      if (err.error && err.status === 400) {
        setError(err.message || "Invalid data provided.");
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

  function toLocalDatetimeInputValue(dateString) {
    const date = new Date(dateString);
    const pad = (n) => n.toString().padStart(2, "0");
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  }

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
