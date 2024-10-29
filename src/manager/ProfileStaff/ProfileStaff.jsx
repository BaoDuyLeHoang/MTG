// ProfileStaff.jsx
import React, { useState } from "react";
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
import placeholder from "../../assets/images/placeholder.jpg";
import Sidebar from "../../components/Sidebar/sideBar";

const defaultProfile = {
  fullName: "Nguyen Van A",
  dateOfBirth: new Date().toISOString(),
  address: "123 Nguyen Van Linh, Q.Tan Phu, TP.HCM",
  avatarPath: placeholder,
  emailAddress: "nguyenvana@gmail.com",
  areaId: 1,
  phone: "0123456789",
  employeeId: "NV001",
  position: "Nhân viên",
  startDate: new Date(2023, 0, 1).toISOString(),
  department: "Kinh doanh",
};

const ProfileStaff = ({ profileData = defaultProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(profileData);

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

  const handleSave = () => {
    onSave?.(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(profileData);
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
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editedData.phone}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  ) : (
                    <span>{editedData.phone}</span>
                  )}
                </div>

                <div className="info-row">
                  <Badge className="icon" />
                  <span>Mã nhân viên: {editedData.employeeId}</span>
                </div>

                <div className="info-row">
                  <Calendar className="icon" />
                  <span>Ngày vào làm: {formatDate(editedData.startDate)}</span>
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
                    <dt>Thâm niên</dt>
                    <dd>{calculateYearsOfService()} năm</dd>
                  </div>
                  <div className="info-item">
                    <dt>Chức vụ</dt>
                    <dd>{editedData.position}</dd>
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
