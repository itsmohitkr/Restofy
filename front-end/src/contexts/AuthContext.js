import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Configure axios defaults
  axios.defaults.withCredentials = true;

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/auth/verifyToken');
      if (response.data.status === 200) {
        setUser(response.data.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('Not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Starting login process...');
      const response = await axios.post('/api/auth/login', {
        ownerEmail: email,
        ownerPassword: password
      });

      console.log('AuthContext: Login response:', response.data);

      // Check if the response indicates success (status 200)
      if (response.data.status === 200) {
        console.log('AuthContext: Login successful, setting user and auth state...');
        setUser(response.data.data);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        console.log('AuthContext: Auth state updated, returning success');
        return { success: true };
      } else {
        console.log('AuthContext: Login failed with status:', response.data.status);
        toast.error(response.data.message || 'Login failed');
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post('/api/auth/signup', userData);

      if (response.data.status === 201) {
        setUser(response.data.data);
        setIsAuthenticated(true);
        toast.success('Account created successfully!');
        return { success: true };
      } else {
        toast.error(response.data.message || 'Signup failed');
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 