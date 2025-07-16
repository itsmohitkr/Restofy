import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Bills = () => {
  const { restaurantId, reservationId, orderId } = useParams();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      setError(null);
      try {
        // Assume GET endpoint for bills (if not available, skip listing)
        const response = await axios.get(`/api/restaurants/${restaurantId}/reservations/${reservationId}/order/${orderId}/bill`);
        setBills(response.data.data || []);
      } catch (err) {
        setError('Failed to load bills.');
      } finally {
        setLoading(false);
      }
    };
    if (restaurantId && reservationId && orderId) {
      fetchBills();
    }
  }, [restaurantId, reservationId, orderId]);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSave = async (billData) => {
    try {
      const response = await axios.post(`/api/restaurants/${restaurantId}/reservations/${reservationId}/order/${orderId}/bill`, billData);
      setBills([...bills, response.data.data]);
      handleModalClose();
    } catch (err) {
      setError('Failed to save bill.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">{error}</div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Bills</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>Add Bill</button>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Total Amount</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {bills.map(bill => (
            <tr key={bill.id}>
              <td className="px-4 py-2 border">{bill.totalAmount}</td>
              <td className="px-4 py-2 border">{bill.status}</td>
              <td className="px-4 py-2 border">{bill.createdAt ? new Date(bill.createdAt).toLocaleString() : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <BillModal
          isOpen={showModal}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const BillModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    totalAmount: '',
    status: 'Unpaid',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Bill</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Total Amount</label>
            <input name="totalAmount" type="number" value={form.totalAmount} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full border px-3 py-2 rounded">
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button type="button" className="btn-secondary mr-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Bills; 