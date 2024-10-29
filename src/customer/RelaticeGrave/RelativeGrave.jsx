import React, { useState, useEffect } from "react";
import "./RelativeGrave.css";
import Header from "../../components/Header/header";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getGravesByCustomerCode } from "../../APIcontroller/API";

const RelativeGrave = () => {
  const [graves, setGraves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchGraves = async () => {
      try {
        if (!user?.customerCode) {
          
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('accessToken');
        console.log("Fetching graves for customer code:", user.customerCode); // Debug log
        
        const response = await getGravesByCustomerCode(user.customerCode, token);
        console.log("API Response:", response); // Debug log
        
        // Check if response is the data directly (not nested in .data property)
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
    return <div className="loading-state">Loading...</div>;
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

  return (
    <div className="relative-grave-container">
      <Header />
      <div className="page-title">
        <h1>Danh Sách Mộ Liệt Sĩ Của Bạn</h1>
      </div>
      
      <div className="relative-grave-list">
        {graves.map((grave) => {
          const info = grave.matyrGraveInformations[0]; // Get the first information object
          const imageUrl = grave.images[0]?.urlPath; // Get the first image URL
          
          return (
            <div key={grave.martyrId} className="relative-grave-card">
              <div className="relative-grave-image-wrapper">
                <img
                  src={imageUrl}
                  alt={info.name}
                  className="relative-grave-image"
                />
              </div>
              
              <div className="relative-grave-content">
                <div className="relative-grave-info">
                  <h2 className="relative-grave-martyr-name">{info.name}</h2>
                  <div className="info-row">
                    <span className="relative-grave-label">Ngày hy sinh:</span>
                    <span className="info-value">{formatDate(info.dateOfSacrifice)}</span>
                  </div>
                  <div className="info-row">
                    <span className="relative-grave-label">Vị trí:</span>
                    <span className="info-value">Khu {grave.areaNumber}, hàng {grave.rowNumber}, mộ {grave.martyrNumber}</span>
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
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelativeGrave;
