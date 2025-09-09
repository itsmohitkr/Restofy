import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TableForm from "./TableForm";
import { RestaurantContext } from "../Context/RestaurantContext";
import { getTableById, updateTable } from "../utils/api";
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
    const abortController = new AbortController();
    const signal = abortController.signal;
    const fetchTable = async () => {
      if (!selectedRestaurant) return;
      try {
       
        const res = await getTableById(
          {
            restaurantId: selectedRestaurant.restaurantId,
            tableId,
          },
          signal
        );

        if (res.status === 200 && res.data) {
          setForm({
            tableName: res.data.tableName || "",
            tableCapacity: res.data.tableCapacity?.toString() || "",
            tableType: res.data.tableType || "Regular"
          });
        }
      } catch (err) {
        if (err.error && err.status === 400) {
          setError(err.message || "Invalid data provided.");
        }
        else {
          setError("Failed to fetch table details.");
        }
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
      const res= await updateTable({
        restaurantId: selectedRestaurant.restaurantId,
        tableId,
        data: {
          ...form,
          tableCapacity: Number(form.tableCapacity),
        },
      });
      
      if (res.status === 200) {
        setSuccess("Table updated successfully!");
        setTimeout(() => navigate("/tables"), 1000);
      }
    } catch (err) {
      if (err.error && err.status === 400) {
        setError(err.message || "Invalid data provided.");
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