import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sideBar";
import "../graveView/GraveView.css";
import { Link } from "react-router-dom";
import { getAllGraves } from "../../APIcontroller/API";

export default function GraveView() {
  const [graves, setGraves] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
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
      const response = await getAllGraves(currentPage, pageSize);
      console.log("API Response:", response); // Debug log
      
      if (response && response.graveList && Array.isArray(response.graveList)) {
        console.log("Graves List:", response.graveList); // Log graves list
        console.log("Total Pages:", response.totalPage); // Log total pages
        
        setGraves(response.graveList);
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
      (grave.name?.[0] && grave.name[0].toLowerCase().includes(searchLower)) ||
      (grave.areaId && grave.areaId.toString().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="gv-container">
        <Sidebar />
        <div className="gv-content">
          <div className="gv-loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gv-container">
        <Sidebar />
        <div className="gv-content">
          <div className="gv-error">Error: {error}</div>
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
          <Link to="/them-mo">
            <button type="button" className="gv-add-button">Thêm mộ</button>
          </Link>
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
                  <tr key={grave.martyrId} className="gv-table-row">
                    <td>{grave.martyrCode || "N/A"}</td>
                    <td>{grave.name?.[0] || "N/A"}</td>
                    <td>{`Khu ${grave.areaId || "N/A"}`}</td>
                    <td>
                      <img
                        src={grave.image}
                        alt={grave.name?.[0]}
                        className="gv-grave-image"
                      />
                    </td>
                    <td>
                      <Link to={`/chitietmo/${grave.martyrId}`}>
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
