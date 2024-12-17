import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import "./UserProfile.css";
import Header from "../../../components/Header/header";
import Footer from "../../../components/Footer/footer";
import placeholder from "../../../assets/images/placeholder.jpg";
import { getProfile, updateProfile, changePassword } from "../../../APIcontroller/API";
import { jwtDecode } from "jwt-decode";
import Loading from "../../../components/Loading/Loading";
import { storage } from "../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    fullName: "",
    dateOfBirth: "",
    address: "",
    avatarPath: placeholder,
    emailAddress: "",
  });
  const [toasts, setToasts] = useState([]);
  const [passwordData, setPasswordData] = useState({
    phoneNumber: "",
    oldPassword: "",
    password: "",
    confirmPassword: ""
  });
  const [passwordErrors, setPasswordErrors] = useState({
    phoneNumber: "",
    oldPassword: "",
    password: "",
    confirmPassword: ""
  });

  const getAccountIdFromToken = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.accountId;
    }
    return null;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const accountId = getAccountIdFromToken();
        if (!accountId) {
          throw new Error('Không tìm thấy thông tin người dùng');
        }

        const profileData = await getProfile(accountId);
        setUserData({
          fullName: profileData.fullName || "",
          dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : "",
          address: profileData.address || "",
          avatarPath: profileData.avatarPath || placeholder,
          emailAddress: profileData.emailAddress || "",
        });
      } catch (error) {
        console.error('Fetch profile error:', error);
        setMessage({
          type: "error",
          text: "Không thể tải thông tin người dùng. Vui lòng thử lại sau.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      setPasswordData(prev => ({
        ...prev,
        phoneNumber: decodedToken.phoneNumber || ""
      }));
    }
  }, []);

  const showToast = (type, text) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, text }]);
    
    // Tự động ẩn toast sau 3 giây
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const accountId = getAccountIdFromToken();
      if (!accountId) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      const formattedData = {
        ...userData,
        dateOfBirth: new Date(userData.dateOfBirth).toISOString(),
      };

      await updateProfile(accountId, formattedData);
      showToast("success", "Cập nhật thông tin thành công!");
    } catch (error) {
      console.error('Update profile error:', error);
      showToast("error", "Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    
    // Validate file type
    if (file && !file.type.startsWith('image/')) {
      setMessage({
        type: "error",
        text: "Vui lòng chọn file ảnh.",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file && file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Kích thước ảnh không được vượt quá 5MB.",
      });
      return;
    }

    if (file) {
      try {
        setIsLoading(true);
        
        // 1. Upload ảnh lên Firebase Storage
        const storageRef = ref(storage, `accounts/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        // 2. Cập nhật URL vào state
        setUserData(prev => ({
          ...prev,
          avatarPath: downloadURL
        }));

        // 3. Cập nhật URL vào database thông qua API
        const accountId = getAccountIdFromToken();
        if (!accountId) {
          throw new Error('Không tìm thấy thông tin người dùng');
        }

        await updateProfile(accountId, {
          ...userData,
          avatarPath: downloadURL
        });

        showToast("success", "Tải ảnh lên và cập nhật thông tin thành công!");
      } catch (error) {
        console.error('Image upload error:', error);
        showToast("error", "Không thể cập nhật ảnh đại diện. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validatePassword = () => {
    const errors = {};
    
    // Validate số điện thoại
    if (!passwordData.phoneNumber) {
      errors.phoneNumber = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10}$/.test(passwordData.phoneNumber)) {
      errors.phoneNumber = "Số điện thoại không hợp lệ (10 số)";
    }
    
    // Validate mật khẩu hiện tại
    if (!passwordData.oldPassword) {
      errors.oldPassword = "Vui lòng nhập mật khẩu hiện tại";
    }
    
    // Validate mật khẩu mới
    if (!passwordData.password) {
      errors.password = "Vui lòng nhập mật khẩu mới";
    } else {
      // Kiểm tra độ dài tối thiểu
      if (passwordData.password.length < 6) {
        errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      }
      // Kiểm tra có ít nhất 1 chữ hoa
      else if (!/[A-Z]/.test(passwordData.password)) {
        errors.password = "Mật khẩu phải chứa ít nhất một chữ cái viết hoa và một ký tự đặc biệt";
      }
      // Kiểm tra có ít nhất 1 ký tự đặc biệt
      else if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.password)) {
        errors.password = "Mật khẩu phải chứa ít nhất một chữ cái viết hoa và một ký tự đặc biệt";
      }
      // Kiểm tra không được trùng với mật khẩu cũ
      else if (passwordData.password === passwordData.oldPassword) {
        errors.password = "Mật khẩu mới không được trùng với mật khẩu hiện tại";
      }
    }
    
    // Validate xác nhận mật khẩu
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (passwordData.password !== passwordData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp nhau
    if (passwordData.password !== passwordData.confirmPassword) {
      showToast("error", "Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    try {
      setIsLoading(true);
      const response = await changePassword({
        phoneNumber: passwordData.phoneNumber,
        oldPassword: passwordData.oldPassword,
        password: passwordData.password,
        confirmPassword: passwordData.confirmPassword
      });
      
      // Reset form sau khi thành công
      setPasswordData(prev => ({
        ...prev,
        oldPassword: "",
        password: "",
        confirmPassword: ""
      }));
      
      showToast("success", "Đổi mật khẩu thành công!");
    } catch (error) {
      console.error('Change password error:', error);
      let errorMessage = "Có lỗi xảy ra khi đổi mật khẩu";
      
      // Xử lý các trường hợp lỗi từ backend
      if (error.response) {
        switch (error.response.data) {
          case "Not matching password":
            errorMessage = "Mật khẩu mới và xác nhận mật khẩu không khớp";
            break;
          case "AccountName not found":
            errorMessage = "Không tìm thấy tài khoản";
            break;
          case "Email or Password not true, check again":
            errorMessage = "Mật khẩu hiện tại không đúng";
            break;
          default:
            errorMessage = error.response.data || errorMessage;
        }
      }
      
      showToast("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div style={{ position: 'relative', minHeight: 'calc(100vh - 64px)' }}>
          <Loading 
            text="Đang tải thông tin..." 
            color="#4F46E5"
            size={64}
          />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span>{toast.text}</span>
            <button 
              className="toast-close"
              onClick={() => removeToast(toast.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="profile-container">
        <div className="profile-header">
          <h1>Thông Tin Cá Nhân</h1>
          <div className="avatar-section">
            <div className="avatar-container">
              <img
                src={userData.avatarPath || placeholder}
                alt="Ảnh đại diện"
                className="avatar-image"
                onError={(e) => {
                  e.target.src = placeholder;
                }}
              />
              <label className="avatar-upload" htmlFor="avatar-input">
                <Camera size={20} color="white" />
              </label>
              <input
                type="file"
                id="avatar-input"
                className="avatar-upload-input"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Thông tin cơ bản
          </button>
          <button
            className={`tab-button ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            Bảo mật
          </button>
        </div>

        <div className={`tab-content ${activeTab === "profile" ? "active" : ""}`}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Họ và tên</label>
              <input
                id="fullName"
                type="text"
                value={userData.fullName}
                onChange={(e) =>
                  setUserData({ ...userData, fullName: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Ngày sinh</label>
              <input
                id="dateOfBirth"
                type="date"
                value={userData.dateOfBirth}
                onChange={(e) =>
                  setUserData({ ...userData, dateOfBirth: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Địa chỉ</label>
              <input
                id="address"
                type="text"
                value={userData.address}
                onChange={(e) =>
                  setUserData({ ...userData, address: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="emailAddress">Email</label>
              <input
                id="emailAddress"
                type="email"
                value={userData.emailAddress}
                onChange={(e) =>
                  setUserData({ ...userData, emailAddress: e.target.value })
                }
              />
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
            </button>
          </form>
        </div>

        <div className={`tab-content ${activeTab === "security" ? "active" : ""}`}>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label htmlFor="phoneNumber">Số điện thoại</label>
              <input
                id="phoneNumber"
                type="text"
                placeholder="Nhập số điện thoại"
                value={passwordData.phoneNumber}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, phoneNumber: e.target.value })
                }
                className={passwordErrors.phoneNumber ? "error" : ""}
              />
              {passwordErrors.phoneNumber && (
                <div className="error-message">
                  {passwordErrors.phoneNumber}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
              <input
                id="currentPassword"
                type="password"
                placeholder="Nhập mật khẩu hiện tại"
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, oldPassword: e.target.value })
                }
                className={passwordErrors.oldPassword ? "error" : ""}
              />
              {passwordErrors.oldPassword && (
                <div className="error-message">
                  {passwordErrors.oldPassword}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Mật khẩu mới</label>
              <input
                id="newPassword"
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={passwordData.password}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, password: e.target.value })
                }
                className={passwordErrors.password ? "error" : ""}
              />
              {passwordErrors.password && (
                <div className="error-message">
                  {passwordErrors.password}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                className={passwordErrors.confirmPassword ? "error" : ""}
              />
              {passwordErrors.confirmPassword && (
                <div className="error-message">
                  {passwordErrors.confirmPassword}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </form>
        </div>

        {message.text && (
          <div className={`alert ${message.type}`}>{message.text}</div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
