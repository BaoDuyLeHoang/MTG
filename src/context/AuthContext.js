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
    console.log('Decoded token:', decodedToken);
    if (decodedToken) {
      const roleId = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      console.log('RoleId from token:', roleId);
      
      let role = 'Unknown';
      switch (roleId) {
        case '1':
          role = ROLES.ADMIN;
          break;
        case '2':
          role = ROLES.MANAGER;
          break;
        case '3':
          role = ROLES.STAFF;
          break;
        case '4':
          role = ROLES.CUSTOMER;
          break;
        default:
          console.warn(`Unknown RoleId: ${roleId}`);
      }
      
      const updatedUser = {
        role: role,
        roleId: roleId,
        accountName: decodedToken.accountName || decodedToken.sub || 'User',
        accountId: decodedToken.accountId || decodedToken.sub,
        customerCode: decodedToken.customerCode || null,
        // other user info from token
      };
      setUser(updatedUser);
      console.log('User updated in AuthContext:', updatedUser);
      return updatedUser;
    }
    return null;
  };

  const login = (token) => {
    localStorage.setItem('accessToken', token);
    return updateUserFromToken(token);
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
