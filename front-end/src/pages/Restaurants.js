import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);

  useEffect(() => {
    // Simulate loading restaurants data
    setTimeout(() => {
      setRestaurants([
        {
          restaurantId: 1,
          restaurantName: 'Pizza Palace',
          restaurantLocation: 'Downtown',
          restaurantEmail: 'info@pizzapalace.com',
          restaurantPhoneNumber: '1234567890',
          restaurantDescription: 'Authentic Italian pizza and pasta',
          restaurantAddress: '123 Main St, Downtown',
          tables: 8,
          reservations: 45,
          createdAt: '2024-01-01'
        },
        {
          restaurantId: 2,
          restaurantName: 'Burger House',
          restaurantLocation: 'Uptown',
          restaurantEmail: 'contact@burgerhouse.com',
          restaurantPhoneNumber: '0987654321',
          restaurantDescription: 'Gourmet burgers and fries',
          restaurantAddress: '456 Oak Ave, Uptown',
          tables: 12,
          reservations: 78,
          createdAt: '2024-01-15'
        },
        {
          restaurantId: 3,
          restaurantName: 'Sushi Bar',
          restaurantLocation: 'Westside',
          restaurantEmail: 'hello@sushibar.com',
          restaurantPhoneNumber: '5551234567',
          restaurantDescription: 'Fresh sushi and Japanese cuisine',
          restaurantAddress: '789 Pine St, Westside',
          tables: 6,
          reservations: 32,
          createdAt: '2024-02-01'
        }
      ]);
      setLoading(false);
    }, 1000);
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
      // API call to delete restaurant
      setRestaurants(restaurants.filter(r => r.restaurantId !== restaurantId));
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingRestaurant(null);
  };

  const handleSave = (restaurantData) => {
    if (editingRestaurant) {
      // Update existing restaurant
      setRestaurants(restaurants.map(r => 
        r.restaurantId === editingRestaurant.restaurantId 
          ? { ...r, ...restaurantData }
          : r
      ));
    } else {
      // Add new restaurant
      const newRestaurant = {
        ...restaurantData,
        restaurantId: Date.now(),
        tables: 0,
        reservations: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setRestaurants([...restaurants, newRestaurant]);
    }
    handleModalClose();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
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