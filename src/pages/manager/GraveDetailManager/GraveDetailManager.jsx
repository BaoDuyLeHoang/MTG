import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./GraveDetailManager.css";
import { getGraveById } from "../../../APIcontroller/API"; // Adjust import to include getGraveServices
import { updateGraveDetail, getGraveServices, createGraveService, deleteGraveService } from '../../../services/graves';
import { getAvailableServices } from '../../../services/service';
import Sidebar from "../../../components/Sidebar/sideBar";
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from "../../../context/AuthContext";

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
    if (martyrDetails?.images?.[0]?.urlPath) {
      setSelectedImage(martyrDetails.images[0].urlPath);
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
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
      const updateData = {
        informations: [
          {
            name: editedData.matyrGraveInformations[0].name,
            nickName: editedData.matyrGraveInformations[0].nickName,
            position: editedData.matyrGraveInformations[0].position,
            medal: editedData.matyrGraveInformations[0].medal,
            homeTown: editedData.matyrGraveInformations[0].homeTown,
            dateOfBirth: editedData.matyrGraveInformations[0].dateOfBirth,
            dateOfSacrifice: editedData.matyrGraveInformations[0].dateOfSacrifice
          }
        ],
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

  if (error) return <div className="error-message">{error}</div>;
  if (!martyrDetails) return <div className="no-data-message">No grave details found.</div>;

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
                <img
                  src={
                    martyrDetails.images[0]?.urlPath ||
                    "/api/placeholder/400/300"
                  }
                  alt="Bia tưởng niệm"
                  onClick={handleImageClick}
                  title="Nhấp để phóng to"
                />
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

            {selectedImage && (
              <div
                className="grave-detail-manager-modal-overlay"
                onClick={closeModal}
              >
                <div className="grave-detail-manager-modal-content">
                  <img src={selectedImage} alt="Memorial - Large view" />
                  <button
                    className="grave-detail-manager-modal-close"
                    onClick={closeModal}
                  >
                    ×
                  </button>
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

        {selectedImage && (
          <div className="grave-detail-manager-modal-overlay" onClick={closeModal}>
            <div className="grave-detail-manager-modal-content">
              <img src={selectedImage} alt="Memorial - Large view" />
              <button className="grave-detail-manager-modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

          </div>
    </div>
      );
};

      export default MyGraveDetail;