import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import logo from "../../assets/logo/logo-giao-duc-an-nhien.png";

const Header = () => {
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

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
          👤
        </button>
        {showSettings && (
          <div className="settings-dropdown">
            <Link to="/profile">Hồ sơ</Link>
            <Link to="/login">Đăng nhập</Link>
            <Link to="/mothannhan">Mo nguoi than</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
