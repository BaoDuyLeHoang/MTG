import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/sideBar';
import { useAuth } from '../../context/AuthContext';
import './OrderManagement.css';
import { getAllOrders } from '../../APIcontroller/API';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await getAllOrders();
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusText = (status) => {
        switch (status) {
            case 0: return 'Chưa thanh toán';
            case 1: return 'Đã thanh toán';
            case 2: return 'Hủy thanh toán';
            case 3: return 'Đang thực hiện';
            case 4: return 'Đã hoàn thành';
            default: return 'Không xác định';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 0: return 'status-yellow';
            case 1: return 'status-green';
            case 2: return 'status-red';
            case 3: return 'status-yellow';
            case 4: return 'status-green';
            default: return '';
        }
    };

    if (loading) return <div className="centered">Đang tải...</div>;
    if (error) return <div className="centered error">{error}</div>;

    return (
        <div className="order-management-container">
            <Sidebar />
            <div className="order-management-content centered">
                <h1>Quản Lý Đơn Hàng</h1>
                <p>Xin chào, {user?.accountName || 'Nhân viên'}</p>
                <div className="table-container">
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Mã Đơn Hàng</th>
                                <th>Mã Tài Khoản</th>
                                <th>Ngày Đặt Hàng</th>
                                <th>Tổng Giá</th>
                                <th>Trạng Thái</th>
                                <th>Chi Tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.orderId}>
                                    <td>{order.orderId}</td>
                                    <td>{order.accountId}</td>
                                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td>{order.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                    <td>
                                        <span className={`status ${getStatusColor(order.status)}`}>
                                            {getStatusText(order.status)}
                                        </span>
                                    </td>
                                    <td>
                                        <ul>
                                            {order.orderDetails.map((detail, index) => (
                                                <li key={index}>
                                                    {detail.serviceName} - {detail.martyrName} - {detail.orderPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderManagement;
