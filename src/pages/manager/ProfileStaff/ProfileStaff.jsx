// ProfileStaff.jsx
import React, { useState, useEffect } from "react";
import {
  Mail,
  MapPin,
  Cake,
  Building,
  Edit2,
  Save,
  X,
  Phone,
  Badge,
  Calendar,
} from "lucide-react";
import "./ProfileStaff.css";
import placeholder from "../../../assets/images/placeholder.jpg";
import Sidebar from "../../../components/Sidebar/sideBar";
import { getProfile, updateProfile } from "../../../services/profile";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const defaultProfile = {
  fullName: "",
  dateOfBirth: new Date().toISOString(),
  roleName: "",
  address: "",
  avatarPath: placeholder,
  emailAddress: "",
  areaId: null,
  phoneNumber: "", // note: API uses phoneNumber instead of phone
  accountId: null,
  roleId: null,
  status: true,
  createAt: null
};

const ProfileStaff = () => {  // Remove props as we'll use useAuth
  const [isEditing, setIsEditing] = useState(false); // Changed to boolean
  const [editedData, setEditedData] = useState(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem thông tin.");
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        // Use user.accountId from AuthContext
        const data = await getProfile(user.accountId);
        console.log("Profile data received:", data);
        setEditedData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Không thể tải thông tin profile. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user.accountId, navigate]); // Added proper dependencies

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Ngày không hợp lệ";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Prepare the update data according to API requirements
      const updateData = {
        fullName: editedData.fullName,
        dateOfBirth: editedData.dateOfBirth,
        address: editedData.address,
        emailAddress: editedData.emailAddress
      };

      // Show loading state
      setIsLoading(true);

      // Call update API
      await updateProfile(user.accountId, updateData);

      // Fetch updated profile data
      const updatedProfile = await getProfile(user.accountId);
      setEditedData(updatedProfile);

      // Exit edit mode
      setIsEditing(false);

      // You might want to show a success message
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedData(editedData);
    setIsEditing(false);
  };

  const calculateYearsOfService = () => {
    const start = new Date(editedData.startDate);
    const now = new Date();
    return Math.floor((now - start) / (365.25 * 24 * 60 * 60 * 1000));
  };

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="profile-main-content">
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar-section">
                <div className="profile-avatar">
                  {editedData.avatarPath ? (
                    <img
                      src={editedData.avatarPath}
                      alt={editedData.fullName}
                      className="avatar-image"
                    />
                  ) : (
                    <div className="avatar-placeholder"></div>
                  )}
                </div>
                <div className="profile-title">
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={editedData.fullName}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  ) : (
                    <h1>{editedData.fullName}</h1>
                  )}
                </div>
              </div>
              <div className="profile-actions">
                {isEditing ? (
                  <>
                    <button className="action-button save" onClick={handleSave}>
                      <Save className="icon" />
                      <span>Lưu</span>
                    </button>
                    <button
                      className="action-button cancel"
                      onClick={handleCancel}
                    >
                      <X className="icon" />
                      <span>Hủy</span>
                    </button>
                  </>
                ) : (
                  <button
                    className="action-button edit"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="icon" />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
              </div>
            </div>

            <div className="profile-content">
              <div className="profile-info">
                <div className="info-row">
                  <Mail className="icon" />
                  {isEditing ? (
                    <input
                      type="email"
                      name="emailAddress"
                      value={editedData.emailAddress}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  ) : (
                    <span>{editedData.emailAddress}</span>
                  )}
                </div>

                <div className="info-row">
                  <MapPin className="icon" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={editedData.address}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  ) : (
                    <span>{editedData.address}</span>
                  )}
                </div>

                <div className="info-row">
                  <Cake className="icon" />
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={editedData.dateOfBirth.split("T")[0]}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  ) : (
                    <span>{formatDate(editedData.dateOfBirth)}</span>
                  )}
                </div>

                <div className="info-row">
                  <Phone className="icon" />
                    <span>{editedData.phoneNumber}</span>
                </div>

                <div className="info-row">
                  <Badge className="icon" />
                  <span>Mã nhân viên: {editedData.accountId}</span>
                </div>

                <div className="info-row">
                  <Calendar className="icon" />
                  <span>Ngày vào làm: {formatDate(editedData.createAt)}</span>
                </div>
              </div>

              <div className="quick-info">
                <h3>Thông tin nhanh</h3>
                <dl>
                  <div className="info-item">
                    <dt>Khu vực</dt>
                    <dd>{editedData.areaId}</dd>
                  </div>
                  <div className="info-item">
                    <dt>Chức vụ</dt>
                    <dd>{editedData.roleName}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStaff;
