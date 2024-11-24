import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/sideBar';
import DateFilter from '../../../components/DateFilter/dateFilter';
import { getPayments } from '../../../services/payment'; // Import the getPayments function
import PaymentDetailModal from './PaymentDetailModal'; // Import the modal component
import '../payManagement/payManagement.css';

const PayManagement = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null); // State to hold the selected payment
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  
  const handleDateFilterChange = (dateRange) => {
    const { startDate, endDate } = dateRange;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error('Invalid date values:', startDate, endDate);
      return; // Exit if dates are invalid
    }

    const formattedStartDate = start.toISOString().split('T')[0];
    const formattedEndDate = end.toISOString().split('T')[0];

    fetchPayments(formattedStartDate, formattedEndDate);
  };

  const fetchPayments = async (startDate, endDate) => {
    try {
      const fetchedPayments = await getPayments(startDate, endDate);
      const formattedPayments = fetchedPayments.map(payment => ({
        id: payment.orderId.toString(),
        customerName: payment.customerName,
        paymentDate: new Date(payment.payDate).toLocaleDateString('vi-VN'),
        status: payment.status === 0 ? 'Hoàn thành' : 'Thất bại',
        amount: payment.paymentAmount,
        paymentMethod: payment.paymentMethod,
        bankCode: payment.bankCode,
        cardType: payment.cardType
      }));
      setPayments(formattedPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDetailClick = (payment) => {
    setSelectedPayment(payment); // Set the selected payment
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedPayment(null); // Clear the selected payment
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
        <div className="date-filter">
          <DateFilter onFilterChange={handleDateFilterChange} className="date-filter" />
          <div className="filter-button-container">
            <button className="filter-button">Xuất</button>
          </div>
        </div>

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
                  <button className="detail-button" onClick={() => handleDetailClick(payment)}>
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Render the modal */}
        {isModalOpen && <PaymentDetailModal payment={selectedPayment} onClose={closeModal} />}
      </div>
    </div>
  );
};

export default PayManagement;