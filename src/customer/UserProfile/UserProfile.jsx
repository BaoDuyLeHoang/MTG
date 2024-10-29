import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import "./UserProfile.css";
import Header from "../../components/Header/header";
import placeholder from "../../assets/images/placeholder.jpg";
const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [userData, setUserData] = useState({
    fullName: "",
    dateOfBirth: "",
    address: "",
    avatarPath: placeholder,
    emailAddress: "",
  });

  useEffect(() => {
    // Simulate fetching user data
    // Replace this with your actual API call
    const fetchUserData = async () => {
      try {
        // const response = await fetch('your-api-endpoint');
        // const data = await response.json();
        // setUserData(data);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Không thể tải thông tin người dùng. Vui lòng thử lại sau.",
        });
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would make an API call to update the user data
      // await fetch('your-api-endpoint', {
      //   method: 'PUT',
      //   body: JSON.stringify(userData),
      //   headers: { 'Content-Type': 'application/json' }
      // });

      setMessage({
        type: "success",
        text: "Cập nhật thông tin thành công!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({
          ...prev,
          avatarPath: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-header">
          <h1>Thông Tin Cá Nhân</h1>
          <div className="avatar-section">
            <div className="avatar-container">
              <img
                src={userData.avatarPath}
                alt="Ảnh đại diện"
                className="avatar-image"
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

        <div
          className={`tab-content ${activeTab === "profile" ? "active" : ""}`}
        >
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
                value={userData.dateOfBirth.split("T")[0]}
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

            <button type="submit" className="submit-button">
              Cập nhật thông tin
            </button>
          </form>
        </div>

        <div
          className={`tab-content ${activeTab === "security" ? "active" : ""}`}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
              <input id="currentPassword" type="password" />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Mật khẩu mới</label>
              <input id="newPassword" type="password" />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
              <input id="confirmPassword" type="password" />
            </div>

            <button type="submit" className="submit-button">
              Đổi mật khẩu
            </button>
          </form>
        </div>

        {message.text && (
          <div className={`alert ${message.type}`}>{message.text}</div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
