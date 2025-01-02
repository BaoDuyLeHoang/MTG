import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar/sideBar";
import { useAuth } from "../../../context/AuthContext";
import "../graveView/GraveView.css";
import { Link } from "react-router-dom";
import { getAllGravesForManager } from "../../../services/graves";
import LoadingForSideBar from "../../../components/LoadingForSideBar/LoadingForSideBar";

export default function GraveView() {
  const [graves, setGraves] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const { user } = useAuth();
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchGraves();
  }, [currentPage, pageSize]);

  const fetchGraves = async () => {
    try {
      setLoading(true);
      const response = await getAllGravesForManager(currentPage, pageSize, user.accountId);
      console.log("API Response:", response); // Debug log

      if (response && response.martyrGraveList && Array.isArray(response.martyrGraveList)) {
        console.log("Graves List:", response.martyrGraveList); // Log graves list
        console.log("Total Pages:", response.totalPage); // Log total pages

        setGraves(response.martyrGraveList);
        setTotalPages(response.totalPage || 1);
      } else {
        console.log("Invalid data format received from server");
      }
    } catch (error) {
      console.error("Error fetching graves:", error);
      setError("Failed to fetch graves data");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch (error) {
      return "N/A";
    }
  };

  const filteredGraves = graves.filter((grave) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (grave.martyrCode && grave.martyrCode.toLowerCase().includes(searchLower)) ||
      (grave.name && grave.name.toLowerCase().includes(searchLower)) ||
      (grave.areaDescription && grave.areaDescription.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="gv-container">
        <Sidebar />
        <div className="gv-content">
          <h1 className="gv-title">Danh Sách Mộ</h1>
          <LoadingForSideBar fullScreen={false} text="Đang tải danh sách mộ..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gv-container">
        <Sidebar />
        <div className="gv-content">
          <h1 className="gv-title">Danh Sách Mộ</h1>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="gv-container">
      <Sidebar />
      <div className="gv-content">
        <h1 className="gv-title">Danh Sách Mộ</h1>
        <div className="gv-search-filters">
          <div className="search-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="search"
              className="search-input"
              placeholder="Tìm kiếm theo mã mộ, tên liệt sĩ hoặc khu vực..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="gv-table-container">
          <table className="gv-table">
            <thead>
              <tr className="gv-table-header">
                <th>Mã mộ</th>
                <th>Tên liệt sĩ</th>
                <th>Vị trí mộ</th>
                <th>Hình ảnh</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredGraves.length > 0 ? (
                filteredGraves.map((grave) => (
                  <tr key={grave.code} className="gv-table-row">
                    <td>{grave.martyrCode || "N/A"}</td>
                    <td>{grave.name || "N/A"}</td>
                    <td>{grave.areaDescription || "N/A"}</td>
                    <td>
                      <img
                        src={grave.graveImage}
                        alt={grave.name}
                        className="gv-grave-image"
                      />
                    </td>
                    <td>
                      <Link to={`/chitietmoquanly/${grave.martyrId}`}>
                        <button className="gv-detail-button">Chi tiết</button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="gv-no-data">
                    Không tìm thấy kết quả phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="gv-pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`gv-page-button ${currentPage === page ? "gv-page-active" : ""}`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
