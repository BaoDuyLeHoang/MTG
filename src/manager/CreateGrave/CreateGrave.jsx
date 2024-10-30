import React, { useState } from "react";
import {
  Calendar,
  Upload,
  User,
  MapPin,
  Medal,
  Phone,
  Mail,
} from "lucide-react";
import Sidebar from "../../components/Sidebar/sideBar";
import "./CreateGrave.css";
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const CreateGrave = () => {
  const [formData, setFormData] = useState({
    areaId: 0,
    rowNumber: 0,
    martyrNumber: 0,
    areaNumber: 0,
    customer: {
      userName: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      emailAddress: "",
      dob: "",
    },
    informations: [
      {
        martyrId: 0,
        name: "",
        nickName: "",
        position: "",
        medal: "",
        homeTown: "",
        dateOfBirth: "",
        dateOfSacrifice: "",
      },
    ],
    image: [
      {
        urlPath: "",
      },
    ],
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    // Password validation
    if (
      section === "customer" &&
      (field === "password" || field === "confirmPassword")
    ) {
      if (field === "confirmPassword" && value !== formData.customer.password) {
        setPasswordError("Passwords do not match");
      } else if (
        field === "password" &&
        value !== formData.customer.confirmPassword
      ) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleMartyrInfoChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      informations: [
        {
          ...prev.informations[0],
          [field]: value,
        },
      ],
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.customer.password !== formData.customer.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    console.log("Form submitted:", formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const fileName = `grave-images-create/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      
      // Create upload task with progress monitoring
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // Monitor upload progress
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log('Upload progress:', progress);
        },
        (error) => {
          console.error("Upload error:", error);
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('Download URL:', downloadURL);
          
          setFormData(prev => ({
            ...prev,
            informations: [
              {
                ...prev.informations[0],
                urlPath: downloadURL
              }
            ]
          }));
          
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            setUploadProgress(0);
          }, 3000);
        }
      );
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      informations: [
        {
          ...prev.informations[0],
          urlPath: ""
        }
      ]
    }));
    setUploadProgress(0);
  };

  return (
    <div className="cg-layout">
      <Sidebar />
      <div className="cg-main">
        <div className="cg-container">
          <div className="cg-header">
            <h1 className="cg-header__title">Quản Lý Mộ Liệt Sĩ</h1>
            <div className="cg-header__actions">
              <input
                type="file"
                accept=".xlsx,.xls"
                className="cg-file-input"
                id="excel-upload"
                onChange={handleFileUpload}
              />
              <label htmlFor="excel-upload" className="cg-import-btn">
                <Upload className="cg-import-btn__icon" />
                Nhập Excel
              </label>
            </div>
          </div>

          {showSuccess && (
            <div className="cg-alert cg-alert--success">
              Thao tác thành công!
            </div>
          )}

          <form onSubmit={handleSubmit} className="cg-form">
            <div className="cg-card">
              <h2 className="cg-card__header">
                <MapPin className="cg-card__icon" />
                Thông Tin Vị Trí
              </h2>
              <div className="cg-card__grid">
                <div className="cg-form-group">
                  <label className="cg-form-group__label">Mã Khu Vực</label>
                  <div className="cg-form-group__input-wrapper">
                    <input
                      className="cg-form-group__input"
                      type="number"
                      value={formData.areaId}
                      onChange={(e) =>
                        handleInputChange("areaId", "", e.target.value)
                      }
                      placeholder="Nhập mã khu vực"
                    />
                  </div>
                </div>
                <div className="cg-form-group">
                  <label className="cg-form-group__label">Số Hàng</label>
                  <div className="cg-form-group__input-wrapper">
                    <input
                      className="cg-form-group__input"
                      type="number"
                      value={formData.rowNumber}
                      onChange={(e) =>
                        handleInputChange("rowNumber", "", e.target.value)
                      }
                      placeholder="Nhập số hàng"
                    />
                  </div>
                </div>
                <div className="cg-form-group">
                  <label className="cg-form-group__label">Số Liệt Sĩ</label>
                  <div className="cg-form-group__input-wrapper">
                    <input
                      className="cg-form-group__input"
                      type="number"
                      value={formData.martyrNumber}
                      onChange={(e) =>
                        handleInputChange("martyrNumber", "", e.target.value)
                      }
                      placeholder="Nhập số liệt sĩ"
                    />
                  </div>
                </div>
                <div className="cg-form-group">
                  <label className="cg-form-group__label">Số Khu Vực</label>
                  <div className="cg-form-group__input-wrapper">
                    <input
                      className="cg-form-group__input"
                      type="number"
                      value={formData.areaNumber}
                      onChange={(e) =>
                        handleInputChange("areaNumber", "", e.target.value)
                      }
                      placeholder="Nhập số khu vực"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="cg-card">
              <h2 className="cg-card__header">
                <User className="cg-card__icon" />
                Thông Tin Thân Nhân
              </h2>
              <div className="cg-card__grid">
                <div className="cg-form-group">
                  <label className="cg-form-group__label">Tên đăng nhập</label>
                  <div className="cg-form-group__input-wrapper">
                    <User className="cg-form-group__input-icon" />
                    <input
                      className="cg-form-group__input"
                      type="text"
                      value={formData.customer.userName}
                      onChange={(e) =>
                        handleInputChange(
                          "customer",
                          "userName",
                          e.target.value
                        )
                      }
                      placeholder="Nhập tên đăng nhập"
                    />
                  </div>
                </div>
                <div className="cg-form-group">
                  <label className="cg-form-group__label">Mật khẩu</label>
                  <div className="cg-form-group__input-wrapper">
                    <input
                      className="cg-form-group__input"
                      type="password"
                      value={formData.customer.password}
                      onChange={(e) =>
                        handleInputChange(
                          "customer",
                          "password",
                          e.target.value
                        )
                      }
                      placeholder="Nhập mật khẩu"
                    />
                  </div>
                </div>
                <div className="cg-form-group">
                  <label className="cg-form-group__label">
                    Xác nhận mật khẩu
                  </label>
                  <div className="cg-form-group__input-wrapper">
                    <input
                      className="cg-form-group__input"
                      type="password"
                      value={formData.customer.confirmPassword}
                      onChange={(e) =>
                        handleInputChange(
                          "customer",
                          "confirmPassword",
                          e.target.value
                        )
                      }
                      placeholder="Nhập xác nhận mật khẩu"
                    />
                  </div>
                </div>
                <div className="cg-form-group">
                  <label className="cg-form-group__label">Số điện thoại</label>
                  <div className="cg-form-group__input-wrapper">
                    <Phone className="cg-form-group__input-icon" />
                    <input
                      className="cg-form-group__input"
                      type="tel"
                      value={formData.customer.phone}
                      onChange={(e) =>
                        handleInputChange("customer", "phone", e.target.value)
                      }
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>
                <div className="cg-form-group full-width">
                  <label className="cg-form-group__label">Địa chỉ</label>
                  <div className="cg-form-group__input-wrapper">
                    <MapPin className="cg-form-group__input-icon" />
                    <input
                      className="cg-form-group__input"
                      type="text"
                      value={formData.customer.address}
                      onChange={(e) =>
                        handleInputChange("customer", "address", e.target.value)
                      }
                      placeholder="Nhập địa chỉ"
                    />
                  </div>
                </div>
                <div className="cg-form-group">
                  <label className="cg-form-group__label">Email</label>
                  <div className="cg-form-group__input-wrapper">
                    <Mail className="cg-form-group__input-icon" />
                    <input
                      className="cg-form-group__input"
                      type="email"
                      value={formData.customer.emailAddress}
                      onChange={(e) =>
                        handleInputChange(
                          "customer",
                          "emailAddress",
                          e.target.value
                        )
                      }
                      placeholder="Nhập email"
                    />
                  </div>
                </div>
                <div className="cg-form-group">
                  <label className="cg-form-group__label">Ngày sinh</label>
                  <div className="cg-form-group__input-wrapper">
                    <Calendar className="cg-form-group__input-icon" />
                    <input
                      className="cg-form-group__input"
                      type="date"
                      value={formData.customer.dob}
                      onChange={(e) =>
                        handleInputChange("customer", "dob", e.target.value)
                      }
                      placeholder="Nhập ngày sinh"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="cg-card">
              <h2 className="cg-card__header">
                <Medal className="cg-card__icon" />
                Thông Tin Liệt Sĩ
              </h2>
              <div className="cg-card__grid">
                {/* Basic Information */}
                <div className="cg-form-group cg-form-group--col-2">
                  <label className="cg-form-group__label">Họ và tên</label>
                  <div className="cg-form-group__input-wrapper">
                    <User className="cg-form-group__input-icon" />
                    <input
                      className="cg-form-group__input"
                      type="text"
                      value={formData.informations[0].name}
                      onChange={(e) =>
                        handleMartyrInfoChange("name", e.target.value)
                      }
                      placeholder="Nhập họ và tên liệt sĩ"
                    />
                  </div>
                </div>

                <div className="cg-form-group">
                  <label className="cg-form-group__label">Tên biệt danh</label>
                  <div className="cg-form-group__input-wrapper">
                    <User className="cg-form-group__input-icon" />
                    <input
                      className="cg-form-group__input"
                      type="text"
                      value={formData.informations[0].nickName}
                      onChange={(e) =>
                        handleMartyrInfoChange("nickName", e.target.value)
                      }
                      placeholder="Nhập tên biệt danh"
                    />
                  </div>
                </div>

                <div className="cg-form-group">
                  <label className="cg-form-group__label">Quê quán</label>
                  <div className="cg-form-group__input-wrapper">
                    <MapPin className="cg-form-group__input-icon" />
                    <input
                      className="cg-form-group__input"
                      type="text"
                      value={formData.informations[0].homeTown}
                      onChange={(e) =>
                        handleMartyrInfoChange("homeTown", e.target.value)
                      }
                      placeholder="Nhập quê quán"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="cg-form-group">
                  <label className="cg-form-group__label">Ngày sinh</label>
                  <div className="cg-form-group__input-wrapper">
                    <Calendar className="cg-form-group__input-icon" />
                    <input
                      className="cg-form-group__input"
                      type="date"
                      value={formData.informations[0].dateOfBirth}
                      onChange={(e) =>
                        handleMartyrInfoChange("dateOfBirth", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="cg-form-group">
                  <label className="cg-form-group__label">Ngày hy sinh</label>
                  <div className="cg-form-group__input-wrapper">
                    <Calendar className="cg-form-group__input-icon" />
                    <input
                      className="cg-form-group__input"
                      type="date"
                      value={formData.informations[0].dateOfSacrifice}
                      onChange={(e) =>
                        handleMartyrInfoChange(
                          "dateOfSacrifice",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                {/* Medal Information */}
                <div className="cg-form-group cg-form-group--full-width">
                  <label className="cg-form-group__label">Chiến công</label>
                  <div className="cg-form-group__input-wrapper">
                    <textarea
                      className="cg-form-group__textarea"
                      value={formData.informations[0].medal}
                      onChange={(e) =>
                        handleMartyrInfoChange("medal", e.target.value)
                      }
                      rows="3"
                      placeholder="Nhập chiến công"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="cg-form-group cg-form-group--full-width">
                  <label className="cg-form-group__label">Hình ảnh</label>
                  <div className="image-upload-container">
                    {/* Upload area - always visible */}
                    <div
                      className={`image-upload-area ${isDragging ? 'drag-active' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('file-input').click()}
                    >
                      <Upload size={40} className="upload-icon" />
                      <p className="upload-text">Kéo và thả ảnh vào đây hoặc click để chọn file</p>
                      <p className="upload-subtext">Hỗ trợ JPG, PNG</p>
                      <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleImageUpload(file);
                          }
                        }}
                      />
                    </div>

                    {/* Image preview - shown when image exists */}
                    {formData.informations[0].urlPath && (
                      <div className="image-preview-container">
                        <img 
                          src={formData.informations[0].urlPath} 
                          alt="Preview" 
                          className="image-preview"
                        />
                        <button 
                          className="remove-image-btn"
                          onClick={removeImage}
                          type="button"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="upload-progress">
                        <div 
                          className="upload-progress-bar" 
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="cg-form__actions">
              <button type="submit" className="cg-submit-btn">
                Tạo Hồ Sơ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGrave;
