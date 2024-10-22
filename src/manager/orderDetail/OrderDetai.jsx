import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOrderById, createTaskForStaff } from "../../APIcontroller/API";
import Sidebar from "../../components/Sidebar/sideBar"
import '../orderDetail/OrderDetail.css';
import DatePicker from "react-datepicker";

const OrderDetail = () => {
    const { orderId } = useParams();
    const [orderDetail, setOrderDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState({});

    // Function to get status text based on status number
    const getStatusText = (statusTask) => {
        switch (statusTask) {
            case 0: return "Đang chờ";
            case 1: return "Đã giao";
            case 2: return "Từ chối";
            case 3: return "Đang thực hiện";
            case 4: return "Hoàn thành";
            case 5: return "Thất bại";
            default: return "Unknown";
        }
    };

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const data = await getOrderById(orderId);
                console.log("Fetched Order Detail:", data);
                setOrderDetail(data);
                setSelectedDate(new Date(data.endDate));
                setStartDate(new Date(data.startDate));
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch order details");
                setLoading(false);
                console.error("Error fetching order details:", err);
            }
        };

        fetchOrderDetail();
    }, [orderId]);

    const handleStaffSelection = (detailId, staffId) => {
        console.log(`Staff selected for detail ${detailId}: ${staffId}`);
        setSelectedStaff(prev => {
            const newState = {...prev, [detailId]: staffId};
            console.log("Updated selectedStaff state:", newState);
            return newState;
        });
    };

    const handleBanGiao = async () => {
        try {
            console.log("Starting task assignment process...");
            const tasksToCreate = orderDetail.orderDetails.map(detail => {
                const staffId = selectedStaff[detail.detailId];
                if (!staffId) {
                    throw new Error(`No staff selected for detail ${detail.detailId}`);
                }
                return {
                    accountId: parseInt(staffId, 10),
                    orderId: parseInt(orderDetail.orderId, 10),
                    detailId: parseInt(detail.detailId, 10),
                    endDate: selectedDate.toISOString()
                };
            });

            console.log("Sending tasks data:", JSON.stringify(tasksToCreate, null, 2));
            const result = await createTaskForStaff(tasksToCreate);
            console.log("Tasks creation result:", result);
            
            alert('All tasks assigned successfully!');
        } catch (error) {
            console.error('Failed to assign tasks:', error);
            alert(`Failed to assign tasks: ${error.message}`);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!orderDetail) return <div>No order details found</div>;

    return (
        <div className="order-detail-container">
            <Sidebar />
            <div className="order-admin-full">
                <div className="header-container">
                    <div className="section-name">Order Details</div>
                    <div className="section-details">
                        Order ID: {orderDetail.orderId} | 
                        Status: <span className={`status-${orderDetail.status}`}>
                            {getStatusText(orderDetail.status)}
                        </span>
                    </div>
                </div>
                <div className="order-section">
                    <table className="order-detail-table">
                        <thead>
                            <tr>
                                <th>Service</th>
                                <th>Martyr Name</th>
                                <th>Price</th>
                                <th>Completion Date</th>
                                <th>Status</th>
                                <th>Staff</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetail.orderDetails.map((detail, index) => (
                                <tr key={index}>
                                    <td>{detail.serviceName}</td>
                                    <td>{detail.martyrName}</td>
                                    <td>{detail.orderPrice}đ</td>
                                    <td>
                                        <DatePicker
                                            selected={selectedDate}
                                            onChange={(date) => setSelectedDate(date)}
                                            dateFormat="dd/MM/yyyy"
                                            className="custom-input"
                                        />
                                    </td>
                                    <td>
                                        <span className={`status-${detail.statusTask}`}>
                                            {getStatusText(detail.statusTask)}
                                        </span>
                                    </td>
                                    <td>
                                        <select 
                                            name="staffName" 
                                            onChange={(e) => handleStaffSelection(detail.detailId, e.target.value)}
                                            value={selectedStaff[detail.detailId] || ""}
                                        >
                                            <option value="">Choose staff</option>
                                            {detail.staffs.map(staff => (
                                                <option key={staff.accountId} value={staff.accountId}>
                                                    {staff.staffFullName}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="action">
                        <button className="deliver-button" onClick={handleBanGiao}>Bàn giao</button>
                    </div>
                </div>
                <div className="order-summary">
                    <div className="order-summary-detail">
                        <div className="summary-order">
                            <h2>CẬP NHẬT TÌNH TRẠNG ĐƠN HÀNG</h2>
                            <p>Đơn hàng đã được tạo ({startDate && startDate.toLocaleString('vi-VN', { 
                                hour: '2-digit', 
                                minute: '2-digit', 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: 'numeric' 
                            })})</p>
                            <p>Đơn hàng đã được xác nhận (15:20  12/09/2024)</p>
                        </div>
                    </div>
                    <div className="summary-detail">
                        <p style={{ textAlign: 'right', marginTop: '-110px' }}>Đơn giá: 150.000đ</p>
                        <p style={{ textAlign: 'right', marginTop: '0px' }}>Số lượng: 2</p>
                        <p style={{ textAlign: 'right', marginTop: '4px' }}>Tổng tiền hàng: 300.000đ</p>
                        <p style={{ textAlign: 'right', marginTop: '12px' }}>Tổng thanh toán: 300.000đ</p>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default OrderDetail;
