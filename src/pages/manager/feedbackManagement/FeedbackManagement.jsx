import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar/sideBar";
import { getAllFeedback } from "../../../services/feedback";
import "./FeedbackManagement.css";

export default function FeedbackManagement() {
  const [loading, setLoading] = useState(true);
  const [feedbackData, setFeedbackData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Replace simulated data with actual API call
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const response = await getAllFeedback(currentPage, pageSize);
        console.log('API Response:', response); // For debugging
        setFeedbackData(response.data?.items || []); // Assuming the data is nested under 'items'
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setFeedbackData([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [currentPage, pageSize]);

  return (
    <div className="fb-management-container">
      <Sidebar />
      <div className="fb-management-content">
        <h1>Danh Sách Các Feedback</h1>

        {loading ? (
          <div className="centered">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="table-container">
            <div className="fb-filters">
              <div className="filter-container">
                {/* Search Section */}
                <div className="search-section">
                  <div className="search-wrapper">
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên người dùng..."
                      className="search-input"
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Date Filter Section */}
                <div className="date-section">
                  <div className="date-wrapper">
                    <div className="date-group">
                      <input
                        type="date"
                        className="date-input"
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="Từ ngày"
                      />
                    </div>
                    <span className="date-separator">-</span>
                    <div className="date-group">
                      <input
                        type="date"
                        className="date-input"
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="Đến ngày"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <table className="fb-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên người tạo</th>
                  <th>Ngày tạo</th>
                  <th>Loại</th>
                  <th>Tiêu đề</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {feedbackData && feedbackData.length > 0 ? (
                  feedbackData.map((feedback) => (
                    <tr key={feedback.id}>
                      <td>#{feedback.id}</td>
                      <td>{feedback.creatorName}</td>
                      <td>{new Date(feedback.createdDate).toLocaleDateString('vi-VN')}</td>
                      <td>{feedback.type}</td>
                      <td>{feedback.title}</td>
                      <td>
                        <button className="detail-button">Xem</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      Chưa có phản hồi nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Add pagination controls */}
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              <span>Trang {currentPage}</span>
              <button 
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={feedbackData.length < pageSize}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
