import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/Header/header';
import AlertMessage from '../../../components/AlertMessage/AlertMessage';
import { getWalletBalance, depositWallet, getWalletTransactions } from '../../../APIcontroller/API';
import './Wallet.css';

const Wallet = () => {
  const { user } = useAuth();
  const [walletInfo, setWalletInfo] = useState({
    balance: 0,
    updatedAt: null
  });
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [amount, setAmount] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const paymentMethods = [
    { 
      id: "VNPAY", 
      name: "VNPay",
      logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
    },
    { 
      id: "MOMO", 
      name: "Ví Momo",
      logo: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
    }
  ];

  useEffect(() => {
    fetchWalletBalance();
    fetchTransactions();
  }, [currentPage, startDate, endDate]);

  const fetchWalletBalance = async () => {
    try {
      const response = await getWalletBalance(user.accountId);
      setWalletInfo({
        balance: response.customerBalance || 0,
        updatedAt: response.updateAt
      });
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      setAlertMessage('Không thể lấy thông tin số dư');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const fetchTransactions = async () => {
    try {
      const data = await getWalletTransactions(user.accountId, currentPage, 5, startDate, endDate);
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setAlertMessage('Không thể tải lịch sử giao dịch');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDeposit = async () => {
    if (!amount || amount <= 0) {
      setAlertMessage('Vui lòng nhập số tiền hợp lệ');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    if (!selectedMethod) {
      setAlertMessage('Vui lòng chọn phương thức nạp tiền');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      const depositData = {
        customerId: user.accountId,
        amount: parseFloat(amount),
        paymentMethod: selectedMethod
      };

      const response = await depositWallet(depositData);

      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        setAlertMessage('Có lỗi xảy ra khi xử lý nạp tiền');
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    } catch (error) {
      console.error('Error depositing to wallet:', error);
      setAlertMessage(error.response?.data || 'Có lỗi xảy ra khi nạp tiền');
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="wallet-container">
        <div className="wallet-content">
          <h2>Ví của tôi</h2>
          
          <div className="wallet-balance">
            <h3>Số dư hiện tại</h3>
            <p className="balance-amount">{walletInfo.balance.toLocaleString('vi-VN')} VNĐ</p>
            {walletInfo.updatedAt && (
              <p className="last-updated">
                Cập nhật lúc: {formatDateTime(walletInfo.updatedAt)}
              </p>
            )}
          </div>

          <div className="deposit-section">
            <h3>Nạp tiền</h3>
            <div className="amount-input">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nhập số tiền muốn nạp"
                min="10000"
              />
            </div>

            <div className="payment-methods">
              <h4>Chọn phương thức nạp tiền</h4>
              <div className="methods-grid">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`method-item ${selectedMethod === method.id ? 'selected' : ''}`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <img src={method.logo} alt={method.name} />
                    <span>{method.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              className="deposit-button"
              onClick={handleDeposit}
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Nạp tiền'}
            </button>
          </div>

          <div className="transaction-history">
            <h3>Lịch sử giao dịch</h3>
            <div className="date-filters">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Ngày bắt đầu"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Ngày kết thúc"
              />
            </div>
            <div className="transaction-list">
              {transactions.map((transaction) => (
                <div key={transaction.transactionId} className="transaction-card">
                  <div className="transaction-row">
                    <span className="transaction-label">Số tiền:</span>
                    <span className="transaction-amount">{transaction.amount.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="transaction-row">
                    <span className="transaction-label">Nội dung:</span>
                    <span className="transaction-description">{transaction.description}</span>
                  </div>
                  <div className="transaction-row">
                    <span className="transaction-label">Thời gian:</span>
                    <span className="transaction-date">{formatDateTime(transaction.transactionDate)}</span>
                  </div>
                  <div className="transaction-row">
                    <span className="transaction-label">Số dư sau GD:</span>
                    <span className="transaction-balance">{transaction.balanceAfterTransaction.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="pagination">
              <button 
                className="pagination-button"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              <span>Trang {currentPage} / {totalPages}</span>
              <button 
                className="pagination-button"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      <AlertMessage
        open={alertOpen}
        handleClose={() => setAlertOpen(false)}
        severity={alertSeverity}
        message={alertMessage}
      />
    </div>
  );
};

export default Wallet;