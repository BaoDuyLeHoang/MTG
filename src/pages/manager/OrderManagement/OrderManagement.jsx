import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar/sideBar";
import { useAuth } from "../../../context/AuthContext";
import "./OrderManagement.css";
import { getAllOrders } from "../../../APIcontroller/API";
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

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.orderId.toString().includes(searchTerm) ||
        order.accountId.toString().includes(searchTerm);
      const matchesStatus =
        statusFilter === "all" || order.status.toString() === statusFilter;
      return matchesSearch && matchesStatus;
    });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

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
        setError(null); // Reset error state before fetching
        const data = await getAllOrders();
        console.log("Fetched orders:", data);
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data);
        } else {
          setError(
            "Không có đơn hàng nào được tìm thấy hoặc dữ liệu không hợp lệ."
          );
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(`Không thể tải danh sách đơn hàng. Lỗi: ${error.message}`);
        setOrders([]); // Reset orders state on error
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Chưa thanh toán";
      case 1:
        return "Đã thanh toán";
      case 2:
        return "Hủy thanh toán";
      case 3:
        return "Đang thực hiện";
      case 4:
        return "Đã hoàn thành";
      case 5:
        return "Đơn hàng thất bại";
      case 6:
        return "Đã hoàn tiền";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "status-yellow";
      case 1:
        return "status-green";
      case 2:
        return "status-red";
      case 3:
        return "status-yellow";
      case 4:
        return "status-green";
      case 5:
        return "status-red";
      case 6:
        return "status-blue";
      default:
        return "";
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/danhsachdonhang/${orderId}`);
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
          <div className="filter-wrapper">
            <i className="fas fa-filter filter-icon"></i>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="0">Chưa thanh toán</option>
              <option value="1">Đã thanh toán</option>
              <option value="2">Hủy thanh toán</option>
              <option value="3">Đang thực hiện</option>
              <option value="4">Đã hoàn thành</option>
              <option value="5">Đơn hàng thất bại</option>
              <option value="6">Đã hoàn tiền</option>
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
        ) : filteredOrders.length === 0 ? (
          <div className="centered">
            <i className="fas fa-inbox"></i>
            <p>Không tìm thấy đơn hàng nào.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="order-table">
              <thead>
                <tr>
                  <th>Mã Đơn Hàng</th>
                  <th>Mã Tài Khoản</th>
                  <th>Ngày Đặt Hàng</th>
                  <th>Tổng Giá</th>
                  <th>Trạng Thái</th>
                  <th>Chi tiết</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td>#{order.orderId}</td>
                    <td>{order.accountId}</td>
                    <td>
                      {new Date(order.orderDate).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td>
                      <strong>
                        {order.totalPrice.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </strong>
                    </td>
                    <td>
                      <span
                        className={`status ${getStatusColor(order.status)}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td>
                      <ul>
                        {order.orderDetails.map((detail, index) => (
                          <li key={index}>
                            {detail.serviceName} - {detail.martyrName} -{" "}
                            {detail.orderPrice.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </li>
                        ))}
                      </ul>
                    </td>

                    <td>
                      <button
                        className="detail-button"
                        onClick={() => handleViewDetails(order.orderId)}
                        disabled={!order.orderId}
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
