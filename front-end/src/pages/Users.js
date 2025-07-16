import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Users = () => {
  const { restaurantId } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/restaurants/${restaurantId}/user`);
        setUsers(response.data.data || []);
      } catch (err) {
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [restaurantId]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/restaurants/${restaurantId}/user/${userId}`);
        setUsers(users.filter(u => u.id !== userId));
      } catch (err) {
        setError('Failed to delete user.');
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSave = async (userData) => {
    try {
      if (editingUser) {
        const response = await axios.put(`/api/restaurants/${restaurantId}/user/${editingUser.id}`, userData);
        setUsers(users.map(u => u.id === editingUser.id ? response.data.data : u));
      } else {
        const response = await axios.post(`/api/restaurants/${restaurantId}/user`, userData);
        setUsers([...users, response.data.data]);
      }
      handleModalClose();
    } catch (err) {
      setError('Failed to save user.');
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
        <h1 className="text-2xl font-bold">Users</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>Add User</button>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="px-4 py-2 border">{user.name || user.firstName || user.ownerName}</td>
              <td className="px-4 py-2 border">{user.email || user.ownerEmail}</td>
              <td className="px-4 py-2 border">{user.role}</td>
              <td className="px-4 py-2 border">
                <button className="btn-secondary mr-2" onClick={() => handleEdit(user)}>Edit</button>
                <button className="btn-danger" onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <UserModal
          isOpen={showModal}
          onClose={handleModalClose}
          onSave={handleSave}
          user={editingUser}
        />
      )}
    </div>
  );
};

// Simple modal for user create/edit
const UserModal = ({ isOpen, onClose, onSave, user }) => {
  const [form, setForm] = useState({
    name: user?.name || user?.firstName || user?.ownerName || '',
    email: user?.email || user?.ownerEmail || '',
    role: user?.role || 'Staff',
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
        <h2 className="text-xl font-bold mb-4">{user ? 'Edit User' : 'Add User'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Role</label>
            <select name="role" value={form.role} onChange={handleChange} className="w-full border px-3 py-2 rounded">
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
              <option value="Customer">Customer</option>
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

export default Users; 