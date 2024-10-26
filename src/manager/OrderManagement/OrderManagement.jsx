import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sideBar";
import { useAuth } from "../../context/AuthContext";
import "./OrderManagement.css";
import { getAllOrders } from "../../APIcontroller/API";
import { useNavigate } from "react-router-dom";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

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
      <div className="order-management-content centered">
        <h1>Quản Lý Đơn Hàng</h1>
        <p>Xin chào, {user?.accountName || "Nhân viên"}</p>
        {loading && <div className="centered">Đang tải...</div>}
        {error && <div className="centered error">{error}</div>}
        {!loading && !error && orders.length === 0 && (
          <div className="centered">Không có đơn hàng nào để hiển thị.</div>
        )}
        {!loading && !error && orders.length > 0 && (
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
                {orders.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{order.accountId}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>
                      {order.totalPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
