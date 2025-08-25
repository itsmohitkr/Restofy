import axios from "axios";
import React, { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    isLoading: true, 
  });

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/verifyToken`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          const { user } = response.data?.data || {};
          setAuthState((prev) => ({
            ...prev,
            isAuthenticated: true,
            user: user?.email || "",
            isLoading: false,
          }));
        } else {
          setAuthState((prev) => ({
            ...prev,
            isAuthenticated: false,
            user: null,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: false,
          user: null,
          isLoading: false,
        }));
      }
    };
    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
