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
            <Link id="menu-homepage" to="/">Trang chủ</Link>
          </li>
          <li>
            <Link id="menu-introduce" to="/gioi-thieu">Giới thiệu</Link>
          </li>
          <li>
            <Link id="menu-services" to="/dichvu">Dịch vụ</Link>
          </li>
          <li>
            <Link id="menu-search" to="/tim-kiem-mo">Tìm kiếm mộ</Link>
          </li>
          <li>
            <Link id="menu-contact" to="/lien-he">Liên hệ</Link>
          </li>
        </ul>
      </nav>
      <div className="user-settings">
        <button onClick={toggleSettings} id="user-icon" className="user-icon">
          👤
        </button>
        {showSettings && (
          <div className="settings-dropdown">
            <Link id="profile" to="/profile">Hồ sơ</Link>
            <Link id="login" to="/login">Đăng nhập</Link>
            <Link id="relative-grave" to="/mothannhan">Mộ người thân</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
