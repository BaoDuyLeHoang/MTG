import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar/sideBar";
import { useAuth } from "../../../context/AuthContext";
import "./OrderManagement.css";
import { getOrdersByManagerArea } from "../../../services/orders";
import { useNavigate } from "react-router-dom";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDate, setSelectedDate] = useState(""); // Set default to today's date

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem đơn hàng.");
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Prepare parameters for the API call
        const params = {
            accountId: user.accountId,
            pageIndex: currentPage, // Use currentPage as pageIndex
            pageSize: 5, // Set the number of orders per page
        };
        // Include selectedDate only if it has a value
        if (selectedDate) {
          params.date = selectedDate;
      }

        const response = await getOrdersByManagerArea(params.accountId, params.pageIndex, params.pageSize, params.date);
        console.log("Fetched orders:", response);
        
        if (response && response.orderDetails && Array.isArray(response.orderDetails)) {
            setOrders(response.orderDetails);
            setTotalPages(response.totalPage);
        } else {
            setError("Không có đơn hàng nào được tìm thấy hoặc dữ liệu không hợp lệ.");
        }
    } catch (error) {
        console.error("Error fetching orders:", error);
        setError(`Không thể tải danh sách đơn hàng. Lỗi: ${error.message}`);
        setOrders([]);
    } finally {
        setLoading(false);
    }
    };

    fetchOrders();
  }, [navigate, user.accountId, currentPage, selectedDate]);

  const getStatusText = (status, isOrderStatus = false) => {
    if (isOrderStatus) {
      // Order Status
      switch (status) {
        case 1:
          return "Đã thanh toán";
        case 2:
          return "Đã hủy";
        case 4:
          return "Đã hoàn thành";
        case 5:
          return "Quá hạn";
        default:
          return "Không xác định";
      }
    } else {
      // Task Status
      switch (status) {
        case 0:
          return "Đang bàn giao";
        case 1:
          return "Đã giao";
        case 2:
          return "Đã từ chối";
        case 3:
          return "Đang thực hiện";
        case 4:
          return "Đã hoàn thành";
        case 5:
          return "Quá hạn";
        default:
          return "Không xác định";
      }
    }
  };

  const getStatusColor = (status, isOrderStatus = false) => {
    if (isOrderStatus) {
      // Order Status
      switch (status) {
        case 1:
          return "status-green"; // Đã thanh toán - green
        case 2:
          return "status-red"; // Đã hủy - red
        case 4:
          return "status-green"; // Đã hoàn thành - green
        case 5:
          return "status-red"; // Quá hạn - red
        default:
          return "";
      }
    } else {
      // Task Status
      switch (status) {
        case 1:
          return "status-yellow"; // Đang bàn giao - yellow
        case 2:
          return "status-red"; // Đã từ chối - red
        case 3:
          return "status-yellow"; // Đang thực hiện - yellow
        case 4:
          return "status-green"; // Đã hoàn thành - green
        case 5:
          return "status-red"; // Quá hạn - red
        default:
          return "status-red";
      }
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/danhsachdonhang/${orderId}?managerId=${user.accountId}`);
  };

  return (
    <div className="order-management-container">
      <Sidebar />
      <div className="order-management-content">
        <h1>Quản Lý Đơn Hàng</h1>

        <div className="controls-container">
          <div className="search-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Tìm kiếm theo Mã đơn hàng hoặc Mã tài khoản..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="date-filter-wrapper">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-filter-input"
            />
          </div>
          <div className="filter-wrapper">
            <i className="fas fa-filter filter-icon"></i>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="order_1">Đã thanh toán</option>
              <option value="order_2">Đã hủy</option>
              <option value="order_4">Đã hoàn thành</option>
              <option value="order_5">Quá hạn</option>
              <option value="task_1">Đang bàn giao</option>
              <option value="task_2">Đã từ chối</option>
              <option value="task_3">Đang thực hiện</option>
              <option value="task_4">Đã hoàn thành</option>
              <option value="task_5">Quá hạn</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="centered">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="centered">
            <i className="fas fa-inbox"></i>
            <p>Không tìm thấy đơn hàng nào.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="order-table">
              <thead>
                <tr>
                  <th>Mã Chi Tiết</th>
                  <th>Tên Dịch Vụ</th>
                  <th>Tên Liệt Sĩ</th>
                  <th>Giá Dịch Vụ</th>
                  <th>Trạng Thái Đơn Hàng</th>
                  <th>Trạng Thái Công Việc</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.detailId}>
                    <td>#{order.detailId}</td>
                    <td>{order.serviceName}</td>
                    <td>{order.martyrName}</td>
                    <td>
                      <strong>
                        {order.orderPrice ? order.orderPrice.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }) : '0 VND'}
                      </strong>
                    </td>
                    <td>
                      <span className={`status ${getStatusColor(order.orderStatus, true)}`}>
                        {getStatusText(order.orderStatus, true)}
                      </span>
                    </td>
                    <td>
                      <span className={`status ${getStatusColor(order.statusTask)}`}>
                        {getStatusText(order.statusTask)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="detail-button"
                        onClick={() => handleViewDetails(order.detailId, user.accountId)}
                        disabled={!order.detailId}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={currentPage === page ? "active" : ""}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
