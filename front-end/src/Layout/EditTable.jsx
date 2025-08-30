import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TableForm from "./TableForm";
import { RestaurantContext } from "../Context/RestaurantContext";

function EditTable() {
  const { tableId } = useParams();
  const [form, setForm] = useState({
    tableName: "",
    tableCapacity: "",
    tableType: "Regular",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { selectedRestaurant } = useContext(RestaurantContext);

  useEffect(() => {
    const fetchTable = async () => {
      if (!selectedRestaurant) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/table/${tableId}`,
          { withCredentials: true }
        );
        if (res.data && res.data.data) {
          setForm({
            tableName: res.data.data.tableName || "",
            tableCapacity: res.data.data.tableCapacity?.toString() || "",
            tableType: res.data.data.tableType || "Regular",
          });
        }
      } catch (err) {
          setError("Failed to fetch table details.");
          console.log(err);
      }
    };
    fetchTable();
  }, [selectedRestaurant, tableId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "tableCapacity" ? value.replace(/\D/, "") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tableName || !form.tableCapacity) {
      setError("Table name and capacity are required.");
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
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurants/${selectedRestaurant.restaurantId}/table/${tableId}`,
        {
          ...form,
          tableCapacity: Number(form.tableCapacity),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setSuccess("Table updated successfully!");
        setTimeout(() => navigate("/tables"), 1000);
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data?.message || "Invalid data provided.");
      } else {
        setError("Failed to update table.");
      }
      setSuccess("");
    }
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <TableForm
      form={form}
      error={error}
      success={success}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitLabel="Update Table"
      isSubmitting={isSubmitting}
    />
  );
}

export default EditTable;