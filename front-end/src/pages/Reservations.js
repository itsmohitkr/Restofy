import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Plus, Edit, Trash2, Users, Clock, CheckCircle, XCircle } from 'lucide-react';

const Reservations = () => {
  const { restaurantId } = useParams();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/restaurants/${restaurantId}/reservations`);
        setReservations(response.data.data || []);
      } catch (err) {
        setError('Failed to load reservations.');
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [restaurantId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success-100 text-success-800';
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'cancelled':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const filteredReservations = reservations.filter(reservation => 
    reservation.reservationDate === selectedDate
  );

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setShowModal(true);
  };

  const handleDelete = async (reservationId) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        await axios.delete(`/api/restaurants/${restaurantId}/reservations/${reservationId}`);
      setReservations(reservations.filter(r => r.id !== reservationId));
      } catch (err) {
        setError('Failed to delete reservation.');
      }
    }
  };

  const updateStatus = async (reservationId, newStatus) => {
    try {
      // Assuming PATCH endpoint for status update
      const response = await axios.patch(`/api/restaurants/${restaurantId}/reservations/${reservationId}`, { status: newStatus });
      setReservations(reservations.map(r => r.id === reservationId ? response.data.data : r));
    } catch (err) {
      setError('Failed to update reservation status.');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingReservation(null);
  };

  const handleSave = async (reservationData) => {
    try {
      if (editingReservation) {
        const response = await axios.put(`/api/restaurants/${restaurantId}/reservations/${editingReservation.id}`, reservationData);
        setReservations(reservations.map(r => r.id === editingReservation.id ? response.data.data : r));
      } else {
        const response = await axios.post(`/api/restaurants/${restaurantId}/reservations`, reservationData);
        setReservations([...reservations, response.data.data]);
      }
      handleModalClose();
    } catch (err) {
      setError('Failed to save reservation.');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-600">Manage restaurant reservations</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Reservation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Calendar className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{reservations.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">
                {reservations.filter(r => r.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Clock className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {reservations.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-error-100 rounded-lg">
              <XCircle className="h-6 w-6 text-error-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">
                {reservations.filter(r => r.status === 'cancelled').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Date Filter */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <label htmlFor="date" className="text-sm font-medium text-gray-700">
            Select Date:
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input"
          />
        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.length > 0 ? (
          filteredReservations.map((reservation) => (
            <div key={reservation.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{reservation.customerName}</h3>
                      <p className="text-sm text-gray-600">{reservation.customerEmail}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                        {getStatusIcon(reservation.status)}
                        <span className="ml-1 capitalize">{reservation.status}</span>
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(reservation)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(reservation.id)}
                          className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {reservation.reservationTime} on {reservation.reservationDate}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {reservation.numberOfGuests} guests
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Table {reservation.tableId}
                    </div>
                  </div>

                  {reservation.specialRequests && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Special Requests:</span> {reservation.specialRequests}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  {reservation.status !== 'confirmed' && (
                    <button
                      onClick={() => updateStatus(reservation.id, 'confirmed')}
                      className="btn-success flex-1"
                    >
                      Confirm
                    </button>
                  )}
                  {reservation.status !== 'cancelled' && (
                    <button
                      onClick={() => updateStatus(reservation.id, 'cancelled')}
                      className="btn-error flex-1"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations for this date</h3>
            <p className="text-gray-600 mb-4">No reservations found for {selectedDate}.</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Reservation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservations; 