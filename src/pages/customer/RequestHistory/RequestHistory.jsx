import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/Header/header';
import Footer from '../../../components/Footer/footer';
import './RequestHistory.css';
import { getRequestHistoryByDate } from '../../../APIcontroller/API';
import { Link } from 'react-router-dom';

const NoteModal = ({ isOpen, onClose, note }) => {
  if (!isOpen) return null;

  return (
    <div className="rh-modal-overlay" onClick={onClose}>
      <div className="rh-modal-content" onClick={e => e.stopPropagation()}>
        <div className="rh-modal-header">
          <h3>Chi tiết ghi chú</h3>
          <button className="rh-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="rh-modal-body">
          {note}
        </div>
      </div>
    </div>
  );
};

const StatusGuideSection = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rh-status-guide-section">
      <button 
        className={`rh-status-guide-header ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3>{title}</h3>
        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
      </button>
      <div className={`rh-status-list-wrapper ${isExpanded ? 'expanded' : ''}`}>
        <div className="rh-status-list">
          {children}
        </div>
      </div>
    </div>
  );
};

const RequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const { user } = useAuth();
  const pageSize = 5;
  const [selectedNote, setSelectedNote] = useState(null);

  const getStatusLabel = (status, typeId) => {
    // Chuyển đổi sang số để đảm bảo so sánh chính xác
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
        default: return { text: 'Không xác định', class: 'unknown' };
      }
    }

    return { text: 'Không xác định', class: 'unknown' };
  };

  const getRequestTypeName = (typeId) => {
    switch (typeId) {
      case 1: return 'Xem tình trạng mộ';
      case 2: return 'Đặt dịch vụ riêng';
      case 3: return 'Đăng ký dịch vụ có sẵn';
      default: return 'Không xác định';
    }
  };

  const formatDate = (dateString, typeId) => {
    // Nếu là Đăng ký dịch vụ có sẵn (typeId === 3), trả về "Không áp dụng"
    if (typeId === 3) {
      return "Không áp dụng";
    }
    
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const formattedDate = searchDate ? new Date(searchDate).toISOString() : null;
        const data = await getRequestHistoryByDate(user.accountId, formattedDate, currentPage, pageSize);
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

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="rh-container">
      <Header />
      <div className="content-wrapper-request-history">
        <h2 className="rh-title">Lịch Sử Yêu Cầu</h2>

        <div className="rh-status-guide">
          <StatusGuideSection title="Xem tình trạng mộ">
            <div className="rh-status-item">
              <span className="rh-status-badge rh-status-pending">Chờ xác nhận</span>
              <p>Yêu cầu đang chờ nhân viên xem xét</p>
            </div>
            <div className="rh-status-item">
              <span className="rh-status-badge rh-status-confirmed">Đã xác nhận</span>
              <p>Nhân viên sẽ thực hiện kiểm tra, chụp ảnh mộ</p>
            </div>
            <div className="rh-status-item">
              <span className="rh-status-badge rh-status-rejected">Từ chối</span>
              <p>Yêu cầu không thể thực hiện, vui lòng xem lý do từ nhân viên</p>
            </div>
            <div className="rh-status-item">
              <span className="rh-status-badge rh-status-completed">Hoàn thành</span>
              <p>Đã gửi đầy đủ hình ảnh và thông tin về tình trạng mộ</p>
            </div>
            <div className="rh-status-item">
              <span className="rh-status-badge rh-status-failed">Thất bại</span>
              <p>Không thể hoàn thành yêu cầu, vui lòng xem lý do từ nhân viên</p>
            </div>
          </StatusGuideSection>

          <StatusGuideSection title="Đặt dịch vụ riêng">
            <div className="rh-status-item">
              <span className="rh-status-badge rh-status-pending">Chờ xác nhận</span>
              <p>Yêu cầu đang chờ nhân viên báo giá</p>
            </div>
            <div className="rh-status-item">
              <span className="rh-status-badge rh-status-rejected">Từ chối</span>
              <p>Không thể thực hiện yêu cầu này, vui lòng xem phản hồi từ nhân viên</p>
            </div>
            <div className="rh-status-item">
              <span className="rh-status-badge rh-status-waiting-response">Chờ phản hồi</span>
              <p>Nhân viên đã gửi báo giá, vui lòng xem và phản hồi</p>
            </div>
            <div className="rh-status-item">
              <span className="rh-status-badge rh-status-responded">Đã phản hồi</span>
              <p>Bạn đã đồng ý với báo giá, chờ nhân viên thực hiện</p>
            </div>
            <div className="rh-status-item">
              <span className="rh-status-badge rh-status-in-progress">Đang thực hiện</span>
              <p>Nhân viên đang tiến hành thực hiện dịch vụ theo yêu cầu</p>
            </div>
            <div className="rh-status-item">
              <span className="rh-status-badge rh-status-completed">Hoàn thành</span>
              <p>Dịch vụ đã được thực hiện xong, vui lòng kiểm tra kết quả</p>
            </div>
            <div className="rh-status-item">
              <span className="rh-status-badge rh-status-failed">Thất bại</span>
              <p>Không thể hoàn thành dịch vụ, vui lòng xem lý do từ nhân viên</p>
            </div>
          </StatusGuideSection>

          <StatusGuideSection title="Đăng ký dịch vụ có sẵn">
            <div className="rh-status-item">
              <span className="rh-status-badge rh-status-pending">Chờ xác nhận</span>
              <p>Yêu cầu đang chờ xác nhận từ nhân viên</p>
            </div>
            <div className="rh-status-item">
              <span className="rh-status-badge rh-status-confirmed">Đã xác nhận</span>
              <p>Đăng ký dịch vụ thành công, sẽ được thực hiện theo lịch</p>
            </div>
          </StatusGuideSection>
        </div>

        <div className="rh-search-container">
          <div className="rh-date-input-wrapper">
            <input
              type="date"
              value={searchDate}
              onChange={(e) => {
                setSearchDate(e.target.value);
                setCurrentPage(1);
              }}
              className="rh-date-input"
              min="2020-01-01"
              max={new Date().toISOString().split('T')[0]}
              required
            />
            <span className="rh-date-placeholder">
              {!searchDate && "Chọn ngày"}
            </span>
          </div>
          {searchDate && (
            <button
              className="rh-clear-search"
              onClick={() => {
                setSearchDate('');
                setCurrentPage(1);
              }}
            >
              Xóa tìm kiếm
            </button>
          )}
        </div>

        <div className="request-history-table-container">
          <table className="request-history-table">
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
                  <td className="rh-note-cell">
                    <div className="rh-note-content">
                      <button 
                        className="rh-note-view-btn"
                        onClick={() => handleNoteClick(request.note)}
                      >
                        Xem thêm
                      </button>
                    </div>
                  </td>
                  <td>{formatDate(request.createAt)}</td>
                  <td>{formatDate(request.endDate, request.typeId)}</td>
                  <td>{formatPrice(request.price)}</td>
                  <td>
                    <span className={`rh-status-badge rh-status-${getStatusLabel(request.status, request.typeId).class}`}>
                      {getStatusLabel(request.status, request.typeId).text}
                    </span>
                  </td>
                  <td>
                    <Link to={`/request-detail/${request.requestId}`} className="view-detail-btn">
                      Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <NoteModal 
          isOpen={selectedNote !== null}
          onClose={() => setSelectedNote(null)}
          note={selectedNote}
        />

        {totalPages > 1 && (
          <div className="request-history-pagination">
            <button 
              className="request-history-pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Trước
            </button>
            <span className="request-history-pagination-info">
              Trang {currentPage} / {totalPages}
            </span>
            <button 
              className="request-history-pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Sau
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default RequestHistory; 