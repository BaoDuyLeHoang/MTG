import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MyGraveDetail.css";
import Header from "../../../components/Header/header";
import { getGraveById } from "../../../APIcontroller/API";
import { getGraveOrders, getTasksByMartyrGrave } from "../../../services/graves";
import Footer from "../../../components/Footer/footer";
import Loading from '../../../components/Loading/Loading';

const MyGraveDetail = () => {
  const navigate = useNavigate();
  const { martyrId } = useParams();
  const [martyrDetails, setMartyrDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [orders, setOrders] = useState([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [taskType, setTaskType] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  const defaultImage = "https://firebasestorage.googleapis.com/v0/b/mtg-capstone-2024.appspot.com/o/grave_images%2Fbna_3..jpg?alt=media&token=8f7ddd09-355a-4d65-85b6-476829954072";

  useEffect(() => {
    const fetchData = async () => {
      if (!martyrId) {
        setError("No martyr ID provided");
        setLoading(false);
        return;
      }

      try {
        const [graveData, ordersData] = await Promise.all([
          getGraveById(martyrId),
          getGraveOrders(martyrId)
        ]);

        setMartyrDetails(graveData);
        setOrders(ordersData);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [martyrId]);

  const handleImageClick = () => {
    if (martyrDetails.images && martyrDetails.images.length > 0) {
      setSelectedImage(martyrDetails.images[0].urlPath);
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleBookService = () => {
    // Save martyrId to session storage
    sessionStorage.setItem("selectedMartyrId", martyrId);
    // Save martyr name to localStorage
    const martyrName = info.name || info.nickName || "Không có tên";
    localStorage.setItem("selectedMartyrName", martyrName);
    // Navigate to the service listing page
    navigate("/dichvutheoloai");
  };

  // Add this function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Add this helper function
  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return { text: "Đã giao", color: "#3498db" };
      case 2:
        return { text: "Từ chối", color: "#e74c3c" };
      case 3:
        return { text: "Đang thực hiện", color: "#f39c12" };
      case 4:
        return { text: "Hoàn thành", color: "#2ecc71" };
      case 5:
        return { text: "Thất bại", color: "#c0392b" };
      default:
        return { text: "Không xác định", color: "#95a5a6" };
    }
  };

  // Thêm hàm format date thành chuỗi tiếng Việt
  const formatDateToVietnamese = (dateString) => {
    if (!dateString) return "Không có thông tin";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  };

  // Thêm hàm format vị trí mộ
  const formatGraveLocation = (grave) => {
    if (!grave) return "Không có thông tin";
    return `Khu ${grave.areaNumber} - Hàng ${grave.rowNumber} - Mộ số ${grave.martyrNumber}`;
  };

  // Thêm function để lấy tasks
  const fetchMaintenanceTasks = async () => {
    try {
      const response = await getTasksByMartyrGrave(martyrId, taskType, currentPage, pageSize);
      if (response.success) {
        setMaintenanceTasks(response.data);
        setTotalPages(response.totalPage);
      }
    } catch (error) {
      console.error('Error fetching maintenance tasks:', error);
    }
  };

  useEffect(() => {
    if (martyrId) {
      fetchMaintenanceTasks();
    }
  }, [martyrId, taskType, currentPage]);

  if (loading) return (
    <>
      <Header />
      <div className="grave-detail-container">
        <Loading fullScreen={false} text="Đang tải thông tin mộ..." />
      </div>
      <Footer />
    </>
  );

  if (error) return <div>{error}</div>;
  if (!martyrDetails) return <div>No grave details found.</div>;

  const info = martyrDetails.matyrGraveInformations[0];

  return (
    <>
      <Header />
      <div className="grave-detail-container">
        <div className="grave-info">
          <h1>Tưởng niệm liệt sĩ</h1>
          <div className="grave-info-container">
            <div className="image-section">
              <div className="memorial-image">
                <img
                  src={
                    martyrDetails?.images?.[0]?.urlPath || defaultImage
                  }
                  alt="Bia tưởng niệm"
                  onClick={handleImageClick}
                  title="Nhấp để phóng to"
                />
              </div>
            </div>

            <div className="detail-section">
              <h2>Thông tin cá nhân</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Tên:</label>
                  <span>{info.name || "Không có thông tin"}</span>
                </div>
                <div className="info-item">
                  <label>Bí danh:</label>
                  <span>{info.nickName || "Không có thông tin"}</span>
                </div>
                <div className="info-item">
                  <label>Chức danh:</label>
                  <span>{info.position || "Không có thông tin"}</span>
                </div>
                <div className="info-item">
                  <label>Quê quán:</label>
                  <span>{info.homeTown || "Không có thông tin"}</span>
                </div>
                <div className="info-item">
                  <label>Ngày sinh:</label>
                  <span>{info.dateOfBirth || "Không có thông tin"}</span>
                </div>
                <div className="info-item">
                  <label>Ngày mất:</label>
                  <span>{info.dateOfSacrifice || "Không có thông tin"}</span>
                </div>
                <div className="info-item">
                  <label>Vị trí mộ:</label>
                  <span>{formatGraveLocation(martyrDetails)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="inscription">
            <h3>Huân chương/ Chiến công</h3>
            <p>{info.medal}</p>
          </div>
          <div className="service-button-container">
            <button className="book-service-button" onClick={handleBookService}>
              Đặt dịch vụ
            </button>
          </div>
        </div>
        <div className="mgd-maintenance-section">
          <div className="mgd-maintenance-header">
            <h2>Lịch sử bảo trì</h2>
            <div className="mgd-maintenance-note">
              <p>
                Để đảm bảo tính riêng tư và sự tôn nghiêm, chỉ thân nhân của liệt sĩ mới có quyền xem lịch sử bảo trì mộ phần.
                Thông tin này bao gồm các dịch vụ đã được thực hiện, thời gian thực hiện, và trạng thái của từng dịch vụ.
                Điều này giúp người thân có thể theo dõi và đảm bảo mộ phần của liệt sĩ luôn được chăm sóc chu đáo theo yêu cầu.
              </p>
            </div>
          </div>

          <div className="mgd-maintenance-filters">
            <select
              value={taskType}
              onChange={(e) => {
                setTaskType(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="mgd-task-type-select"
            >
              <option value={1}>Dịch vụ thường</option>
              <option value={2}>Dịch vụ định kỳ</option>
              <option value={3}>Dịch vụ theo yêu cầu</option>
            </select>
          </div>

          <div className="mgd-maintenance-table-container">
            <table className="mgd-maintenance-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên dịch vụ</th>
                  <th>Mã mộ</th>
                  <th>Thời hạn</th>
                  <th>Người đặt</th>
                  <th>Nhân viên</th>
                  <th>Ghi chú</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceTasks.length > 0 ? (
                  maintenanceTasks.map((task, index) => (
                    <tr key={index}>
                      <td>{(currentPage - 1) * pageSize + index + 1}</td>
                      <td>{task.serviceName}</td>
                      <td>{task.martyrCode}</td>
                      <td>{new Date(task.endDate).toLocaleDateString('vi-VN')}</td>
                      <td>{task.customerName}<br />{task.customerPhone}</td>
                      <td>
                        {task.staffName ? (
                          <>
                            {task.staffName}
                            <br />
                            {task.staffPhone}
                          </>
                        ) : '-'}
                      </td>
                      <td>{task.description || '-'}</td>
                      <td>
                        <span
                          className="mgd-status-badge"
                          style={{ backgroundColor: getStatusText(task.status).color }}
                        >
                          {getStatusText(task.status).text}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="mgd-empty-state">
                      Chưa có dịch vụ nào được đặt cho mộ này
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mgd-pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Trang trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? 'active' : ''}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Trang sau
              </button>
            </div>
          )}
        </div>

        {selectedImage && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content">
              <img
                src={selectedImage === martyrDetails?.images?.[0]?.urlPath ? selectedImage : defaultImage}
                alt="Memorial - Large view"
              />
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyGraveDetail;
