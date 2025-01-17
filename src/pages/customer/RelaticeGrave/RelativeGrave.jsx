import React, { useState, useEffect } from "react";
import "./RelativeGrave.css";
import Header from "../../../components/Header/header";
import Footer from "../../../components/Footer/footer";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getMartyrGraveByCustomerId } from "../../../services/graves";
import Loading from '../../../components/Loading/Loading';

const DEFAULT_GRAVE_IMAGE = "https://firebasestorage.googleapis.com/v0/b/mtg-capstone-2024.appspot.com/o/grave_images%2Fbna_3..jpg?alt=media&token=8f7ddd09-355a-4d65-85b6-476829954072";

const RelativeGrave = () => {
  const [graves, setGraves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchGraves = async () => {
      try {
        if (!user?.accountId) {
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('accessToken');
        console.log("Fetching graves for customer ID:", user.accountId);
        
        const response = await getMartyrGraveByCustomerId(user.accountId, token);
        console.log("API Response:", response);
        
        const gravesData = Array.isArray(response) ? response : response.data;
        
        if (Array.isArray(gravesData)) {
          setGraves(gravesData);
        } else {
          console.error("Unexpected response format:", response);
          setError("Unexpected data format received from server");
        }
      } catch (error) {
        console.error("Error fetching graves:", error);
        setError("Failed to fetch graves data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGraves();
  }, [user]);

  if (loading) {
    return (
      <div className="relative-grave-container">
        <Header />
        <div className="page-title">
          <h1>Danh Sách Mộ Liệt Sĩ Của Bạn</h1>
        </div>
        <Loading fullScreen={false} text="Đang tải danh sách mộ..." />
        <Footer />
      </div>
    );
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  if (!graves.length) {
    return (
      <div className="relative-grave-container">
        <Header />
        <div className="page-title">
          <h1>Danh Sách Mộ Liệt Sĩ Của Bạn</h1>
        </div>
        <div className="no-graves-message">
          Không tìm thấy thông tin mộ liệt sĩ.
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const formatGraveLocation = (martyrCode) => {
    if (!martyrCode) return "Không có thông tin";
    const parts = martyrCode.replace("MTG-", "").split("-");
    if (parts.length >= 3) {
      return `Khu ${parts[0]} - Hàng ${parts[1]} - Mộ số ${parts[2]}`;
    }
    return "Không có thông tin";
  };

  return (
    <div className="relative-grave-container">
      <Header />
      <div className="page-title">
        <h1>Danh Sách Mộ Liệt Sĩ Của Bạn</h1>
        <div className="relative-guide-section">
          <div className="relative-guide-content">
            <h3 className="relative-guide-title">Hướng dẫn sử dụng:</h3>
            <ul className="relative-guide-list">
              <li className="relative-guide-item">
                <i className="fas fa-info-circle relative-guide-icon"></i>
                <span className="relative-guide-text">Xem Chi Tiết: Xem thông tin chi tiết về mộ liệt sĩ</span>
              </li>
              <li className="relative-guide-item">
                <i className="fas fa-plus-circle relative-guide-icon"></i>
                <span className="relative-guide-text">Tạo Yêu Cầu Mới: Tạo các yêu cầu như xem báo cáo tình trạng mộ, đặt dịch vụ riêng, đăng ký thêm dịch vụ cho mộ thân nhân</span>
              </li>
            </ul>
            <p className="relative-guide-note">
              <i className="fas fa-exclamation-circle relative-guide-note-icon"></i>
              <span className="relative-guide-note-text">Lưu ý: Mỗi tài khoản chỉ được tạo tối đa 10 yêu cầu trong 1 tháng</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="relative-grave-list">
        {graves.map((grave) => {
          const info = grave.matyrGraveInformations[0];
          const imageUrl = grave.images[0]?.urlPath;
          
          return (
            <div key={grave.martyrId} className="relative-grave-card">
              <div className="relative-grave-image-wrapper">
                <img
                  src={imageUrl || DEFAULT_GRAVE_IMAGE}
                  alt={info.name}
                  className="relative-grave-image"
                  onError={(e) => {
                    e.target.src = DEFAULT_GRAVE_IMAGE;
                  }}
                />
              </div>
              
              <div className="relative-grave-content">
                <div className="relative-grave-info">
                  <h2 className="relative-grave-martyr-name">{info.name}</h2>
                  <div className="info-row">
                    <span className="relative-grave-label">Ngày hy sinh:</span>
                    <span className="info-value">{info.dateOfSacrifice}</span>
                  </div>
                  <div className="info-row">
                    <span className="relative-grave-label">Vị trí:</span>
                    <span className="info-value">{formatGraveLocation(grave.martyrCode)}</span>
                  </div>
                  <div className="info-row">
                    <span className="relative-grave-label">Quê quán:</span>
                    <span className="info-value">{info.homeTown}</span>
                  </div>
                </div>
                
                <div className="relative-grave-actions">
                  <Link to={`/chitietmo/${grave.martyrId}`} className="action-button primary">
                    Xem Chi Tiết
                  </Link>
                  <Link 
                    to="/request-customer/" 
                    className="action-button secondary"
                  >
                    Tạo Yêu Cầu Mới
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
};

export default RelativeGrave;
