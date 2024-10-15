import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import logo from "../../assets/logo/logo-giao-duc-an-nhien.png";
import { useAuth } from "../../context/AuthContext";
import { useLogout } from "../../APIcontroller/LogoutController";
const Header = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { user, logout } = useAuth(); // Get both user and logout from useAuth

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleLogout = () => {
    logout(); // Use the logout function from AuthContext
    // You may want to redirect the user to the login page or home page after logout
  };

  const displayName = user ? (user.accountName) : "👤";

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <nav className="navigation">
        <ul>
          <li>
            <Link to="/">Trang chủ</Link>
          </li>
          <li>
            <Link to="/gioi-thieu">Giới thiệu</Link>
          </li>
          <li>
            <Link to="/dichvu">Dịch vụ</Link>
          </li>
          <li>
            <Link to="/tim-kiem-mo">Tìm kiếm mộ</Link>
          </li>
          <li>
            <Link to="/lien-he">Liên hệ</Link>
          </li>
        </ul>
      </nav>
      <div className="user-settings">
        <button onClick={toggleSettings} className="user-icon">
          {displayName}
        </button>
        {showSettings && (
          <div className="settings-dropdown">
            {user ? (
              <>
                <Link to="/profile">Hồ sơ</Link>
                <Link to="/mothannhan">Mo nguoi than</Link> 
                <Link to="/cart">Gio hang</Link>
                <Link onClick={logout}>Đăng xuất</Link>
              </>
            ) : (
              <Link to="/login">Đăng nhập</Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
