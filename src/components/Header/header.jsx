import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import logo from "../../assets/logo/logo-giao-duc-an-nhien.png";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { getProfile } from "../../services/profile";
import { getCartItemsByCustomerId } from "../../APIcontroller/API";

const Header = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && user.accountId) {
        try {
          const profileData = await getProfile(user.accountId);
          setUserProfile(profileData);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    fetchUserProfile();
    fetchCartItems();
  }, [user]);

  const fetchCartItems = useCallback(async () => {
    if (user && user.accountId) {
      try {
        const cartItems = await getCartItemsByCustomerId(user.accountId);
        setCartItemCount(cartItems.cartItemList?.length || 0);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchCartItems();

    const handleClick = () => {
      // Delay fetching cart items by 1 second after a click
      setTimeout(() => {
        fetchCartItems();
      }, 500);
    };

    // Add event listener to document for all clicks
    document.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [fetchCartItems]);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
      <div className="header-right">
        <Link to="/cart" className="cart-link">
          <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
          {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
        </Link>
        <div className="user-settings">
          {user && (
            <span className="user-name-header" style={{ marginRight: '10px', color: '#fff' }}>
              {userProfile?.fullName || user.accountName}
            </span>
          )}
          <button onClick={toggleSettings} className="user-icon">
            {userProfile?.avatarPath ? (
              <img 
                src={userProfile.avatarPath} 
                alt="User avatar" 
                style={{ width: '25px', height: '25px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }}
              />
            ) : (
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#fff" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="feather feather-user"
                style={{ marginRight: '5px'}}
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
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
                      <Link to="/notifications">Thông báo</Link>
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
        
      </div>
    </header>
  );
};

export default Header;
