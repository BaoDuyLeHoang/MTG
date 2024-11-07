import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // Add this import
import AlertMessage from "../../../components/AlertMessage/AlertMessage"; // Add this import

import "./ServiceListing.css";
import { getAllServices, addToCart } from "../../../APIcontroller/API";
import Header from "../../../components/Header/header"; // Import the Header component
import { login } from "../../../APIcontroller/LoginController";

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

  useEffect(() => {
    const layDichVu = async () => {
      try {
        setDangTai(true);
        const dichVuDaLay = await getAllServices();
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
    if (!checkSession()) {
      console.log("Session expired, redirecting to login");
      sessionStorage.setItem("pendingServiceId", dichVu.serviceId);
      console.log("Saved pendingServiceId to session storage:", dichVu.serviceId);
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("accessToken");
    const martyrId = sessionStorage.getItem("selectedMartyrId");
    const accountId = user ? user.accountId : null;
    console.log("Token:", token);
    console.log("AccountId:", accountId);

    if (token && accountId) {
      try {
        const cartItem = {
          serviceId: dichVu.serviceId,
          accountId: accountId,
          martyrId: martyrId,
        };
        console.log("Adding to cart:", cartItem);
        await addToCart(cartItem, token);
        setGioHang([...gioHang, dichVu]);
        console.log("Successfully added to cart");

        // Show success alert
        setAlertMessage("Dịch vụ đã được thêm vào giỏ hàng thành công!");
        setAlertSeverity("success");
        setAlertOpen(true);

        // Save the serviceId to session storage
        const savedCartIds = JSON.parse(sessionStorage.getItem("savedCartIds") || "[]");
        if (!savedCartIds.includes(dichVu.serviceId)) {
          savedCartIds.push(dichVu.serviceId);
          sessionStorage.setItem("savedCartIds", JSON.stringify(savedCartIds));
          console.log("Updated savedCartIds in session storage:", savedCartIds);
        } else {
          console.log("ServiceId already in savedCartIds:", dichVu.serviceId);
        }

      } catch (error) {
        console.error("Error adding to cart:", error);
        // Show error alert
        setAlertMessage("Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại.");
        setAlertSeverity("error");
        setAlertOpen(true);
      }
    } else {
      console.log("User not logged in or accountId not available");
      if (!token) {
        console.log("No token found, redirecting to login");
        sessionStorage.setItem("pendingServiceId", dichVu.serviceId);
        console.log("Saved pendingServiceId to session storage:", dichVu.serviceId);
        navigate("/login");
      } else if (!accountId) {
        console.log("No accountId found, but token exists");
        // Handle the case where the token exists but accountId is missing
        // You might want to refresh the user data or redirect to a profile completion page
      }
    }
  };

  const coTrongGioHang = (serviceId) => {
    return gioHang.some((item) => item.serviceId === serviceId);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  if (dangTai) {
    return <div className="sl-loading">Đang tải dịch vụ...</div>;
  }

  if (loiTai) {
    return <div className="sl-error">{loiTai}</div>;
  }

  return (
    <div className="service-listing-page">
      <Header />
      <div className="sl-container">
        <div className="sl-header">
          <h1>Dịch Vụ Tưởng Niệm</h1>
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
                    coTrongGioHang(dv.serviceId) ? "sl-in-cart" : ""
                  }`}
                  onClick={() => themVaoGioHang(dv)}
                  disabled={coTrongGioHang(dv.serviceId)}
                >
                  {coTrongGioHang(dv.serviceId)
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
    </div>
  );
};

export default ServiceListing;
