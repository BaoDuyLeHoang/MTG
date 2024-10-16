import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../APIcontroller/API";
import Sidebar from "../../components/Sidebar/sideBar"
import '../orderDetail/OrderDetail.css';
import DatePicker from "react-datepicker";

const OrderDetail = () => {
    const { orderId } = useParams();
    const [orderDetail, setOrderDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    // Add this new state for start date
    const [startDate, setStartDate] = useState(null);

    const staffArea = [
        { id: 1, name: 'Lê Hoàng Bảo Duy' },
        { id: 2, name: 'Lý Nhật Nam' },
        { id: 3, name: 'Lê Mai' }
    ];

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const data = await getOrderById(orderId);
                setOrderDetail(data);
                setSelectedDate(new Date(data.endDate));
                // Set the start date from the API response
                setStartDate(new Date(data.startDate));
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch order details");
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [orderId]);

    const handleInputChange = (e) => {
        // Implement if needed
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
                        Order ID: {orderDetail.orderId}
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
                                        <span className={`status-${orderDetail.status}`}>
                                            {orderDetail.status === 0 ? 'Pending' : 'Completed'}
                                        </span>
                                    </td>
                                    <td>
                                        <select name="staffName" onChange={handleInputChange}>
                                            <option value="">Choose staff</option>
                                            {staffArea.map(staff => (
                                                <option key={staff.id} value={staff.name}>{staff.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="action">
                        <button className="deliver-button">Bàn giao</button>
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
