import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "../../../components/Header/header";
import Footer from "../../../components/Footer/footer";
import AlertMessage from "../../../components/AlertMessage/AlertMessage";
import "./CheckOutPage.css";
import { FaTrashAlt, FaWallet, FaCalendarAlt } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import {getCheckoutItemsByCustomerId, getWalletBalance } from "../../../APIcontroller/API";
import { createOrder } from "../../../services/orders";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loading from '../../../components/Loading/Loading';

const CheckOut = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [completionDate, setCompletionDate] = useState(null);
  const [customerNote, setCustomerNote] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      const accountId = location.state?.accountId || user?.accountId;
      if (accountId) {
        try {
          const response = await getCheckoutItemsByCustomerId(accountId);
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

  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (user?.accountId) {
        try {
          const response = await getWalletBalance(user.accountId);
          setWalletBalance(response.customerBalance || 0);
        } catch (error) {
          console.error("Error fetching wallet balance:", error);
          setWalletBalance(0);
        }
      }
    };

    fetchWalletBalance();
  }, [user]);

  const paymentMethods = [
    { 
      id: "VNPay", 
      name: "VNPay",
      logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
    },
    { 
      id: "momo", 
      name: "Ví Momo",
      logo: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
    },
    {
      id: "balance",
      name: `Số dư tài khoản (${Number(walletBalance).toLocaleString()}đ)`,
      icon: <FaWallet size={24} color="#4F46E5" />
    }
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

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const validateCompletionDate = (date) => {
    if (!date) {
      setAlertMessage("Vui lòng chọn ngày hoàn thành");
      setAlertOpen(true);
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 3);

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < minDate) {
      setAlertMessage("Ngày hoàn thành dự kiến phải ít nhất sau 3 ngày kể từ bây giờ");
      setAlertOpen(true);
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      setAlertMessage("Vui lòng chọn phương thức thanh toán");
      setAlertOpen(true);
      return;
    }

    if (!validateCompletionDate(completionDate)) {
      return;
    }

    setIsLoading(true);

    try {
      if (selectedPaymentMethod === "balance" && walletBalance < totalPrice) {
        setAlertMessage("Số dư tài khoản không đủ để thực hiện giao dịch");
        setAlertSeverity("error");
        setAlertOpen(true);
        return;
      }

      const localDate = new Date(completionDate);
      localDate.setHours(7, 0, 0, 0);

      const orderData = {
        expectedCompletionDate: localDate.toISOString(),
        note: customerNote || ""
      };

      const response = await createOrder(
        user.accountId,
        selectedPaymentMethod,
        orderData
      );

      if (selectedPaymentMethod === "balance") {
        if (response.message && response.message.includes("thành công")) {
          const newBalance = await getWalletBalance(user.accountId);
          setWalletBalance(newBalance);
          
          setAlertMessage("Đặt hàng thành công!");
          setAlertSeverity("success");
          setAlertOpen(true);
          
          setTimeout(() => {
            navigate('/checkout-success');
          }, 1500);
        } else {
          setAlertMessage(response.message || "Số dư tài khoản không đủ để thực hiện giao dịch");
          setAlertSeverity("error");
          setAlertOpen(true);
        }
      } else if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      }
    } catch (error) {
      console.error("Error creating order:", error);
      
      if (error.response?.status === 400) {
        setAlertMessage(error.response.data);
      } else {
        setAlertMessage("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.");
      }
      
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const renderWalletInfo = () => {
    if (selectedPaymentMethod === "balance") {
      const remainingBalance = walletBalance > 0 ? walletBalance - totalPrice : 0;
      return (
        <div className="wallet-info">
          <div className="wallet-detail">
            <span>Số dư hiện tại:</span>
            <span>{Number(walletBalance).toLocaleString()}đ</span>
          </div>
          <div className="wallet-detail">
            <span>Tổng thanh toán:</span>
            <span>{totalPrice.toLocaleString()}đ</span>
          </div>
          <div className="wallet-detail remaining">
            <span>Số dư còn lại:</span>
            <span className={remainingBalance <= 0 ? 'negative' : ''}>
              {Number(remainingBalance).toLocaleString()}đ
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="checkout-content">
          <Loading fullScreen={false} text="Đang tải thông tin thanh toán..." />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="checkout-content">
        <div className="page-title">
          <h2>Thanh Toán</h2>
        </div>
        <div className="checkout-form">
          <div className="checkout-form-columns">
            <div className="checkout-form-left">
              <h3>Dịch vụ đã chọn</h3>
              <div className="product-list">
                <div className="product-item product-header">
                  <span className="product-name">Tên sản phẩm</span>
                  <span className="product-price">Đơn giá</span>
                </div>
                {cartItems.map((item) => (
                  <div key={item.cartId} className="product-item">
                    <span className="product-name">{item.serviceView.serviceName}</span>
                    <span className="product-price">{item.serviceView.price.toLocaleString()}đ</span>
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
                  <label 
                    key={method.id} 
                    className={`payment-method ${selectedPaymentMethod === method.id ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={() => handlePaymentMethodChange(method.id)}
                    />
                    {method.logo ? (
                      <img src={method.logo} alt={method.name} className="payment-logo" />
                    ) : method.icon}
                    <span className="payment-name">{method.name}</span>
                  </label>
                ))}
              </div>
              {renderWalletInfo()}
            </div>
          </div>

          <div className="additional-info-section">
            <h3>Thông tin bổ sung</h3>
            <div className="additional-info">
              <div className="form-group">
                <label>Ngày hoàn thành dự kiến</label>
                <div className="datepicker-container">
                  <DatePicker
                    selected={completionDate}
                    onChange={(date) => setCompletionDate(date)}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date(new Date().setDate(new Date().getDate() + 3))}
                    placeholderText="Chọn ngày hoàn thành"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-helper-text">
                  Thời gian hoàn thành tối thiểu là 3 ngày kể từ ngày đặt hàng
                </div>
              </div>

              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="Nhập ghi chú cho đơn hàng của bạn"
                  rows={4}
                />
                <div className="form-helper-text">
                  Thêm bất kỳ thông tin bổ sung nào bạn muốn gửi cho chúng tôi
                </div>
              </div>
            </div>
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

export default CheckOut;
