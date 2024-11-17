import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "../../../components/Header/header";
import AlertMessage from "../../../components/AlertMessage/AlertMessage";
import "./CheckOutPage.css";
import { FaTrashAlt } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { createOrder, getCheckoutItemsByCustomerId } from "../../../APIcontroller/API";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
    const minDate = new Date(today.setDate(today.getDate() + 3));
    
    if (date < minDate) {
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
      const response = await createOrder(
        user.accountId, 
        selectedPaymentMethod, 
        completionDate,
        customerNote
      );

      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        setAlertMessage("Đặt hàng thành công!");
        setAlertSeverity("success");
        setAlertOpen(true);
        navigate('/order-confirmation', { state: { orderId: response.orderId } });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setAlertMessage("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.");
      setAlertOpen(true);
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
                    <img src={method.logo} alt={method.name} className="payment-logo" />
                    <span className="payment-name">{method.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="additional-info-section">
            <h3>Thông tin bổ sung</h3>
            <div className="additional-info">
              <div className="form-group">
                <label>Ngày hoàn thành dự kiến *</label>
                <DatePicker
                  selected={completionDate}
                  onChange={(date) => setCompletionDate(date)}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  placeholderText="dd/mm/yyyy"
                  className="form-control"
                  required
                  locale="vi"
                  isClearable
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={15}
                  customInput={
                    <input
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                  }
                />
              </div>
              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="Nhập ghi chú cho đơn hàng (không bắt buộc)"
                  rows={4}
                />
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
    </div>
  );
};

export default CheckOut;
