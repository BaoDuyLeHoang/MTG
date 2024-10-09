import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "../../components/Header/header";
import "./CheckOutPage.css";
import logo from "../../assets/logo/logo-giao-duc-an-nhien.png";
import { FaTrashAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { createOrder, getCartItemsByCustomerId } from "../../APIcontroller/API";

const CheckOut = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      const accountId = location.state?.accountId || user?.accountId;
      if (accountId) {
        try {
          const response = await getCartItemsByCustomerId(accountId);
          console.log("Fetched cart items:", response);
          if (response && response.cartItemList && Array.isArray(response.cartItemList)) {
            setCartItems(response.cartItemList);
          } else {
            setCartItems([]);
          }
        } catch (error) {
          console.error("Error fetching cart items:", error);
          alert("Có lỗi xảy ra khi tải giỏ hàng. Vui lòng thử lại sau.");
          setCartItems([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        alert("Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.");
      }
    };

    fetchCartItems();
  }, [location.state, user]);

  const paymentMethods = [
    { id: "cash", name: "Thanh toán tiền mặt" },
    { id: "VNPay", name: "VNPay" },
    { id: "momo", name: "Ví Momo" },
  ];

  const handlePaymentMethodChange = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleRemoveItem = (cartId) => {
    setCartItems(cartItems.filter(item => item.cartId !== cartId));
  };

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.serviceView?.price || 0), 0);
  }, [cartItems]);

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán");
      return;
    }

    setIsLoading(true);

    try {
      const response = await createOrder(user.accountId);

      alert("Đặt hàng thành công!");
      navigate('/order-confirmation', { state: { orderId: response.orderId } });
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
              {cartItems.map((item) => (
                <div key={item.cartId} className="product-item">
                  <span className="product-name">{item.serviceView.serviceName}</span>
                  <span className="product-price">{item.serviceView.price.toLocaleString()}đ</span>
                  <span className="product-action">
                    <FaTrashAlt 
                      onClick={() => handleRemoveItem(item.cartId)}
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
            <button 
              className="checkout-button" 
              onClick={handlePayment}
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Thanh toán"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;