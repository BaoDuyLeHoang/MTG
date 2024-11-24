import React, { useState, useEffect } from 'react';
import { getMyNotifications } from '../../../APIcontroller/API';
import Header from '../../../components/Header/header';
import './NotificationList.css';
import { Bell, Calendar, ArrowLeft, AlertCircle, RefreshCcw } from 'lucide-react';
import Loading from '../../../components/Loading/Loading';
import { useNavigate } from 'react-router-dom';

const NotificationList = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getMyNotifications();
        setNotifications(data);
      } catch (err) {
        setError('Không thể tải thông báo. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <Loading text="Đang tải thông báo..." />;
  if (error) return (
    <div className="page-container">
      <Header />
      <div className="content-wrapper">
        <div className="notification-container">
          <div className="notification-header">
            <button className="back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={24} />
              <span>Quay lại</span>
            </button>
          </div>
          <div className="error-container">
            <AlertCircle size={48} />
            <h2>{error}</h2>
            <button className="retry-button" onClick={() => window.location.reload()}>
              <RefreshCcw size={20} />
              <span>Thử lại</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <Header />
      <div className="content-wrapper">
        <div className="notification-container">
          <div className="notification-header">
            <button className="back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={24} />
              <span>Quay lại</span>
            </button>
            <div className="title-group">
              <Bell className="bell-icon" />
              <h1>Thông báo của bạn</h1>
            </div>
          </div>
          
          {notifications.length === 0 ? (
            <div className="no-notifications">
              <Bell size={48} />
              <p>Chưa có thông báo nào</p>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map((notification) => (
                <div key={notification.notificationId} className="notification-card">
                  <div className="notification-icon">
                    <Calendar size={24} />
                  </div>
                  <div className="notification-content">
                    <h3>{notification.title}</h3>
                    <p>{notification.description}</p>
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
      </div>
    </div>
  );
};

export default NotificationList; 