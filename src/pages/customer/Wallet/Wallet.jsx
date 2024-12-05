import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/Header/header';
import AlertMessage from '../../../components/AlertMessage/AlertMessage';
import { getWalletBalance, depositWallet, getWalletTransactions } from '../../../APIcontroller/API';
import './Wallet.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from 'date-fns';

const Wallet = () => {
  const { user } = useAuth();
  const [walletInfo, setWalletInfo] = useState({
    balance: 0,
    updatedAt: null
  });
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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

  const formatDateForApi = (date) => {
    if (!date) return '';
    return format(date, 'yyyy-MM-dd');
  };

  const fetchTransactions = async () => {
    try {
      const formattedStartDate = startDate ? `${formatDateForApi(startDate)}T00:00:00` : '';
      const formattedEndDate = endDate ? `${formatDateForApi(endDate)}T23:59:59` : '';
      
      const data = await getWalletTransactions(
        user.accountId, 
        currentPage, 
        5, 
        formattedStartDate, 
        formattedEndDate
      );
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
      year: 'numeric',
      hour12: false
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) < 10000) {
      setAlertMessage('Số tiền nạp tối thiểu là 10.000 VNĐ');
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
                type="text"
                value={amount ? Number(amount).toLocaleString('vi-VN') + '' : ''}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/[^\d]/g, '');
                  setAmount(rawValue);
                }}
                placeholder="Nhập số tiền muốn nạp (Tối thiểu 10.000 VNĐ)"
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
            <h3>Biến động số dư:</h3>
            <div className="date-filters">
              <div className="date-filter-item">
                <label>Từ ngày:</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="ngày /tháng / năm"
                  isClearable
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={15}
                  maxDate={endDate || new Date()}
                />
              </div>
              <div className="date-filter-item">
                <label>Đến ngày:</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="ngày / tháng / năm"
                  isClearable
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={15}
                  minDate={startDate}
                  maxDate={new Date()}
                />
              </div>
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