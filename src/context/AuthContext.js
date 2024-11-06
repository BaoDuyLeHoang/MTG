import React, { createContext, useContext, useState, useEffect } from 'react';
import { decodeToken, hasRequiredRole, ROLES } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../APIcontroller/LoginController';
const AuthContext = createContext(null);

const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export function AuthProvider({ children, navigate }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const lastActivity = localStorage.getItem('lastActivity');
    if (token && lastActivity) {
      const currentTime = new Date().getTime();
      if (currentTime - parseInt(lastActivity) < SESSION_DURATION) {
        updateUserFromToken(token);
        updateLastActivity();
      } else {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const updateLastActivity = () => {
    localStorage.setItem('lastActivity', new Date().getTime().toString());
  };

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
        areaId: decodedToken.areaId || null,
        // other user info from token
      };
      setUser(updatedUser);
      console.log('User updated in AuthContext:', updatedUser);
      return updatedUser;
    }
    return null;
  };

  const loginWithCredentials = async (phoneNumber, password) => {
    try {
      const result = await loginUser({ phoneNumber, password });
      if (result.success && result.data.token) {
        localStorage.setItem('accessToken', result.data.token);
        updateLastActivity();
        const user = updateUserFromToken(result.data.token);
        return { success: true, user };
      } else {
        return { success: false, error: result.error || 'Sai tài khoản hoặc mật khẩu' };
      }
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  const loginWithToken = (token) => {
    localStorage.setItem('accessToken', token);
    updateLastActivity();
    return updateUserFromToken(token);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('lastActivity');
    setUser(null);
    navigate('/login');
  };

  const hasRole = (requiredRole) => {
    return user ? hasRequiredRole(user.role, requiredRole) : false;
  };

  const checkSession = () => {
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity) {
      const currentTime = new Date().getTime();
      if (currentTime - parseInt(lastActivity) > SESSION_DURATION) {
        logout();
        return false;
      }
      updateLastActivity();
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, loading, hasRole, loginWithCredentials, loginWithToken, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
