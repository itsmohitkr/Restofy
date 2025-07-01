import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Users,
  Calendar,
  Menu as MenuIcon,
  Edit,
  ArrowLeft
} from 'lucide-react';

const RestaurantDetail = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading restaurant data
    setTimeout(() => {
      setRestaurant({
        restaurantId: parseInt(restaurantId),
        restaurantName: 'Pizza Palace',
        restaurantLocation: 'Downtown',
        restaurantEmail: 'info@pizzapalace.com',
        restaurantPhoneNumber: '1234567890',
        restaurantDescription: 'Authentic Italian pizza and pasta restaurant serving the finest ingredients since 1995. Our wood-fired ovens and traditional recipes bring the taste of Italy to your table.',
        restaurantAddress: '123 Main St, Downtown, City, State 12345',
        tables: 8,
        reservations: 45,
        menuItems: 23,
        createdAt: '2024-01-01',
        rating: 4.5,
        reviews: 128
      });
      setLoading(false);
    }, 1000);
  }, [restaurantId]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Building2 },
    { id: 'tables', name: 'Tables', icon: Users },
    { id: 'menu', name: 'Menu', icon: MenuIcon },
    { id: 'reservations', name: 'Reservations', icon: Calendar },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Restaurant not found</h3>
        <p className="text-gray-600 mb-4">The restaurant you're looking for doesn't exist.</p>
        <Link to="/restaurants" className="btn-primary">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/restaurants" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{restaurant.restaurantName}</h1>
            <p className="text-gray-600">{restaurant.restaurantLocation}</p>
          </div>
        </div>
        <button className="btn-primary flex items-center">
          <Edit className="h-5 w-5 mr-2" />
          Edit Restaurant
        </button>
      </div>

      {/* Restaurant Info Card */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Information</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-3 text-gray-400" />
                {restaurant.restaurantEmail}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-3 text-gray-400" />
                {restaurant.restaurantPhoneNumber}
              </div>
              <div className="flex items-start text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-3 mt-0.5 text-gray-400" />
                {restaurant.restaurantAddress}
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-600">{restaurant.restaurantDescription}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <Users className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{restaurant.tables}</p>
                <p className="text-sm text-gray-600">Tables</p>
              </div>
              <div className="text-center p-4 bg-success-50 rounded-lg">
                <Calendar className="h-8 w-8 text-success-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{restaurant.reservations}</p>
                <p className="text-sm text-gray-600">Reservations</p>
              </div>
              <div className="text-center p-4 bg-warning-50 rounded-lg">
                <MenuIcon className="h-8 w-8 text-warning-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{restaurant.menuItems}</p>
                <p className="text-sm text-gray-600">Menu Items</p>
              </div>
              <div className="text-center p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold text-gray-900">{restaurant.rating}</span>
                  <span className="text-yellow-400 ml-1">★</span>
                </div>
                <p className="text-sm text-gray-600">{restaurant.reviews} reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">New reservation</p>
                      <p className="text-sm text-gray-600">John Doe - 4 guests for 7:00 PM</p>
                    </div>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Menu updated</p>
                      <p className="text-sm text-gray-600">Added 3 new items to the menu</p>
                    </div>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Table status changed</p>
                      <p className="text-sm text-gray-600">Table 3 is now available</p>
                    </div>
                    <span className="text-xs text-gray-500">3 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tables' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tables</h3>
                <Link
                  to={`/restaurants/${restaurantId}/tables`}
                  className="btn-primary"
                >
                  Manage Tables
                </Link>
              </div>
              <p className="text-gray-600">Table management interface will be displayed here.</p>
            </div>
          )}

          {activeTab === 'menu' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
                <Link
                  to={`/restaurants/${restaurantId}/menu`}
                  className="btn-primary"
                >
                  Manage Menu
                </Link>
              </div>
              <p className="text-gray-600">Menu management interface will be displayed here.</p>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Reservations</h3>
                <Link
                  to={`/restaurants/${restaurantId}/reservations`}
                  className="btn-primary"
                >
                  Manage Reservations
                </Link>
              </div>
              <p className="text-gray-600">Reservation management interface will be displayed here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail; 