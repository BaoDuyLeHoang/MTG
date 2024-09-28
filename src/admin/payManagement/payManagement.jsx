import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/sideBar';
import DateFilter from '../../components/DateFilter/dateFilter';
import './payManagement.css';

const PayManagement = () => {
  const [payments, setPayments] = useState([]);
  const handleDateFilterChange = (startDate, endDate) => {
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
};
  useEffect(() => {
    // Fetch payment data from your API
    // This is just example data
    const fetchedPayments = [
      { id: 'DH001', customerName: 'Nguyễn Văn A', paymentDate: '2023-05-01', status: 'Hoàn thành', amount: 1000000 },
      { id: 'DH002', customerName: 'Trần Thị B', paymentDate: '2023-05-02', status: 'Đang xử lý', amount: 1500000 },
      { id: 'DH003', customerName: 'Lê Văn C', paymentDate: '2023-05-03', status: 'Thất bại', amount: 2000000 },
    ];
    setPayments(fetchedPayments);
  }, []);

  const handleDetailClick = (orderId) => {
    // Handle the detail button click
    console.log(`Showing details for order ${orderId}`);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Hoàn thành':
        return 'status-completed';
      case 'Đang xử lý':
        return 'status-pending';
      case 'Thất bại':
        return 'status-failed';
      default:
        return '';
    }
  };

  return (
    <div className="pay-management-container">
        <Sidebar />
        <div className="pay-management-content">
        <h1>QUẢN LÝ THANH TOÁN</h1>
        <DateFilter onFilterChange={handleDateFilterChange} className="date-filter" />
      <table className="pay-management-table">
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Tên khách hàng</th>
            <th>Ngày thanh toán</th>
            <th>Trạng thái</th>
            <th>Số tiền</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.customerName}</td>
              <td>{payment.paymentDate}</td>
              <td className={getStatusClass(payment.status)}>{payment.status}</td>
              <td>{payment.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
              <td>
                <button className="detail-button" onClick={() => handleDetailClick(payment.id)}>
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      
    </div>
  );
};

export default PayManagement;
