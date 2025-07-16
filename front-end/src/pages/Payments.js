import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Payments = () => {
  const { restaurantId, reservationId, orderId, billId } = useParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        // Assume GET endpoint for payments (if not available, skip listing)
        const response = await axios.get(`/api/restaurants/${restaurantId}/reservations/${reservationId}/order/${orderId}/bill/${billId}/payment`);
        setPayments(response.data.data || []);
      } catch (err) {
        setError('Failed to load payments.');
      } finally {
        setLoading(false);
      }
    };
    if (restaurantId && reservationId && orderId && billId) {
      fetchPayments();
    }
  }, [restaurantId, reservationId, orderId, billId]);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSave = async (paymentData) => {
    try {
      const response = await axios.post(`/api/restaurants/${restaurantId}/reservations/${reservationId}/order/${orderId}/bill/${billId}/payment`, paymentData);
      setPayments([...payments, response.data.data]);
      handleModalClose();
    } catch (err) {
      setError('Failed to save payment.');
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
        <h1 className="text-2xl font-bold">Payments</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>Add Payment</button>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Method</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td className="px-4 py-2 border">{payment.amount}</td>
              <td className="px-4 py-2 border">{payment.method}</td>
              <td className="px-4 py-2 border">{payment.status}</td>
              <td className="px-4 py-2 border">{payment.createdAt ? new Date(payment.createdAt).toLocaleString() : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <PaymentModal
          isOpen={showModal}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const PaymentModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    amount: '',
    method: 'Cash',
    status: 'Completed',
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
        <h2 className="text-xl font-bold mb-4">Add Payment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Amount</label>
            <input name="amount" type="number" value={form.amount} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Method</label>
            <select name="method" value={form.method} onChange={handleChange} className="w-full border px-3 py-2 rounded">
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full border px-3 py-2 rounded">
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
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

export default Payments; 