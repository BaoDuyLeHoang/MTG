import React from 'react';
import './PaymentDetailModal.css'; // Add your styles here

const PaymentDetailModal = ({ payment, onClose }) => {
  if (!payment) return null; // Don't render if no payment is selected

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Chi tiết thanh toán</h2>
        <p><strong>Mã đơn hàng:</strong> {payment.id}</p>
        <p><strong>Tên khách hàng:</strong> {payment.customerName}</p>
        <p><strong>Ngày thanh toán:</strong> {payment.paymentDate}</p>
        <p><strong>Phương thức thanh toán:</strong> {payment.paymentMethod}</p>
        <p><strong>Mã ngân hàng:</strong> {payment.bankCode}</p>
        <p><strong>Loại thẻ:</strong> {payment.cardType}</p>
        <p><strong>Trạng thái:</strong> {payment.status}</p>
        <p><strong>Số tiền:</strong> {payment.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PaymentDetailModal;