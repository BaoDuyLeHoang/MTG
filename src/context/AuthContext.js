import React, { createContext, useContext, useState, useEffect } from 'react';
import { decodeToken, hasRequiredRole, ROLES } from '../utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      updateUserFromToken(token);
    }
    setLoading(false);
  }, []);

  const updateUserFromToken = (token) => {
    const decodedToken = decodeToken(token);
    if (decodedToken) {
      setUser({
        role: parseInt(decodedToken.role, 10),
        accountName: decodedToken.accountName || decodedToken.sub || 'User', // Fallback to 'sub' claim or 'User'
        accountId: decodedToken.accountId || decodedToken.sub, // Add this line
        // other user info from token
      });
      console.log('User updated in AuthContext:', decodedToken); // Add this line for debugging
    }
  };

  const login = (token) => {
    localStorage.setItem('accessToken', token);
    updateUserFromToken(token);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  const hasRole = (requiredRole) => {
    return user ? hasRequiredRole(user.role, requiredRole) : false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, hasRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);