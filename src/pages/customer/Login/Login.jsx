import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../../components/Header/header";
import Footer from "../../../components/Footer/footer";
import AlertMessage from "../../../components/AlertMessage/AlertMessage";
import "../Login/Login.css";
import { useAuth } from "../../../context/AuthContext";
import { ROLES } from "../../../utils/auth";
import { addToCart } from "../../../services/cart";
import { Link } from "react-router-dom";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithCredentials } = useAuth();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await loginWithCredentials(phoneNumber, password);
      console.log("Full login API response:", result);

      if (result.success) {
        console.log("Login successful, user:", result.user);

        // Check for pending cart items
        const savedCartItems = JSON.parse(sessionStorage.getItem("savedCartItems") || "[]");
        console.log("Saved cart items:", savedCartItems);

        if (savedCartItems.length > 0 && result.user.accountId) {
          try {
            console.log("Adding pending items to cart");
            
            // Format the items into the expected structure
            for (let i = 0; i < savedCartItems.length; i++) {
              const formattedItem = [{
                accountId: result.user.accountId,
                serviceId: savedCartItems[i].serviceId,
                martyrId: savedCartItems[i].martyrId.toString()
              }];
              
              console.log("Adding item to cart:", formattedItem);
              await addToCart(formattedItem);
            }
            
            console.log("Successfully added all items to cart");

            // Clear the pending items
            sessionStorage.removeItem("savedCartItems");

            // Redirect to cart page
            navigate("/cart");
            return;
          } catch (error) {
            console.error("Error adding items to cart:", error);
            setAlertMessage("Có lỗi xảy ra khi thêm vào giỏ hàng");
            setOpenAlert(true);
          }
        }

        // Kiểm tra xem có đường dẫn redirect không
        const from = location.state?.from;
        
        if (from && result.user.roleId === 4) {
          // Nếu có đường dẫn redirect, navigate đến đó
          navigate(from);
        } else {
          // Nếu không có, xử lý redirect theo role như cũ
          switch (result.user.role) {
            case ROLES.ADMIN:
              navigate("/admin");
              break;
            case ROLES.MANAGER:
              navigate("/manager");
              break;
            case ROLES.STAFF:
              navigate("/staff");
              break;
            case ROLES.CUSTOMER:
              navigate("/user");
              break;
            default:
              console.error("Unknown user role:", result.user.role);
              setError(`Unknown user role: ${result.user.role}`);
          }
        }
      } else {
        console.error("Đăng nhập thất bại:", result);
        setAlertMessage(
          result.error
            ? translateErrorMessage(result.error)
            : "Đăng nhập thất bại. Vui lòng thử lại."
        );
        setOpenAlert(true);
      }
    } catch (error) {
      console.error("Lỗi trong quá trình đăng nhập:", error);
      setAlertMessage("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
      setOpenAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const translateErrorMessage = (error) => {
    const translations = {
      "Login failed. Please try again.":
        "Đăng nhập thất bại. Vui lòng thử lại.",
      "Invalid credentials": "Thông tin đăng nhập không hợp lệ",
      "User not found": "Không tìm thấy người dùng",
      "Incorrect password": "Mật khẩu không chính xác",
      "Account is locked": "Tài khoản đã bị khóa",
      "Too many failed attempts":
        "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau.",
      // Add more translations as needed
    };
    return translations[error] || "Đăng nhập thất bại. Vui lòng thử lại.";
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  return (
    <div className="login-page">
      <Header />
      <div className="login-container">
        <AlertMessage
          open={openAlert}
          handleClose={handleCloseAlert}
          severity="error"
          message={alertMessage}
        />
        <div className="login-content">
          <div className="welcome-text">
            <h1>Nghĩa Trang Liệt Sĩ TPHCM</h1>
            <p>Đăng nhập để sử dụng dịch vụ tìm kiếm và chăm sóc phần mộ liệt sĩ theo ý của bạn</p>
          </div>
          <div className="login-box">
            <form onSubmit={handleLogin} className="login-form">
              <div className="input-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Mật khẩu</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-btn" disabled={isLoading}>
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
              <div className="forgot-password-register-container">
                <a href="#" className="forgot-password">
                  Quên mật khẩu?
                </a>
                <Link to="/register" className="forgot-password">
                  Đăng ký
                </Link>
              </div>
              {error && <p className="error-message">{error}</p>}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
