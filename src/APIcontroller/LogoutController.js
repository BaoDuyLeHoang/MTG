import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token'); // Remove the JWT token
    navigate('/login'); // Redirect to login page
  };

  return logout;
};