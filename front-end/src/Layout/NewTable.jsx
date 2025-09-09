import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RestaurantContext } from "../Context/RestaurantContext";
import TableForm from "./TableForm";
import { createNewTable } from "../utils/api";

function NewTable() {
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
    
      const res= await createNewTable({
        restaurantId: selectedRestaurant.restaurantId,
        data:{...form, tableCapacity: Number(form.tableCapacity), tableStatus: "Available"}
      });
      if (res.status === 201) {
        setSuccess(res.message || "Table created successfully!");
        setForm({
          tableName: "",
          tableCapacity: "",
          tableType: "Regular",
        });
        setTimeout(() => navigate("/tables"), 1000);
      }
    } catch (err) {
      if (err.error && err.status === 400) {
        setError(err.message || "Invalid data provided.");
      } else {
        setError(err.message || "Failed to create table.");
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
      submitLabel="Create Table"
      isSubmitting={isSubmitting}
    />
  );
}

export default NewTable;