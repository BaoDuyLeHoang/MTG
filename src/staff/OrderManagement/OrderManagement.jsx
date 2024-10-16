import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/sideBar';
import { useAuth } from '../../context/AuthContext';
import './OrderMnagement.css';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        // Fetch orders data here
        // For now, we'll use dummy data
        const dummyOrders = [
            { id: 1, customerName: 'John Doe', orderDate: '2023-06-01', status: 'Pending' },
            { id: 2, customerName: 'Jane Smith', orderDate: '2023-06-02', status: 'Completed' },
            { id: 3, customerName: 'Bob Johnson', orderDate: '2023-06-03', status: 'In Progress' },
        ];
        setOrders(dummyOrders);
    }, []);

    return (
        <div className="order-management-container">
            <Sidebar />
            <div className="order-management-content">
                <h1>Order Management</h1>
                <p>Welcome, {user?.accountName || 'Staff Member'}</p>
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer Name</th>
                            <th>Order Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customerName}</td>
                                <td>{order.orderDate}</td>
                                <td>{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagement;

