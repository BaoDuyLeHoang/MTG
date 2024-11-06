import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetails } from "../../../services/orders";
import { createTask } from "../../../services/task";
import Sidebar from "../../../components/Sidebar/sideBar";
import "../orderDetail/OrderDetail.css";
import DatePicker from "react-datepicker";
import { FaClipboardList, FaClock, FaMoneyBillWave } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import AlertMessage from "../../../components/AlertMessage/AlertMessage";

const OrderDetail = () => {
  const { orderId: detailId } = useParams();
  const { user } = useAuth();
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  // Function to get status text based on status number
  const getStatusText = (statusTask) => {
    switch (statusTask) {
      case 0:
        return "Chờ xử lý";
      case 1:
        return "Đang giao";
      case 2:
        return "Đã hủy";
      case 3:
        return "Đang thực hiện";
      case 4:
        return "Hoàn thành";
      case 5:
        return "Thất bại";
      default:
        return "Không xác định";
    }
  };

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const data = await getOrderDetails(detailId, user.accountId);
        console.log("Fetched Order Detail:", data);
        setOrderDetail(data);
        setSelectedDate(
          data.expectedCompletionDate
            ? new Date(data.expectedCompletionDate)
            : new Date()
        );
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch order details");
        setLoading(false);
        console.error("Error fetching order details:", err);
      }
    };

    if (user && user.accountId) {
      fetchOrderDetail();
    }
  }, [detailId, user]);

  const handleStaffSelection = (detailId, staffId) => {
    console.log(`Staff selected for detail ${detailId}: ${staffId}`);
    setSelectedStaff((prev) => {
      const newState = { ...prev, [detailId]: staffId };
      console.log("Updated selectedStaff state:", newState);
      return newState;
    });
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleBanGiao = async () => {
    try {
      console.log("Starting task assignment process...");
      
      // Validate staff selection
      if (!selectedStaff[orderDetail.detailId]) {
        throw new Error("Please select a staff member");
      }

      // Create task data as a list/array
      const taskData = [{
        accountId: parseInt(selectedStaff[orderDetail.detailId], 10),
        orderId: parseInt(orderDetail.orderId, 10),
        detailId: parseInt(orderDetail.detailId, 10)
      }];

      console.log("Sending task data:", taskData);
      
      const result = await createTask(taskData);
      console.log("Task creation result:", result);
      
      setAlertSeverity("success");
      setAlertMessage("Task assigned successfully!");
      setAlertOpen(true);
      
      // Optional: Add a slight delay before reloading
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error("Failed to assign task:", error);
      setAlertSeverity("error");
      setAlertMessage(`Failed to assign task: ${error.message}`);
      setAlertOpen(true);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!orderDetail) return <div>Không tìm thấy chi tiết đơn hàng</div>;

  return (
    <div className="order-detail-container">
      <AlertMessage 
        open={alertOpen}
        handleClose={handleAlertClose}
        severity={alertSeverity}
        message={alertMessage}
      />
      <Sidebar />
      <div className="order-admin-full">
        <div className="header-container">
          <div className="section-name">
            <FaClipboardList className="header-icon" />
            Chi Tiết Đơn Hàng
          </div>
          <div className="section-details">
            <span className="order-badge">
              Mã đơn hàng: {orderDetail?.orderId}
            </span>{" "}
            | Trạng thái:{" "}
            <span className={`status-badge status-${orderDetail?.orderStatus}`}>
              {getStatusText(orderDetail?.orderStatus)}
            </span>
          </div>
        </div>
        <div className="order-section">
          <table className="order-detail-table">
            <thead>
              <tr>
                <th>Dịch Vụ</th>
                <th>Tên Liệt Sĩ</th>
                <th>Giá</th>
                <th>Ngày Hoàn Thành</th>
                <th>Trạng Thái</th>
                <th>Nhân Viên</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{orderDetail?.serviceName}</td>
                <td>{orderDetail?.martyrName}</td>
                <td>{orderDetail?.orderPrice}đ</td>
                <td>
                  {orderDetail?.expectedCompletionDate
                    ? new Date(
                        orderDetail.expectedCompletionDate
                      ).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "Không có ngày"}
                </td>
                <td>
                  <span className={`status-${orderDetail?.statusTask}`}>
                    {getStatusText(orderDetail?.statusTask)}
                  </span>
                </td>
                <td>
                  <select
                    name="staffName"
                    onChange={(e) =>
                      handleStaffSelection(
                        orderDetail?.detailId,
                        e.target.value
                      )
                    }
                    value={selectedStaff[orderDetail?.detailId] || ""}
                  >
                    <option value="">Chọn nhân viên</option>
                    {orderDetail?.staffs.map((staff) => (
                      <option key={staff.accountId} value={staff.accountId}>
                        {staff.staffFullName}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="action">
            <button className="deliver-button" onClick={handleBanGiao}>
              Bàn giao
            </button>
          </div>
        </div>
        <div className="order-summary">
          <div className="order-summary-detail">
            <div className="summary-order">
              <h2>
                <FaClock className="summary-icon" /> CẬP NHẬT TÌNH TRẠNG ĐƠN
                HÀNG
              </h2>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <p>
                    Đơn hàng đã được tạo (
                    {orderDetail?.orderDate
                      ? new Date(orderDetail.orderDate).toLocaleString(
                          "vi-VN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : "Không có ngày"}
                    )
                  </p>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <p>Ghi chú: {orderDetail?.note || "Không có ghi chú"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="summary-detail">
            <div className="price-summary">
              <h3>
                <FaMoneyBillWave className="summary-icon" /> Chi tiết thanh toán
              </h3>
              <div className="price-item total">
                <span>Tổng thanh toán:</span>
                <span>{orderDetail?.orderPrice}đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
