import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sideBar";
import "../graveView/GraveView.css";
import { Link } from "react-router-dom";
import { getAllGraves } from "../../APIcontroller/API";

export default function GraveView() {
  const [graves, setGraves] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
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

  if (loading) {
    return (
      <div className="grave-view">
        <Sidebar />
        <aside className="grave-view-list">
          <div>Loading...</div>
        </aside>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grave-view">
        <Sidebar />
        <aside className="grave-view-list">
          <div>Error: {error}</div>
        </aside>
      </div>
    );
  }

  return (
    <div className="grave-view">
      <Sidebar />
      <aside className="grave-view-list">
        <h1>Danh sách mộ</h1>
        <div className="search-fillers">
          <input
            type="search"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/them-mo">
            <button type="button">Thêm mộ</button>
          </Link>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Mã mộ</th>
                <th>Tên liệt sĩ</th>
                <th>Vị trí mộ</th>
                <th>Hình ảnh</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {graves.length > 0 ? (
                graves.map((grave) => (
                  <tr key={grave.martyrId}>
                    <td>{grave.martyrCode || "N/A"}</td>
                    <td>{grave.name?.[0] || "N/A"}</td>
                    <td>{`Khu ${grave.areaId || "N/A"}`}</td>
                    <td>
                      <img
                        src={grave.image}
                        alt={grave.name?.[0]}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>
                      <Link to={`/chitietmo/${grave.martyrId}`}>
                        <button className="detail-button">Chi tiết</button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={currentPage === 1 ? "disabled" : ""}
          >
            &lt;
          </button>
          <span>{`Trang ${currentPage} / ${totalPages}`}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={currentPage === totalPages ? "disabled" : ""}
          >
            &gt;
          </button>
        </div>
      </aside>
    </div>
  );
}
