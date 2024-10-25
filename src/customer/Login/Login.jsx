import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/header";
import "../Login/Login.css";
import lk from "../../assets/logo/logo-giao-duc-an-nhien.png";
import { loginUser } from "../../APIcontroller/LoginController";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/auth";

export default function Login() {
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await loginUser({ accountName, password });
      console.log("Full login API response:", result);

      if (result.success) {
        console.log("Login successful, token:", result.data.token);

        const user = login(result.data.token);
        console.log("Full user object after login:", user);

        if (user && user.role) {
          console.log("User role after processing:", user.role);
          console.log("User roleId after processing:", user.roleId);
          switch (user.role) {
            case ROLES.ADMIN:
              navigate("/admin");
              break;
            case ROLES.MANAGER:
              navigate("/manager");
              break;
            case ROLES.STAFF:
              navigate("/staff");
              break;
            case ROLES.CUSTOMER:
              navigate("/user");
              break;
            default:
              console.error("Unknown user role:", user.role);
              setError(`Unknown user role: ${user.role}`);
          }
        } else {
          console.error("User or user role not found:", user);
          setError("Unable to determine user role. Please try again.");
        }
      } else {
        console.error("Login failed:", result);
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            <label>Tên đăng nhập</label>
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
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
          <div className="forgot-password-register-container">
            <a href="#" className="forgot-password">
              Quên mật khẩu?
            </a>
            <a href="#" className="forgot-password">
              Đăng ký
            </a>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}
