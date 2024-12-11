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
  const [unreadCount, setUnreadCount] = useState(0);

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
    const handleStorageChange = (e) => {
      if (e.key === "savedCartItems") {
        if (!user || !user.accountId) {
          setCartItemCount(getSessionCartCount());
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Initial cart count
    if (!user || !user.accountId) {
      setCartItemCount(getSessionCartCount());
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  const toggleSettings = () => {
    setTimeout(() => {
      setShowSettings(!showSettings);
      setShowNotifications(false);
    }, 500);
  };

  const handleLogout = () => {
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 500);
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    setTimeout(() => {
      navigate('/cart');
    }, 500);
  };

  const handleNavLinkClick = (e, path) => {
    e.preventDefault();
    setTimeout(() => {
      navigate(path);
    }, 500);
  };

  const fetchNotifications = async (page = 1) => {
    try {
      setNotifications([]);
      
      const response = await getMyNotifications(page, 15);
      if (response && response.notifications) {
        setNotifications(response.notifications);
        setTotalPages(response.totalPage);
        setCurrentPage(page);
        
        const unreadNotifications = response.notifications.filter(
          notification => !notification.isRead
        );
        setUnreadCount(unreadNotifications.length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const handleNotificationClick = () => {
    setTimeout(() => {
      setShowNotifications(!showNotifications);
      setShowSettings(false);
      if (!showNotifications) {
        fetchNotifications();
      }
    }, 1000);
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

  // Add this new useEffect for click listener
  useEffect(() => {
    const handleClick = () => {
      setTimeout(() => {
        fetchCartItems();
      }, 500);
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [fetchCartItems]);

  // Thêm hàm để chỉ fetch số lượng thông báo chưa đọc
  const fetchUnreadCount = async () => {
    try {
      const response = await getMyNotifications(1, 15);
      if (response && response.notifications) {
        const unreadNotifications = response.notifications.filter(
          notification => !notification.isRead
        );
        setUnreadCount(unreadNotifications.length);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
      setUnreadCount(0);
    }
  };

  // Fetch số lượng thông báo chưa đọc khi component mount và mỗi 30 giây
  useEffect(() => {
    if (user && user.accountId) {
      fetchUnreadCount();
      
      // Cập nhật định kỳ mỗi 30 giây
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <header className="header">
      <div className="header-logo">
        
      </div>
      <nav className="navigation">
        <ul>
          <li>
            <Link to="/" onClick={(e) => handleNavLinkClick(e, '/')}>Trang chủ</Link>
          </li>
          <li>
            <Link to="/dichvu" onClick={(e) => handleNavLinkClick(e, '/dichvu')}>Dịch vụ</Link>
          </li>
          <li>
            <Link to="/tim-kiem-mo" onClick={(e) => handleNavLinkClick(e, '/tim-kiem-mo')}>Tìm kiếm mộ</Link>
          </li>
          <li>
            <Link to="/blog-view" onClick={(e) => handleNavLinkClick(e, '/blog-view')}>Bài viết</Link>
          </li>
        </ul>
      </nav>
      <div className="header-right">
        <Link to="/cart" className="cart-link" onClick={handleCartClick}>
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
            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 10 ? '10+' : unreadCount}
              </span>
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
                        className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                      >
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-description">{notification.description}</div>
                        <div className="notification-date">
                          {new Date(notification.createdDate).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} {new Date(notification.createdDate).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
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
