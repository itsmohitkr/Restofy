import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Menu as MenuIcon, Plus, Edit, Trash2, DollarSign, Tag } from 'lucide-react';

const Menu = () => {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menuId, setMenuId] = useState(null);

  // Fetch menuId and menu items
  useEffect(() => {
    const fetchMenuAndItems = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch menus for the restaurant (assuming one menu per restaurant)
        const menuRes = await axios.get(`/api/restaurants/${restaurantId}/menu`);
        const menus = menuRes.data.data || [];
        const menu = Array.isArray(menus) ? menus[0] : menus;
        if (!menu || !menu.id) throw new Error('No menu found');
        setMenuId(menu.id);
        // Fetch menu items
        const itemsRes = await axios.get(`/api/restaurants/${restaurantId}/menu/${menu.id}/menuItem`);
        setMenuItems(itemsRes.data.data || []);
      } catch (err) {
        setError('Failed to load menu or menu items.');
      } finally {
        setLoading(false);
      }
    };
    fetchMenuAndItems();
  }, [restaurantId]);

  const categories = ['all', ...new Set(menuItems.map(item => item.itemCategory))];
  
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.itemCategory === selectedCategory);

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (itemId) => {
    if (!menuId) return;
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await axios.delete(`/api/restaurants/${restaurantId}/menu/${menuId}/menuItem/${itemId}`);
        setMenuItems(menuItems.filter(item => item.id !== itemId));
      } catch (err) {
        setError('Failed to delete menu item.');
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSave = async (itemData) => {
    if (!menuId) return;
    try {
      if (editingItem) {
        const response = await axios.put(`/api/restaurants/${restaurantId}/menu/${menuId}/menuItem/${editingItem.id}`, itemData);
        setMenuItems(menuItems.map(item => item.id === editingItem.id ? response.data.data : item));
      } else {
        const response = await axios.post(`/api/restaurants/${restaurantId}/menu/${menuId}/menuItem`, itemData);
        setMenuItems([...menuItems, response.data.data]);
      }
      handleModalClose();
    } catch (err) {
      setError('Failed to save menu item.');
    }
  };

  const toggleAvailability = (itemId) => {
    setMenuItems(menuItems.map(item => 
      item.id === itemId 
        ? { ...item, isAvailable: !item.isAvailable }
        : item
    ));
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
          <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
          <p className="text-gray-600">Manage your restaurant menu</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Menu Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <MenuIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{menuItems.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <Tag className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">
                {menuItems.filter(item => item.isAvailable).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Tag className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Unavailable</p>
              <p className="text-2xl font-bold text-gray-900">
                {menuItems.filter(item => !item.isAvailable).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-secondary-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="card">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <MenuIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{item.itemName}</h3>
                  <p className="text-sm text-gray-600">{item.itemCategory}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">{item.itemDescription}</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Price:</span>
                <span className="text-lg font-bold text-gray-900">${item.itemPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.isAvailable 
                    ? 'bg-success-100 text-success-800' 
                    : 'bg-error-100 text-error-800'
                }`}>
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => toggleAvailability(item.id)}
                className={`w-full btn ${item.isAvailable ? 'btn-warning' : 'btn-success'}`}
              >
                {item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <MenuIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
          <p className="text-gray-600 mb-4">
            {selectedCategory === 'all' 
              ? 'Get started by adding your first menu item.' 
              : `No items found in the ${selectedCategory} category.`
            }
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Menu Item
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu; 