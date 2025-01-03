import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // Add this import
import AlertMessage from "../../../components/AlertMessage/AlertMessage"; // Add this import

import "./ServiceListing.css";
import { getAllServices, addToCart } from "../../../APIcontroller/API";
import { getGraveServices } from "../../../services/graves";
import Header from "../../../components/Header/header"; // Import the Header component
import Footer from "../../../components/Footer/footer";
import { login } from "../../../APIcontroller/LoginController";
import Loading from '../../../components/Loading/Loading';

const ServiceListing = () => {
  const [dichVu, setDichVu] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [loiTai, setLoiTai] = useState(null);

  const [danhMucDaChon, setDanhMucDaChon] = useState("all");
  const [gioHang, setGioHang] = useState([]);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [dichVuMoiTrang] = useState(6);

  const navigate = useNavigate();
  const { user, checkSession } = useAuth(); // Add this line to use the AuthContext

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const [martyrName, setMartyrName] = useState("");
  const [martyrId, setMartyrId] = useState("");

  const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCartUpdateTrigger(prev => prev + 1);
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const layDichVu = async () => {
      try {
        setDangTai(true);
        const dichVuDaLay = await getGraveServices(sessionStorage.getItem("selectedMartyrId"));
        setDichVu(dichVuDaLay);
        setLoiTai(null);
      } catch (err) {
        setLoiTai("Không thể tải dịch vụ. Vui lòng thử lại sau.");
        console.error("Lỗi khi tải dịch vụ:", err);
      } finally {
        setDangTai(false);
      }
    };

    layDichVu();
  }, [sessionStorage.getItem("selectedMartyrId")]);

  useEffect(() => {
    // Get martyr ID and name from storage
    const savedMartyrId = sessionStorage.getItem("selectedMartyrId");
    const savedMartyrName = localStorage.getItem("selectedMartyrName");
    if (savedMartyrId) {
      setMartyrId(savedMartyrId);
    }
    if (savedMartyrName) {
      setMartyrName(savedMartyrName);
    }
  }, []);

  const dichVuDaLoc =
    danhMucDaChon === "all"
      ? dichVu
      : dichVu.filter((dv) => dv.categoryId.toString() === danhMucDaChon);

  const chiSoCuoiCung = trangHienTai * dichVuMoiTrang;
  const chiSoDauTien = chiSoCuoiCung - dichVuMoiTrang;
  const dichVuHienTai = dichVuDaLoc.slice(chiSoDauTien, chiSoCuoiCung);
  const tongSoTrang = Math.ceil(dichVuDaLoc.length / dichVuMoiTrang);

  const doiTrang = (soTrang) => {
    setTrangHienTai(soTrang);
  };

  useEffect(() => {
    setTrangHienTai(1);
  }, [danhMucDaChon]);

  const themVaoGioHang = async (dichVu) => {
    try {
      // Get saved cart items with martyrId mapping
      const savedCartItems = JSON.parse(sessionStorage.getItem("savedCartItems") || "[]");
      
      // Check if service is already in cart for this specific martyr
      const isServiceExist = savedCartItems.some(item => 
        item.serviceId === dichVu.serviceId && 
        item.martyrId === martyrId
      );
      
      if (isServiceExist) {
        setAlertMessage("Bạn đã đặt dịch vụ này cho liệt sĩ này rồi. Vui lòng chọn dịch vụ khác");
        setAlertSeverity("error");
        setAlertOpen(true);
        return;
      }

      // If user is logged in, use API
      if (user) {
        const cartData = [{
          accountId: user.accountId,
          serviceId: dichVu.serviceId,
          martyrId: martyrId
        }];

        await addToCart(cartData);
      }

      // Save to session storage with martyrId mapping
      savedCartItems.push({
        serviceId: dichVu.serviceId,
        martyrId: martyrId
      });
      sessionStorage.setItem("savedCartItems", JSON.stringify(savedCartItems));
      
      setAlertMessage("Dịch vụ đã được thêm vào giỏ hàng thành công!");
      setAlertSeverity("success");
      setAlertOpen(true);

    } catch (error) {
      console.error("Error adding to cart:", error);
      setAlertMessage(error.message);
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  const coTrongGioHang = useCallback((serviceId) => {
    const savedCartItems = JSON.parse(sessionStorage.getItem("savedCartItems") || "[]");
    return savedCartItems.some(item => 
      item.serviceId === serviceId && 
      item.martyrId === martyrId
    );
  }, [martyrId, cartUpdateTrigger]);

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const handleMartyrClick = () => {
    navigate(`/chitietmo/${martyrId}`);
  };

  const handleServiceAction = async (dichVu) => {
    if (dichVu.isScheduleService) {
      // Navigate to scheduling page with service details
      navigate(`/schedule-service/${dichVu.serviceId}`, {
        state: {
          martyrId: martyrId,
          serviceName: dichVu.serviceName,
          price: dichVu.price
        }
      });
    } else {
      // Existing add to cart logic
      await themVaoGioHang(dichVu);
    }
  };

  if (dangTai) {
    return (
      <div className="service-listing-page">
        <Header />
        <div className="sl-container">
          <Loading fullScreen={false} text="Đang tải danh sách dịch vụ..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (loiTai) {
    return (
      <div className="service-listing-page">
        <Header />
        <div className="sl-container">
          <div className="sl-error">{loiTai}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="service-listing-page">
      <Header />
      <div className="sl-container">
        <div className="sl-header">
          <h1>Dịch Vụ Có Sẵn Của Mộ Phần</h1>
        </div>
        <div className="sl-martyr-info">
          <div className="service-martyr-card">
            <div className="service-martyr-icon">
              <i className="fas fa-user-circle"></i>
            </div>
            <div className="service-martyr-details">
              <span className="service-martyr-label">Bạn đang đặt dịch vụ cho liệt sĩ:</span>
              <h2 
                className="service-martyr-name"
                onClick={handleMartyrClick}
                style={{ cursor: 'pointer' }}
                title="Xem chi tiết"
              >
                {martyrName}
              </h2>
            </div>
          </div>
        </div>
        <div className="sl-filter-container">
          <select
            className="sl-category-select"
            value={danhMucDaChon}
            onChange={(e) => setDanhMucDaChon(e.target.value)}
          >
            <option value="all">Tất cả dịch vụ</option>
            {[...new Set(dichVu.map((dv) => dv.categoryId))].map(
              (categoryId) => (
                <option key={categoryId} value={categoryId.toString()}>
                  {dichVu.find((dv) => dv.categoryId === categoryId)
                    ?.categoryName || `Danh mục ${categoryId}`}
                </option>
              )
            )}
          </select>
        </div>

        <div className="sl-services-grid">
          {dichVuHienTai.map((dv) => (
            <div key={dv.serviceId} className="sl-service-card">
              <div className="sl-service-image-container">
                <img
                  src={dv.imagePath || "/api/placeholder/400/300"}
                  alt={dv.serviceName}
                  className="sl-service-image"
                />
                <span className="sl-service-category">{dv.categoryName}</span>
              </div>
              <div className="sl-service-content">
                <h2 className="sl-service-title">{dv.serviceName}</h2>
                <p className="sl-service-description">{dv.description}</p>
                <p className="sl-service-price">
                  {dv.price.toLocaleString("vi-VN")} đ
                </p>
                <button
                  className={`sl-add-to-cart-button ${
                    dv.isScheduleService ? 'sl-schedule-button' : 
                    coTrongGioHang(dv.serviceId) ? "sl-in-cart" : ""
                  }`}
                  onClick={() => handleServiceAction(dv)}
                  disabled={!dv.isScheduleService && coTrongGioHang(dv.serviceId)}
                >
                  {dv.isScheduleService
                    ? "Đặt dịch vụ"
                    : coTrongGioHang(dv.serviceId)
                    ? "Đã thêm vào giỏ"
                    : "Thêm vào giỏ"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {tongSoTrang > 1 && (
          <div className="sl-pagination">
            <button
              className="sl-pagination-button"
              onClick={() => doiTrang(trangHienTai - 1)}
              disabled={trangHienTai === 1}
            >
              Trước
            </button>

            <div className="sl-pagination-numbers">
              {[...Array(tongSoTrang)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`sl-pagination-number ${
                    trangHienTai === index + 1
                      ? "sl-pagination-number-active"
                      : ""
                  }`}
                  onClick={() => doiTrang(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              className="sl-pagination-button"
              onClick={() => doiTrang(trangHienTai + 1)}
              disabled={trangHienTai === tongSoTrang}
            >
              Tiếp
            </button>
          </div>
        )}
      </div>
      <AlertMessage
        open={alertOpen}
        handleClose={handleAlertClose}
        severity={alertSeverity}
        message={alertMessage}
      />
      <Footer />
    </div>
  );
};

export default ServiceListing;
