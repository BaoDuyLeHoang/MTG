import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import logo from "../../assets/logo/logo-giao-duc-an-nhien.png";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { user, logout } = useAuth(); // Get both user and logout from useAuth
  const navigate = useNavigate();

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleLogout = () => {
    logout(); // Use the logout function from AuthContext
    navigate('/login'); // Redirect to home page after logout
  };

  const displayName = user ? (user.accountName) : "👤";

  return (
    <header className="header">
      <div className="header-logo">
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
            <Link to="/blog-view">Bài viết</Link>
          </li>
        </ul>
      </nav>
      <div className="user-settings">
        <button onClick={toggleSettings} className="user-icon">
          <FontAwesomeIcon icon={faUser} />
        </button>
        {showSettings && (
          <div className="settings-dropdown">
            {user ? (
              <>
                {user.role === 4 && (
                  <>
                    <Link to="/user-profile">Hồ sơ</Link>
                    <Link to="/relative-grave">Mộ người thân</Link>
                    <Link to="/cart">Giỏ hàng</Link>
                    <Link to="/order-history">Lịch sử đơn hàng</Link>
                  </>
                )}
                {user.role === 2 && (
                  <>
                    <Link to="/manager">Về Quản lý</Link>
                  </>
                )}
                {user.role === 1 && (
                  <>
                    <Link to="/admin">Về Admin</Link>
                  </>
                )}
                {user.role === 3 && (
                  <>
                    <Link to="/staff">Về Nhân viên</Link>
                  </>
                )}
                <button onClick={handleLogout} className="logout-link">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/cart">Giỏ hàng</Link>
                <Link to="/login">Đăng nhập</Link>
              </>
            
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
