import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const SessionCheck = ({ children }) => {
  const { checkSession, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionEnded, setSessionEnded] = useState(false);

  useEffect(() => {
    const checkSessionStatus = () => {
      const isSessionValid = checkSession();
      if (!isSessionValid && !sessionEnded) {
        setSessionEnded(true);
        alert("Your session has expired. Please log in again.");
        logout();
        navigate('/login');
      }
    };

    checkSessionStatus();
    const intervalId = setInterval(checkSessionStatus, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [location, checkSession, logout, navigate, sessionEnded]);

  return <>{children}</>;
};

export default SessionCheck;
