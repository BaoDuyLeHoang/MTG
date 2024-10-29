import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sideBar";
import "./FeedbackManagement.css";

export default function FeedbackManagement() {
  const [loading, setLoading] = useState(true);
  const [feedbackData, setFeedbackData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Simulated data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFeedbackData(
        Array.from({ length: 5 }).map((_, index) => ({
          id: index + 1,
          creatorName: "Nguyen Cong Ty",
          createdDate: "01/01/2024",
          type: "Lỗi web",
          title: "WEB lỗi quá nhiều",
        }))
      );
      setLoading(false);
    }, 1000);
  }, []);

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
                {feedbackData.map((feedback) => (
                  <tr key={feedback.id}>
                    <td>#{feedback.id}</td>
                    <td>{feedback.creatorName}</td>
                    <td>{feedback.createdDate}</td>
                    <td>{feedback.type}</td>
                    <td>{feedback.title}</td>
                    <td>
                      <button className="detail-button">Xem</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
