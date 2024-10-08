import Header from "../../components/Header/header";
import "../Login/Login.css";
import lk from "../../assets/logo/logo-giao-duc-an-nhien.png";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { loginUser } from "../../APIcontroller/LoginController";
import { useAuth } from "../../context/AuthContext"; // Add this import

export default function Login() {
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Add this line to get the login function from AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await loginUser({ accountName, password });

    if (result.success) {
      console.log('Login successful', result.data);
      login(result.data.token); // Make sure this matches the key in your result
      navigate('/'); // Redirect to the dashboard or user's page
    } else {
      // Handle login failure
      console.error('Login failed:', result); // Log the full result
      setError(result.error);
      if (result.fullResponse) {
        console.log('Full server response:', result.fullResponse);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <Header />
      <div className="login-image">
        <img src={lk} className="login-logo" />
      </div>
      <div className="login-box">
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
          {error && <p className="error-message">{error}</p>}
          <a href="#" className="forgot-password">
            Quên mật khẩu?
          </a>
        </form>
      </div>
    </div>
  );
}
