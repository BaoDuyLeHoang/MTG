import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./GraveDetailManager.css";
import { getGraveById } from "../../../APIcontroller/API"; // Adjust import to include getGraveServices
import { updateGraveDetail, getGraveServices, createGraveService, deleteGraveService } from '../../../services/graves';
import { getAvailableServices } from '../../../services/service';
import Sidebar from "../../../components/Sidebar/sideBar";
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from "../../../context/AuthContext";
import LoadingForSideBar from "../../../components/LoadingForSideBar/LoadingForSideBar";
import { storage } from "../../../firebase"; // Ensure this import is correct
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"; // Import necessary Firebase functions
import { jwtDecode } from "jwt-decode";

// Add this helper function to format date for input
const formatDateForInput = (dateString) => {
  return new Date(dateString).toISOString().split('T')[0];
};

const MyGraveDetail = () => {
  const { martyrId } = useParams();
  const [martyrDetails, setMartyrDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const { user } = useAuth();
  const [graveLocation, setGraveLocation] = useState({
    area: "",
    row: "",
    number: ""
  });
  const [fakePersonalInfo, setFakePersonalInfo] = useState([
    {
      id: 1,
      name: "",
      phone: "",
      email: ""
    },
  ]);
  const [editedLocation, setEditedLocation] = useState(graveLocation);
  const [editedPersonalInfo, setEditedPersonalInfo] = useState(fakePersonalInfo);
  const [services, setServices] = useState([]); // State for services
  const [activeTab, setActiveTab] = useState('details'); // State to manage active tab
  const [availableServices, setAvailableServices] = useState([]); // State for available services
  const [selectedServiceId, setSelectedServiceId] = useState(null); // State for selected service
  const [selectedImageUrl, setSelectedImageUrl] = useState(null); // State to hold the selected image URL
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // State to manage image modal visibility
  const fileInputRef = useRef(null); // Create a ref for the file input

  useEffect(() => {
    const fetchGraveDetails = async () => {
      if (!martyrId) {
        setError("No martyr ID provided");
        setLoading(false);
        return;
      }

      try {
        const data = await getGraveById(martyrId);
        setMartyrDetails(data);
        setEditedData(data);

        // Set grave location from API data
        setGraveLocation({
          area: `Khu ${data.areaName}`,
          row: `Hàng ${data.rowNumber}`,
          number: data.martyrNumber.toString()
        });

        // Set personal info from API data
        setFakePersonalInfo([{
          id: 1,
          name: data.customerName,
          phone: data.customerPhone,
          email: data.customerEmail
        }]);

        // Fetch services
        const serviceData = await getGraveServices(martyrId);
        setServices(serviceData);

        // Fetch available services for dropdown
        const availableServiceData = await getAvailableServices();
        setAvailableServices(availableServiceData);

      } catch (err) {
        setError("Failed to fetch grave details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGraveDetails();
  }, [martyrId]);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file); // Set the selected image file

      // Create a URL for the selected image and set it to state
      const imageUrl = URL.createObjectURL(file);
      setSelectedImageUrl(imageUrl);
    }
  };

  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      matyrGraveInformations: [
        {
          ...prev.matyrGraveInformations[0],
          [field]: value
        }
      ]
    }));
  };

  const handleSave = async () => {
    try {
      let imageUrl = null;

      // Check if there is an existing image and delete it if necessary
      if (martyrDetails?.images?.[0]?.urlPath) {
        await deleteObject(martyrDetails.images[0].urlPath); // Delete the old image
      }

      // Upload new image if selected
      if (selectedImage) {
        imageUrl = await uploadBytes(selectedImage); // Upload the image and get the URL
      }

      const updateData = {
        informations: [
          {
            martyrId: martyrId, // Include martyrId
            name: editedData.matyrGraveInformations[0].name,
            nickName: editedData.matyrGraveInformations[0].nickName,
            position: editedData.matyrGraveInformations[0].position,
            medal: editedData.matyrGraveInformations[0].medal,
            homeTown: editedData.matyrGraveInformations[0].homeTown,
            dateOfBirth: editedData.matyrGraveInformations[0].dateOfBirth,
            dateOfSacrifice: editedData.matyrGraveInformations[0].dateOfSacrifice
          }
        ],
        image: [
          {
            urlPath: imageUrl // Include the new image URL
          }
        ]
      };

      await updateGraveDetail(martyrId, updateData);

      setMartyrDetails(editedData);
      setGraveLocation(editedLocation);
      setFakePersonalInfo(editedPersonalInfo);
      setIsEditing(false);
      alert('Cập nhật thành công!');
    } catch (error) {
      console.error('Failed to save changes:', error);
      setError("Failed to save changes. Please try again.");
      alert('Không thể cập nhật. Vui lòng thử lại sau.');
    }
  };

  const renderInfoItem = (label, field, value) => (
    <div className="grave-detail-manager-info-item">
      <label>{label}:</label>
      {isEditing ? (
        <input
          type="text"
          value={editedData.matyrGraveInformations[0][field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );

  const handleCreateService = async () => {
    if (selectedServiceId) {
      const newServiceData = {
        martyrId: martyrId,
        serviceId: [selectedServiceId]
      };

      try {
        const response = await createGraveService(user.accountId, newServiceData);
        console.log('Service created successfully:', response); // Log the response

        alert('Dịch vụ đã được thêm thành công!');
        // Optionally, refresh the services list
        const updatedServices = await getGraveServices(martyrId);
        setServices(updatedServices);
      } catch (error) {
        console.error('Failed to create service:', error); // Log the error
        alert('Không thể thêm dịch vụ. Vui lòng thử lại.');
      }
    } else {
      alert('Vui lòng chọn dịch vụ.');
    }
  };
  // Function to delete a grave service
  const handleDeleteService = async (graveServiceId) => {
    const managerId = user.accountId; // Assuming you have the managerId from the user context

    try {
      await deleteGraveService(managerId, graveServiceId);
      alert('Dịch vụ đã được xóa thành công!');
      // Refresh the services list
      const updatedServices = await getGraveServices(martyrId);
      setServices(updatedServices);
    } catch (error) {
      console.error('Failed to delete service:', error);
      alert('Không thể xóa dịch vụ. Vui lòng thử lại.');
    }
  };

  // Define the renderServices function
  const renderServices = () => {
    return services.length > 0 ? (
      <div className="grave-detail-manager-services-list">
        {services.map(service => (
          <div key={service.serviceId} className="grave-detail-manager-service-item">
            <h3>{service.serviceName}</h3>
            <p>{service.description}</p>
            <p>Giá: {service.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
            {service.imagePath && <img src={service.imagePath} alt={service.serviceName} />}
            <button onClick={() => handleDeleteService(service.graveServiceId)}>Xóa dịch vụ</button> {/* Delete button */}
          </div>
        ))}
      </div>
    ) : (
      <p>Không có dịch vụ nào liên quan.</p>
    );
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    // Validate file type
    if (file && !file.type.startsWith('image/')) {
      setError("Vui lòng chọn file ảnh.");
      return;
    }

    // Validate file size (max 5MB)
    if (file && file.size > 5 * 1024 * 1024) {
      setError("Kích thước ảnh không được vượt quá 5MB.");
      return;
    }

    if (file) {
      try {
        setLoading(true);
        
        // 1. Upload ảnh lên Firebase Storage
        const storageRef = ref(storage, `graves/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        // 2. Cập nhật URL vào state
        setSelectedImageUrl(downloadURL);

        // 3. Cập nhật URL vào database thông qua API
        const accountId = getAccountIdFromToken(); // Assuming you have a function to get the account ID
        if (!accountId) {
          throw new Error('Không tìm thấy thông tin người dùng');
        }

        await updateGraveDetail(martyrId, { // Assuming you have a function to update grave details
          ...editedData,
          image: [{ urlPath: downloadURL }] // Update the image URL
        });

        alert("Tải ảnh lên và cập nhật thông tin thành công!");
      } catch (error) {
        console.error('Image upload error:', error);
        alert("Không thể cập nhật ảnh. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }
  };

  const getAccountIdFromToken = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.accountId;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="grave-detail-manager-layout-wrapper">
        <Sidebar />
        <div className="grave-detail-manager-container">
          <div style={{ marginLeft: '-10px'}}>
            <LoadingForSideBar fullScreen={false} text="Đang tải thông tin mộ..." />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grave-detail-manager-layout-wrapper">
        <Sidebar />
        <div className="grave-detail-manager-container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  if (!martyrDetails) {
    return (
      <div className="grave-detail-manager-layout-wrapper">
        <Sidebar />
        <div className="grave-detail-manager-container">
          <div className="no-data-message">Không tìm thấy thông tin mộ.</div>
        </div>
      </div>
    );
  }

  const info = martyrDetails.matyrGraveInformations[0];

  return (
    <div className="grave-detail-manager-layout-wrapper">
      <Sidebar />
      <div className="grave-detail-manager-container">
        <div className="grave-detail-manager-info">
          <div className="header-with-actions">
            <h1>Thông tin chi tiết</h1>
            {isEditing ? (
              <div className="edit-actions">
                <button onClick={handleSave}>
                  <FaSave /> Lưu
                </button>
                <button onClick={() => setIsEditing(false)}>
                  <FaTimes /> Hủy
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)}>
                <FaEdit /> Chỉnh sửa
              </button>
            )}
          </div>

          {/* Tab Interface */}
          <div className="grave-detail-manager-tabs">
            <button onClick={() => setActiveTab('details')} className={activeTab === 'details' ? 'active' : ''}>
              Thông tin chi tiết
            </button>
            <button onClick={() => setActiveTab('services')} className={activeTab === 'services' ? 'active' : ''}>
              Dịch vụ
            </button>
          </div>

          {/* Always Render Personal Info */}
          <div className="grave-detail-manager-info-container">
            <div className="grave-detail-manager-image-section">
              <div className="grave-detail-manager-memorial-image">
                {selectedImageUrl || martyrDetails.images[0]?.urlPath ? (
                  <img
                    src={selectedImageUrl || martyrDetails.images[0].urlPath}
                    alt="Bia tưởng niệm"
                    onClick={handleImageClick} // Click to open file dialog
                    title="Nhấp để chọn ảnh"
                  />
                ) : (
                  <div className="no-image-placeholder">
                    <p>Chưa có ảnh</p>
                    <button onClick={handleImageClick}>Chọn ảnh</button> {/* Button to select image */}
                  </div>
                )}
                {isEditing && ( // Show file input only when in edit mode
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload} // Use the new handleImageUpload function
                    ref={fileInputRef} // Attach the ref to the file input
                    style={{ display: 'none' }} // Hide the file input
                  />
                )}
              </div>
            </div>

            <div className="grave-detail-manager-detail-section">
              <h2>Thông tin cá nhân</h2>
              <div className="grave-detail-manager-info-grid">
                {renderInfoItem("Tên", "name", info.name)}
                {renderInfoItem("Bí danh", "nickName", info.nickName)}
                {renderInfoItem("Chức danh", "position", info.position)}
                {renderInfoItem("Quê quán", "homeTown", info.homeTown)}
                <div className="grave-detail-manager-info-item">
                  <label>Ngày sinh:</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formatDateForInput(editedData.matyrGraveInformations[0].dateOfBirth)}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                  ) : (
                    <span>{new Date(info.dateOfBirth).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="grave-detail-manager-info-item">
                  <label>Ngày mất:</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formatDateForInput(editedData.matyrGraveInformations[0].dateOfSacrifice)}
                      onChange={(e) => handleInputChange('dateOfSacrifice', e.target.value)}
                    />
                  ) : (
                    <span>{new Date(info.dateOfSacrifice).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="grave-detail-manager-inscription">
                  <h3>Huân chương/ Chiến công</h3>
                  {isEditing ? (
                    <textarea
                      value={editedData.matyrGraveInformations[0].medal || ''}
                      onChange={(e) => handleInputChange('medal', e.target.value)}
                      rows="4"
                    />
                  ) : (
                    <p>{info.medal}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Render Location Information in the Details Tab */}
        {activeTab === 'details' && (
          <div className="grave-detail-manager-location-section">
            <h2>Vị trí mộ</h2>
            <div className="grave-detail-manager-location-grid">
              <div className="grave-detail-manager-location-item">
                <label>Khu vực:</label>
                <span>{graveLocation.area}</span>
              </div>
              <div className="grave-detail-manager-location-item">
                <label>Hàng:</label>
                <span>{graveLocation.row}</span>
              </div>
              <div className="grave-detail-manager-location-item">
                <label>Số:</label>
                <span>{graveLocation.number}</span>
              </div>
            </div>
          </div>
        )}

        {/* Render Services if the Services tab is active */}
        {activeTab === 'services' && (
          <div className="grave-detail-manager-services-section">
            <div className="grave-detail-manager-create-service">
              <h2>Thêm dịch vụ mới</h2>
              <select onChange={(e) => setSelectedServiceId(Number(e.target.value))}>
                <option value="">Chọn dịch vụ</option>
                {availableServices.map(service => (
                  <option key={service.serviceId} value={service.serviceId}>
                    {service.serviceName}
                  </option>
                ))}
              </select>
              <button onClick={handleCreateService}>Thêm dịch vụ</button>
            </div>
            {renderServices()} {/* Render services here */}
          </div>
        )}


        {activeTab === 'details' && (
          <div className="grave-detail-manager-personal-section">
            <h2>Thông tin thân nhân</h2>
            <div className="grave-detail-manager-personal-list">
              {(isEditing ? editedPersonalInfo : fakePersonalInfo).map((person) => (
                <div key={person.id} className="grave-detail-manager-personal-item">
                  <div className="grave-detail-manager-personal-name">
                    {person.name}
                  </div>
                  <div className="grave-detail-manager-personal-contact">
                    <span>SĐT: {person.phone}</span>
                    <span>Email: {person.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Modal without dark overlay */}
        {isImageModalOpen && (
          <div className="image-modal">
            <img src={selectedImageUrl || martyrDetails.images[0]?.urlPath} alt="Memorial - Large view" />
            <button onClick={closeImageModal}>Đóng</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGraveDetail;