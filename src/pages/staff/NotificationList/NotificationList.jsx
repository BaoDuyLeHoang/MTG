import React, { useState, useEffect } from 'react';
import { getMyNotifications, getNotificationDetail } from '../../../services/notification';
import './NotificationList.css';
import { Bell, Calendar, ArrowLeft, AlertCircle, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import Loading from '../../../components/Loading/Loading';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/sideBar';

const NotificationList = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState(null); // Thêm state cho thông báo đã chọn
  const [showPopup, setShowPopup] = useState(false); // Thêm state cho popup

  useEffect(() => {
    fetchNotifications();
  }, [currentPage]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getMyNotifications(currentPage, 5);
      setNotifications(data.notifications);
      setTotalPages(data.totalPage);
    } catch (err) {
      setError('Không thể tải thông báo. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      const detail = await getNotificationDetail(notificationId); // Gọi API để lấy chi tiết thông báo
      setSelectedNotification(detail); // Cập nhật thông báo đã chọn
      setShowPopup(true); // Hiển thị popup
    } catch (err) {
      console.error(err);
    }
  };

  const closePopup = () => {
    setShowPopup(false); // Đóng popup
    setSelectedNotification(null); // Reset thông báo đã chọn
    fetchNotifications();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <Loading text="Đang tải thông báo..." />;

  // src/pages/staff/NotificationList/NotificationList.jsx
  return (
    <div className="page-container-notification-list">
      <Sidebar />
      <div className="content-wrapper-notification-list">
        <div className="notification-title">
          <h1>Thông báo</h1>
        </div>
        <div className="title-line-notification-list"></div>
        <div className="notification-container-notification-list">
          {notifications.length === 0 ? (
            <div className="no-notification-notification-lists">
              <Bell size={48} />
              <p>Chưa có thông báo nào</p>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className={`notification-card ${notification.isRead ? 'read' : 'unread'}`}
                  onClick={() => handleNotificationClick(notification.notificationId)} // Thêm sự kiện click
                >
                  <div className="notification-icon">
                    <Calendar size={24} />
                  </div>
                  <div className="notification-content">
                    <h3>{notification.title}</h3>
                    <span className="notification-date">
                      {new Date(notification.createdDate).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} />
            Trước
          </button>
          <div className="pagination-info">
            Trang {currentPage}/{totalPages}
          </div>
          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Sau
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Popup hiển thị chi tiết thông báo */}
      {showPopup && selectedNotification && (
        <div className="popup">
          <div className="popup-content">
            <h2>{selectedNotification.title}</h2>
            <p>{selectedNotification.description}</p>
            <p><strong>Ngày tạo:</strong> {new Date(selectedNotification.createdDate).toLocaleString()}</p>
            <button onClick={closePopup}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationList; 