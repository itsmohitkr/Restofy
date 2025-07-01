import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Building2,
  Users,
  Calendar,
  Menu as MenuIcon,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Star
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalTables: 0,
    totalReservations: 0,
    totalMenuItems: 0,
    recentReservations: [],
    revenueData: [],
    tableStatusData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    setTimeout(() => {
      setStats({
        totalRestaurants: 3,
        totalTables: 24,
        totalReservations: 156,
        totalMenuItems: 89,
        recentReservations: [
          { id: 1, customerName: 'John Doe', restaurant: 'Pizza Palace', date: '2024-01-15', time: '19:00', guests: 4 },
          { id: 2, customerName: 'Jane Smith', restaurant: 'Burger House', date: '2024-01-15', time: '20:30', guests: 2 },
          { id: 3, customerName: 'Mike Johnson', restaurant: 'Sushi Bar', date: '2024-01-16', time: '18:00', guests: 6 },
        ],
        revenueData: [
          { month: 'Jan', revenue: 12000 },
          { month: 'Feb', revenue: 15000 },
          { month: 'Mar', revenue: 18000 },
          { month: 'Apr', revenue: 14000 },
          { month: 'May', revenue: 22000 },
          { month: 'Jun', revenue: 25000 },
        ],
        tableStatusData: [
          { name: 'Available', value: 18, color: '#22c55e' },
          { name: 'Occupied', value: 4, color: '#ef4444' },
          { name: 'Reserved', value: 2, color: '#f59e0b' },
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ title, value, icon: Icon, change, changeType = 'up' }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {changeType === 'up' ? (
                <TrendingUp className="h-4 w-4 text-success-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-error-600" />
              )}
              <span className={`ml-1 text-sm font-medium ${
                changeType === 'up' ? 'text-success-600' : 'text-error-600'
              }`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-primary-100 rounded-lg">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ title, description, icon: Icon, href, color = 'primary' }) => (
    <Link
      to={href}
      className={`card hover:shadow-md transition-shadow cursor-pointer group`}
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-100 group-hover:bg-${color}-200 transition-colors`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.ownerName || 'User'}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Restaurants"
          value={stats.totalRestaurants}
          icon={Building2}
          change="+12%"
          changeType="up"
        />
        <StatCard
          title="Total Tables"
          value={stats.totalTables}
          icon={Users}
          change="+5%"
          changeType="up"
        />
        <StatCard
          title="Total Reservations"
          value={stats.totalReservations}
          icon={Calendar}
          change="+18%"
          changeType="up"
        />
        <StatCard
          title="Menu Items"
          value={stats.totalMenuItems}
          icon={MenuIcon}
          change="+8%"
          changeType="up"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table Status Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Table Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.tableStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.tableStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <Link to="/restaurants" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAction
            title="Add Restaurant"
            description="Create a new restaurant"
            icon={Plus}
            href="/restaurants"
            color="primary"
          />
          <QuickAction
            title="Manage Tables"
            description="View and manage table status"
            icon={Users}
            href="/restaurants"
            color="success"
          />
          <QuickAction
            title="View Reservations"
            description="Check upcoming reservations"
            icon={Calendar}
            href="/restaurants"
            color="warning"
          />
        </div>
      </div>

      {/* Recent Reservations */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Reservations</h3>
          <Link to="/restaurants" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restaurant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guests
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{reservation.customerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.restaurant}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {reservation.date} at {reservation.time}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{reservation.guests} guests</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 