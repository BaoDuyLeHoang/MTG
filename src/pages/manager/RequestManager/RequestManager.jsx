import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/Sidebar/sideBar';
import { getManagerRequests } from '../../../APIcontroller/API';
import { Link } from 'react-router-dom';
import './RequestManager.css';

const RequestManager = () => {
  const [requests, setRequests] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const { user } = useAuth();
  const pageSize = 5;

  const handleNoteClick = (note) => {
    if (!note) return;
    setSelectedNote(note);
    setShowNoteModal(true);
  };

  const handleCloseModal = () => {
    setSelectedNote(null);
    setShowNoteModal(false);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const formattedDate = searchDate ? new Date(searchDate).toISOString() : null;
        const data = await getManagerRequests(user.accountId, formattedDate, currentPage, pageSize);
        setRequests(data.requests);
        setTotalPages(data.totalPage);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.accountId) {
      fetchRequests();
    }
  }, [user, currentPage, searchDate]);

  const getStatusLabel = (status, typeId) => {
    const statusNum = parseInt(status);
    const typeNum = parseInt(typeId);

    // Xem tình trạng mộ (Type 1)
    if (typeNum === 1) {
      switch (statusNum) {
        case 1: return { text: 'Chờ xác nhận', class: 'pending' };
        case 2: return { text: 'Đã xác nhận', class: 'confirmed' };
        case 3: return { text: 'Từ chối', class: 'rejected' };
        case 7: return { text: 'Hoàn thành', class: 'completed' };
        case 8: return { text: 'Thất bại', class: 'failed' };
        default: return { text: 'Không xác định', class: 'unknown' };
      }
    }
    
    // Đặt dịch vụ riêng (Type 2)
    if (typeNum === 2) {
      switch (statusNum) {
        case 1: return { text: 'Chờ xác nhận', class: 'pending' };
        case 3: return { text: 'Từ chối', class: 'rejected' };
        case 4: return { text: 'Chờ phản hồi', class: 'waiting-response' };
        case 5: return { text: 'Đã phản hồi', class: 'responded' };
        case 6: return { text: 'Đang thực hiện', class: 'in-progress' };
        case 7: return { text: 'Hoàn thành', class: 'completed' };
        case 8: return { text: 'Thất bại', class: 'failed' };
        default: return { text: 'Không xác định', class: 'unknown' };
      }
    }
    
    // Đăng ký dịch vụ có sẵn (Type 3)
    if (typeNum === 3) {
      switch (statusNum) {
        case 1: return { text: 'Chờ xác nhận', class: 'pending' };
        case 2: return { text: 'Đã xác nhận', class: 'confirmed' };
        case 3: return { text: 'Từ chối', class: 'rejected' };
        case 7: return { text: 'Hoàn thành', class: 'completed' };
        case 8: return { text: 'Thất bại', class: 'failed' };
        default: return { text: 'Không xác định', class: 'unknown' };
      }
    }

    // Trường hợp mặc định
    return { text: 'Không xác định', class: 'unknown' };
  };

  const getRequestTypeName = (typeId) => {
    switch (typeId) {
      case 1: return "Yêu cầu báo cáo tình trạng mộ";
      case 2: return "Đặt dịch vụ riêng";
      case 3: return "Đăng ký dịch vụ có sẵn";
      default: return "Không xác định";
    }
  };

  const formatDate = (dateString, typeId) => {
    // Nếu là đăng ký dịch vụ có sẵn (typeId === 3)
    if (typeId === 3) {
      return "Không áp dụng";
    }
    // Các trường hợp khác vẫn giữ nguyên format
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) return <div className="rm-loading">Đang tải...</div>;
  if (error) return <div className="rm-error">{error}</div>;

  return (
    <div className="rm-page-container">
      <Sidebar />
      <div className="rm-container">
        <div className="rm-content">
          <h2 className="rm-title">Quản Lý Yêu Cầu Khách Hàng</h2>

          <div className="rm-search-container">
            <div className="rm-date-input-wrapper">
              <label className="rm-date-label">Chọn ngày</label>
              <input
                type="date"
                className="rm-date-input"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                placeholder="Chọn ngày"
              />
            </div>
            {searchDate && (
              <button 
                className="rm-clear-search"
                onClick={() => setSearchDate('')}
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>

          <div className="rm-table-container">
            <table className="rm-table">
              <thead>
                <tr>
                  <th>Loại yêu cầu</th>
                  <th>Ghi chú</th>
                  <th>Ngày tạo</th>
                  <th>Ngày hoàn thành</th>
                  <th>Giá tiền</th>
                  <th>Trạng thái</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.requestId}>
                    <td>{getRequestTypeName(request.typeId)}</td>
                    <td className="rm-note-cell">
                      <button 
                        className="rm-note-view-btn"
                        onClick={() => handleNoteClick(request.note)}
                      >
                        Xem thêm
                      </button>
                    </td>
                    <td>{formatDate(request.createAt)}</td>
                    <td>{formatDate(request.endDate, request.typeId)}</td>
                    <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(request.price)}</td>
                    <td>
                      <span className={`rm-status-badge rm-status-${getStatusLabel(request.status, request.typeId).class}`}>
                        {getStatusLabel(request.status, request.typeId).text}
                      </span>
                    </td>
                    <td>
                      <Link to={`/manager/request-detail/${request.requestId}`} className="rm-view-detail-btn">
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="rm-pagination">
              <button 
                className="rm-pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              <span className="rm-pagination-info">
                Trang {currentPage} / {totalPages}
              </span>
              <button 
                className="rm-pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Sau
              </button>
            </div>
          )}

          {showNoteModal && (
            <div className="rm-modal-overlay" onClick={handleCloseModal}>
              <div className="rm-modal-content" onClick={e => e.stopPropagation()}>
                <div className="rm-modal-header">
                  <h3>Ghi chú</h3>
                  <button className="rm-modal-close" onClick={handleCloseModal}>×</button>
                </div>
                <div className="rm-modal-body">
                  {selectedNote}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestManager; 