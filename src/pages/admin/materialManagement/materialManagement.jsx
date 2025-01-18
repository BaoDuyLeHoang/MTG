import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar/sideBar";

import "./materialManagement.css";
import {
  getMaterial,
  updateStatusMaterial,
  updateMaterial,
  createMaterial,
} from "../../../services/admin";
import {
  ToggleLeft,
  ToggleRight,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const MaterialManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [materialData, setMaterialData] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState("all");
  const [editRowId, setEditRowId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    materialName: "",
    description: "",
    price: "",
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số item trên mỗi trang

  useEffect(() => {
    fetchMaterialData();
  }, []);

  const fetchMaterialData = async () => {
    try {
      const data = await getMaterial();
      console.log(data);
      setMaterialData(data);
    } catch (error) {
      console.error("Error fetching material data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage({
        type: "success",
        text: "Cập nhật thông tin thành công!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    }
  };

  const handleAction = async (id, currentStatus) => {
    try {
      await updateStatusMaterial(id);
      // Refresh the staff list after successful update
      fetchMaterialData();
    } catch (error) {
      console.error("Error updating status:", error);
      // You might want to add some error handling UI here
    }
  };

  const handleEditClick = (material) => {
    setEditRowId(material.materialId);
    setEditValues(material);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues({ ...editValues, [name]: value });
  };

  const handleSave = async (id) => {
    try {
      await updateMaterial(id, {
        materialName: editValues.materialName,
        description: editValues.description,
        price: editValues.price,
      });

      // Refresh the material list after successful update
      await fetchMaterialData();

      // Reset edit mode
      setEditRowId(null);
      setEditValues({});

      // Optional: Show success message
      setMessage({
        type: "success",
        text: "Cập nhật thông tin thành công!",
      });
    } catch (error) {
      console.error("Error updating material:", error);
      // Show error message
      setMessage({
        type: "error",
        text: "Có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    }
  };

  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    try {
      await createMaterial(newMaterial);
      await fetchMaterialData(); // Refresh the list
      setShowCreateForm(false); // Đóng form sau khi tạo thành công
      setNewMaterial({
        // Reset form
        materialName: "",
        description: "",
        price: "",
      });
      setMessage({
        type: "success",
        text: "Tạo vật liệu mới thành công!",
      });
    } catch (error) {
      console.error("Error creating material:", error);
      setMessage({
        type: "error",
        text: "Có lỗi xảy ra. Vui lòng thử lại sau.",
      });
      // Không đóng form nếu có lỗi
    }
  };

  const handleNewMaterialChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Thêm useEffect để xử lý message timeout
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000); // 5000ms = 5s

      // Cleanup function để clear timeout nếu component unmount
      return () => clearTimeout(timer);
    }
  }, [message.text]); // Chạy effect khi message.text thay đổi

  // Thêm hàm filter
  const filteredMaterials = materialData.filter((material) => {
    const matchesSearch =
      material.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? material.status
        : !material.status;

    return matchesSearch && matchesStatus;
  });

  // Thêm logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMaterials.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Thêm hàm format giá
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(price)
      .replace("₫", "đ");
  };

  return (
    <div className="material-management-container">
      <Sidebar />
      <div className="material-management-content">
        <div className="header-actions">
          <h1>Quản Lý Vật Liệu</h1>
          <button
            className="create-material-button"
            onClick={() => setShowCreateForm(true)}
          >
            Tạo Vật Liệu Mới
          </button>
        </div>

        <div className="search-filter-container">
          <div className="search-box">          
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Có sẵn</option>
            <option value="inactive">Không có sẵn</option>
          </select>
        </div>

        {showCreateForm && (
          <div className="create-form-overlay">
            <div className="create-form">
              <div className="create-form-header">
                <h2>Tạo Vật Liệu Mới</h2>
                <button
                  className="close-button"
                  onClick={() => setShowCreateForm(false)}
                >
                  ×
                </button>
              </div>

              {message.text && (
                <div className={`message ${message.type}`}>
                  {message.type === "success" ? "✓" : "⚠"} {message.text}
                </div>
              )}

              <form onSubmit={handleCreateMaterial}>
                <div className="form-group">
                  <label>Tên Vật Liệu:</label>
                  <input
                    type="text"
                    name="materialName"
                    value={newMaterial.materialName}
                    onChange={handleNewMaterialChange}
                    required
                    placeholder="Nhập tên vật liệu"
                  />
                </div>
                <div className="form-group">
                  <label>Mô Tả:</label>
                  <input
                    type="text"
                    name="description"
                    value={newMaterial.description}
                    onChange={handleNewMaterialChange}
                    required
                    placeholder="Nhập mô tả"
                  />
                </div>
                <div className="form-group">
                  <label>Giá:</label>
                  <input
                    type="number"
                    name="price"
                    value={newMaterial.price}
                    onChange={handleNewMaterialChange}
                    required
                    placeholder="Nhập giá (VD: 100000)"
                  />
                  {newMaterial.price && (
                    <div className="price-preview">
                      {formatPrice(newMaterial.price)}
                    </div>
                  )}
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    Tạo Vật Liệu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.type === "success" ? "✓" : "⚠"} {message.text}
          </div>
        )}

        {loading ? (
          <div className="centered">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="material-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên Vật Liệu</th>
                  <th>Mô Tả</th>
                  <th>Giá</th>
                  <th>Tình Trạng</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((material) => (
                  <tr key={material.materialId}>
                    <td>#{material.materialId}</td>
                    <td>
                      {editRowId === material.materialId ? (
                        <input
                          type="text"
                          name="materialName"
                          value={editValues.materialName}
                          onChange={handleInputChange}
                        />
                      ) : (
                        material.materialName
                      )}
                    </td>
                    <td>
                      {editRowId === material.materialId ? (
                        <input
                          type="text"
                          name="description"
                          value={editValues.description}
                          onChange={handleInputChange}
                        />
                      ) : (
                        material.description
                      )}
                    </td>
                    <td>
                      {editRowId === material.materialId ? (
                        <input
                          type="number"
                          name="price"
                          value={editValues.price}
                          onChange={handleInputChange}
                        />
                      ) : (
                        formatPrice(material.price)
                      )}
                    </td>
                    <td>
                      <span
                        className={`status ${
                          material.status ? "status-green" : "status-red"
                        }`}
                      >
                        {material.status ? "Có sẵn" : "Không có sẵn"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="icon-button"
                          onClick={() =>
                            handleAction(material.materialId, material.status)
                          }
                          title={material.status ? "Vô hiệu hóa" : "Kích hoạt"}
                        >
                          {material.status ? (
                            <ToggleRight className="toggle-active" size={28} />
                          ) : (
                            <ToggleLeft className="toggle-inactive" size={28} />
                          )}
                        </button>
                        {editRowId === material.materialId ? (
                          <button
                            type="submit"
                            className="save-edit-material-button"
                            onClick={() => handleSave(material.materialId)}
                          >
                            Lưu
                          </button>
                        ) : (
                          <button
                            className="edit-material-button"
                            onClick={() => handleEditClick(material)}
                          >
                            Chỉnh sửa
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                <ChevronLeft size={20} />
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`pagination-button ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialManagement;
