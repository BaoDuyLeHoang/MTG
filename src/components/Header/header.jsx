import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart, faBell } from '@fortawesome/free-solid-svg-icons';
import { getProfile } from "../../services/profile";
import { getCartItemsByCustomerId, getMyNotifications } from "../../APIcontroller/API";

const Header = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const settingsRef = useRef(null);
  const notificationsRef = useRef(null);

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

  const getSessionCartCount = () => {
    const savedCartItems = JSON.parse(sessionStorage.getItem("savedCartItems") || "[]");
    return savedCartItems.length;
  };

  const fetchCartItems = useCallback(async () => {
    if (user && user.accountId) {
      try {
        const cartItems = await getCartItemsByCustomerId(user.accountId);
        setCartItemCount(cartItems.cartItemList?.length || 0);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    } else {
      setCartItemCount(getSessionCartCount());
    }
  }, [user]);

  useEffect(() => {
    const updateCartCount = () => {
      if (user && user.accountId) {
        fetchCartItems();
      } else {
        setCartItemCount(getSessionCartCount());
      }
    };

    const intervalId = setInterval(updateCartCount, 500);

    return () => clearInterval(intervalId);
  }, [user, fetchCartItems]);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchNotifications = async (page = 1) => {
    try {
      const response = await getMyNotifications(page, 5);
      setNotifications(response.notifications);
      setTotalPages(response.totalPage);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowSettings(false);
    if (!showNotifications) {
      fetchNotifications();
    }
  };

  const displayName = user ? (user.accountName) : "👤";

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra click outside cho settings dropdown
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
      
      // Kiểm tra click outside cho notifications dropdown
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-logo">
        
      </div>
      <nav className="navigation">
        <ul>
          <li>
            <Link to="/">Trang chủ</Link>
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
        
        <div className="notifications-container" ref={notificationsRef}>
          <button 
            onClick={handleNotificationClick} 
            className="notifications-button"
            aria-label="Notifications"
          >
            <FontAwesomeIcon icon={faBell} className="notifications-icon" />
            {notifications.some(n => !n.isRead) && (
              <span className="notification-badge"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notifications-dropdown">
              <h3>Thông báo</h3>
              {notifications.length > 0 ? (
                <>
                  <div className="notifications-list">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.notificationId} 
                        className={`notification-item ${!notification.status ? 'unread' : ''}`}
                      >
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-description">{notification.description}</div>
                        <div className="notification-date">
                          {new Date(notification.createdDate).toLocaleString('vi-VN')}
                        </div>
                      </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="notifications-pagination">
                      <button 
                        onClick={() => fetchNotifications(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Trước
                      </button>
                      <span>{currentPage}/{totalPages}</span>
                      <button 
                        onClick={() => fetchNotifications(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Sau
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="no-notifications">Không có thông báo mới</p>
              )}
            </div>
          )}
        </div>
        
        <div className="user-settings" ref={settingsRef}>
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
                      <Link to="/wallet">Ví của tôi</Link>
                      <Link to="/schedule-service-history">Dịch vụ định kì</Link>
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
