import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  MapPin,
  Users,
  Calendar
} from 'lucide-react';
import RestaurantModal from '../components/RestaurantModal';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);

  // Fetch restaurants from backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/restaurants');
        setRestaurants(response.data.data || []);
      } catch (err) {
        setError('Failed to load restaurants.');
      } finally {
      setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.restaurantLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (restaurant) => {
    setEditingRestaurant(restaurant);
    setShowModal(true);
  };

  const handleDelete = async (restaurantId) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await axios.delete(`/api/restaurants/${restaurantId}`);
      setRestaurants(restaurants.filter(r => r.restaurantId !== restaurantId));
      } catch (err) {
        setError('Failed to delete restaurant.');
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingRestaurant(null);
  };

  const handleSave = async (restaurantData) => {
    try {
    if (editingRestaurant) {
      // Update existing restaurant
        const response = await axios.put(`/api/restaurants/${editingRestaurant.restaurantId}`, restaurantData);
      setRestaurants(restaurants.map(r => 
        r.restaurantId === editingRestaurant.restaurantId 
            ? response.data.data
          : r
      ));
    } else {
      // Add new restaurant
        const response = await axios.post('/api/restaurants', restaurantData);
        setRestaurants([...restaurants, response.data.data]);
    }
    handleModalClose();
    } catch (err) {
      setError('Failed to save restaurant.');
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
          <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
          <p className="text-gray-600">Manage your restaurant locations</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Restaurant
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <button className="btn-secondary flex items-center justify-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <div key={restaurant.restaurantId} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{restaurant.restaurantName}</h3>
                  <p className="text-sm text-gray-600">{restaurant.restaurantLocation}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(restaurant)}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(restaurant.restaurantId)}
                  className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">{restaurant.restaurantDescription}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {restaurant.restaurantEmail}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {restaurant.restaurantPhoneNumber}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {restaurant.restaurantAddress}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                {restaurant.tables} tables
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                {restaurant.reservations} reservations
              </div>
            </div>

            <div className="flex space-x-2">
              <Link
                to={`/restaurants/${restaurant.restaurantId}`}
                className="btn-primary flex-1 flex items-center justify-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
              <Link
                to={`/restaurants/${restaurant.restaurantId}/tables`}
                className="btn-secondary flex-1 flex items-center justify-center"
              >
                <Users className="h-4 w-4 mr-2" />
                Tables
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRestaurants.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first restaurant.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Restaurant
            </button>
          )}
        </div>
      )}

      {/* Restaurant Modal */}
      <RestaurantModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSave={handleSave}
        restaurant={editingRestaurant}
      />
    </div>
  );
};

export default Restaurants; 