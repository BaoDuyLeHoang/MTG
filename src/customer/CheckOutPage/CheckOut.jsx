import React, { useMemo } from "react";
import Header from "../../components/Header/header";
import "./CheckOutPage.css";
import logo from "../../assets/logo/logo-giao-duc-an-nhien.png";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
const CheckOut = () => {
  const productData = [
    { id: 1, sanPham: "Thay hoa ở mộ", donGia: 150000 },
    { id: 2, sanPham: "Dọn dẹp mộ phần", donGia: 200000 },
  ];
  const handleAction = (id) => {
    console.log(`Action for product with id ${id} is triggered`);
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const paymentMethods = [
    { id: "cash", name: "Thanh toán tiền mặt" },
    { id: "viettel", name: "VNPay" },
    { id: "momo", name: "Ví Momo" },
  ];

  const handlePaymentMethodChange = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

  const totalPrice = useMemo(() => {
    return productData.reduce((sum, product) => sum + product.donGia, 0);
  }, [productData]);

  return (
    <div>
      <Header />
      <div className="checkout-container">
        <div className="checkout-logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="checkout-divider"></div>
        <div className="checkout-title">
          <h1>Thanh Toán</h1>
        </div>
      </div>
      <div className="checkout-content">
        <div className="checkout-form">
          <div className="checkout-form-left">
            <h3>Dịch vụ đã chọn</h3>
            <div className="product-list">
              <div className="product-item product-header">
                <span className="product-name">Tên sản phẩm</span>
                <span className="product-price">Đơn giá</span>
                <span className="product-action">Xóa</span>
              </div>
              {productData.map((product) => (
                <div key={product.id} className="product-item">
                  <span className="product-name">{product.sanPham}</span>
                  <span className="product-price">{product.donGia}</span>
                  <span className="product-action">
                    <FaTrashAlt 
                      onClick={() => handleAction(product.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </span>
                </div>
              ))}
            </div>
            <div className="price-summary">
              <div className="summary-item total">
                <span>Tổng thanh toán:</span>
                <span>{totalPrice.toLocaleString()}đ</span>
              </div>
            </div>
          </div>
          <div className="checkout-form-right">
            <h3>Phương thức thanh toán</h3>
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <label key={method.id} className="payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedPaymentMethod === method.id}
                    onChange={() => handlePaymentMethodChange(method.id)}
                  />
                  <span className="payment-icon">{method.icon}</span>
                  <span className="payment-name">{method.name}</span>
                </label>
              ))}
            </div>
            <button className="checkout-button">Thanh toán</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
