import React, { useState, useEffect } from "react";
import { Search, Calendar, MapPin, Filter } from "lucide-react";
import "./OrderHistory.css";
import { getOrdersByCustomer } from "../../../services/orders";
import Header from "../../../components/Header/header"; // Import the Header component
import { useAuth } from "../../../context/AuthContext"; // Import useAuth
import { Link } from "react-router-dom";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Rating, 
  TextField, 
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  styled,
  Box
} from '@mui/material';
import AlertMessage from '../../../components/AlertMessage/AlertMessage';
import { createFeedback } from "../../../services/feedback"; // Add this import

const iconStyle = {
  verticalAlign: "middle",
  marginRight: "8px",
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'center',
  padding: '16px',
  '&.action-cell': {
    minWidth: '200px',
  }
}));

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get user from AuthContext
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.accountId) {
        setError("User information not available. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await getOrdersByCustomer(user.accountId, null, currentPage);
        setOrders(response.orders || []);
        setTotalPages(response.totalPage);
        
        if (currentPage > response.totalPage) {
          setCurrentPage(1);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
        setOrders([]);
        setTotalPages(1);
      }
    };

    fetchOrders();
  }, [user, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 1:
        return "status-pending";
      case 2:
        return "status-refused";
      case 4:
        return "status-completed";
      default:
        return "status-default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Đang chờ";
      case 1:
        return "Đã thanh toán";
      case 2:
        return "Thất bại";
      case 4:
        return "Hoàn thành";
      default:
        return "Unknown";
    }
  };

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch = order.orderDetails.some(
      (detail) =>
        detail.martyrName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderId.toString().includes(searchTerm.toLowerCase())
    );
    const matchesStatus =
      statusFilter === "all" || order.status.toString() === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleOpenFeedback = (order) => {
    setSelectedOrder(order);
    setOpenFeedback(true);
  };

  const handleCloseFeedback = () => {
    setOpenFeedback(false);
    setRating(0);
    setFeedback('');
    setSelectedOrder(null);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleSubmitFeedback = async () => {
    try {
      if (!rating) {
        setAlertMessage('Vui lòng chọn số sao đánh giá!');
        setAlertSeverity('error');
        setAlertOpen(true);
        return;
      }

      const feedbackData = {
        accountId: user.accountId,
        detailId: selectedOrder.orderId,
        content: feedback,
        rating: rating
      };
      
      await createFeedback(feedbackData);

      setAlertMessage('Đánh giá đã được gửi thành công!');
      setAlertSeverity('success');
      setAlertOpen(true);
      handleCloseFeedback();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setAlertMessage('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="order-history-page">
      <Header />
      <div className="order-history">
        <div className="page-header">
          <h1 className="page-title">Lịch Sử Đơn Hàng</h1>
        </div>

        <div className="filters">
          <div className="search-container-order-history">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên liệt sĩ hoặc mã đơn hàng"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="1">Đã thanh toán</option>
            <option value="2">Thất bại</option>
            <option value="4">Hoàn thành</option>
          </select>
        </div>

        <div className="table-container">
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Mã đơn hàng</StyledTableCell>
                  <StyledTableCell>Ngày đặt</StyledTableCell>
                  <StyledTableCell>Ngày hoàn thành</StyledTableCell>
                  <StyledTableCell>Dịch vụ</StyledTableCell>
                  <StyledTableCell>Tổng tiền</StyledTableCell>
                  <StyledTableCell>Trạng thái</StyledTableCell>
                  <StyledTableCell className="action-cell">Thao tác</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.orderId}>
                    <StyledTableCell>#{order.orderId}</StyledTableCell>
                    <StyledTableCell>{new Date(order.orderDate).toLocaleDateString("vi-VN")}</StyledTableCell>
                    <StyledTableCell>{new Date(order.expectedCompletionDate).toLocaleDateString("vi-VN")}</StyledTableCell>
                    <StyledTableCell>
                      {order.orderDetails.map((detail, index) => (
                        <div key={index} className="service-item">
                          <div>{detail.serviceName}</div>
                        </div>
                      ))}
                    </StyledTableCell>
                    <StyledTableCell>{order.totalPrice.toLocaleString("vi-VN")}đ</StyledTableCell>
                    <StyledTableCell>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell className="action-cell">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          component={Link}
                          to={`/order-detail-cus/${order.orderId}`}
                          sx={{
                            backgroundColor: '#e0f2fe',
                            color: '#0369a1',
                            '&:hover': {
                              backgroundColor: '#bae6fd',
                            },
                            minWidth: '80px',
                          }}
                        >
                          Chi tiết
                        </Button>
                        {(order.status === 4 || order.status === 2) && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleOpenFeedback(order)}
                            sx={{
                              backgroundColor: '#f0fdf4',
                              color: '#166534',
                              '&:hover': {
                                backgroundColor: '#dcfce7',
                              },
                            }}
                          >
                            Đánh giá
                          </Button>
                        )}
                      </Box>
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`pagination-button ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}
        </div>
        {/* Feedback Dialog */}
        <Dialog 
          open={openFeedback} 
          onClose={handleCloseFeedback}
          PaperProps={{
            style: {
              borderRadius: '12px',
              padding: '16px',
              maxWidth: '500px',
              width: '90%'
            }
          }}
        >
          <DialogTitle sx={{ 
            fontSize: '24px', 
            fontWeight: 600,
            padding: '16px 24px',
            borderBottom: '1px solid #e0e0e0'
          }}>
            Đánh giá đơn hàng #{selectedOrder?.orderId}
          </DialogTitle>
          <DialogContent sx={{ padding: '24px' }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '24px'
            }}>
              <div>
                <p style={{ 
                  fontSize: '16px', 
                  marginBottom: '12px',
                  fontWeight: 500 
                }}>
                  Đánh giá của bạn
                </p>
                <Rating
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  size="large"
                  sx={{
                    fontSize: '32px',
                    '& .MuiRating-iconFilled': {
                      color: '#faaf00',
                    },
                  }}
                />
              </div>
              <TextField
                label="Nội dung đánh giá"
                multiline
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />
            </div>
          </DialogContent>
          <DialogActions sx={{ 
            padding: '16px 24px',
            borderTop: '1px solid #e0e0e0',
            gap: '12px'
          }}>
            <Button 
              onClick={handleCloseFeedback}
              sx={{
                color: '#666',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleSubmitFeedback} 
              variant="contained" 
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
                borderRadius: '8px',
                padding: '8px 16px',
              }}
            >
              Gửi đánh giá
            </Button>
          </DialogActions>
        </Dialog>
        <AlertMessage
          open={alertOpen}
          handleClose={handleAlertClose}
          severity={alertSeverity}
          message={alertMessage}
        />
      </div>
    </div>
  );
};

export default OrderHistory;
