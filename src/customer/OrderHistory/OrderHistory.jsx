import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, Filter } from 'lucide-react';
import './OrderHistory.css';
import { getOrdersByAccountId } from '../../APIcontroller/API';
import Header from '../../components/Header/header'; // Import the Header component
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const iconStyle = { 
  verticalAlign: 'middle',
  marginRight: '8px'
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get user from AuthContext

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.accountId) {
        setError('User information not available. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const fetchedOrders = await getOrdersByAccountId(user.accountId);
        setOrders(fetchedOrders);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]); // Add user as a dependency

  const getStatusClass = (status) => {
    switch (status) {
      case 1: return 'status-pending';
      case 2: return 'status-refused';
      case 3: return 'status-in-progress';
      case 4: return 'status-completed';
      case 5: return 'status-failed';
      default: return 'status-default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
        case 1: return 'Đã giao';
      case 0: return "Đang giao cho nhan vien";
      case 2: return "Từ chối";
      case 3: return "Đang thực hiện";
      case 4: return "Hoàn thành";
      case 5: return "Thất bại";
      default: return "Unknown";
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderDetails.some(detail => 
      detail.martyrName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId.toString().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === 'all' || order.status.toString() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="order-history-page">
      <Header /> {/* Add the Header component here */}
      <div className="order-history">
        <div className="page-header">
          <h1 className="page-title">Lịch Sử Đơn Hàng</h1>
          <p className="page-description">Xem và quản lý các đơn hàng bảo trì mộ liệt sĩ</p>
        </div>

        <div className="filters">
          <div className="search-container-order-history">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên liệt sĩ hoặc mã đơn hàng"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="1">Đã giao</option>
            <option value="2">Từ chối</option>
            <option value="3">Đang thực hiện</option>
            <option value="4">Hoàn thành</option>
            <option value="5">Thất bại</option>
          </select>
        </div>

        <div className="order-grid">
          {filteredOrders.map((order) => (
            <div key={order.orderId} className="order-card">
              <div className="card-header">
                <div className="card-header-content">
                  <h2 className="order-id">Đơn hàng: {order.orderId}</h2>
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
              <div className="card-content">
                <div className="order-details">
                  <div>
                    <div className="detail-item">
                      <Calendar size={16} style={iconStyle} />
                      <span>Ngày đặt: {new Date(order.orderDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="detail-item">
                      <Calendar size={16} style={iconStyle} />
                      <span>Ngày bắt đầu: {new Date(order.startDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="detail-item">
                      <Calendar size={16} style={iconStyle} />
                      <span>Ngày kết thúc: {new Date(order.endDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="total-amount">Tổng tiền: {order.totalPrice.toLocaleString('vi-VN')} đ</h4>
                  </div>
                </div>
                {order.orderDetails.map((detail, index) => (
                  <div key={index} className="service-detail">
                    <h4 className="service-name">{detail.serviceName}</h4>
                    <p className="martyr-name">Tên liệt sĩ: {detail.martyrName}</p>
                    <p className="price">Giá: {detail.orderPrice.toLocaleString('vi-VN')} đ</p>
                    <p className="status-order">Trạng thái: {getStatusText(detail.statusTask)}</p>
                    {detail.staffs && detail.staffs.length > 0 && (
                      <p className="staff">Nhân viên: {detail.staffs.map(staff => staff.staffFullName).join(', ')}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
