import React, { useState, useEffect } from 'react';
import { Calendar, Eye, Check, X } from 'lucide-react';
import './BlogManager.css';
import Sidebar from '../../../components/Sidebar/sideBar';
import AlertMessage from '../../../components/AlertMessage/AlertMessage';
import { getAllBlogsManager, updateBlogStatus } from '../../../services/blog'; // Import the updateBlogStatus function
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

const BlogApprovalDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const { user } = useAuth();

  const [filters, setFilters] = useState({
    search: '',
    department: 'all',
    status: 'all'
  });

  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  const pageSize = 5; // Set the number of items per page

  // Fetch blogs when component mounts or currentPage changes
  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getAllBlogsManager(user.accountId, currentPage, pageSize); // Pass currentPage and pageSize
      // Transform the API response to match your table structure
      const transformedPosts = response.blogs.map(blog => ({
        id: blog.blogId,
        title: blog.blogName,
        author: blog.fullName || 'Unknown Author',
        department: blog.blogCategoryName || 'Unknown Event',
        status: blog.status ? 'approved' : 'pending',
        createdAt: new Date(blog.createDate).toLocaleDateString('vi-VN'),
        updatedAt: new Date(blog.updateDate).toLocaleDateString('vi-VN'),
        summary: blog.blogDescription
      }));
      setPosts(transformedPosts);
      setTotalPages(response.totalPage); // Set total pages from response
    } catch (error) {
      setAlertSeverity('error');
      setAlertMessage(error.message || 'Có lỗi xảy ra khi tải danh sách bài viết');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  // Function to update blog status
  const handleUpdateStatus = async (postId, currentStatus) => {
    const newStatus = !currentStatus; // Toggle the status
    try {
      await updateBlogStatus(postId, newStatus); // Call the updateBlogStatus function
      // Update the local state
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, status: newStatus ? 'approved' : 'pending' } : post
      ));
      setAlertSeverity('success');
      setAlertMessage('Trạng thái bài viết đã được cập nhật thành công.');
      setAlertOpen(true);
    } catch (error) {
      setAlertSeverity('error');
      setAlertMessage(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái bài viết');
      setAlertOpen(true);
    }
  };

  // Get unique departments for filter dropdown
  const departments = [...new Set(posts.map(post => post.department))];

  // Filter posts based on current filters
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      post.author.toLowerCase().includes(filters.search.toLowerCase());
    const matchesDepartment = filters.department === 'all' || post.department === filters.department;
    const matchesStatus = filters.status === 'all' || post.status === filters.status;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Pagination controls
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <AlertMessage
        open={alertOpen}
        handleClose={handleAlertClose}
        severity={alertSeverity}
        message={alertMessage}
      />
      <div className="blog-manager-dashboard">
        <div className="blog-manager-header">
          <h1 className="blog-manager-title">Quản lý Bài viết</h1>
        </div>

        <div className="blog-manager-filters">
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề hoặc tác giả..."
            className="blog-manager-search"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            className="blog-manager-select"
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          >
            <option value="all">Tất cả sự kiện</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            className="blog-manager-select"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
          </select>
        </div>

        <div className="blog-manager-table-container">
          {loading ? (
            <div className="blog-manager-loading">Đang tải dữ liệu...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="blog-manager-no-data">Không có bài viết nào</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Tác giả</th>
                  <th>Sự kiện</th>
                  <th>Ngày tạo</th>
                  <th>Cập nhật</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.title}</td>
                    <td>{post.author}</td>
                    <td>{post.department}</td>
                    <td>
                      <div className="blog-manager-date-cell">
                        <Calendar size={16} />
                        {post.createdAt}
                      </div>
                    </td>
                    <td>
                      <div className="blog-manager-date-cell">
                        <Calendar size={16} />
                        {post.updatedAt}
                      </div>
                    </td>
                    <td>
                      <span className={`blog-manager-status-badge blog-manager-status-${post.status}`}>
                        {post.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                      </span>
                    </td>
                    <td>
                      <div className="blog-manager-button-group">
                        <Link to={`/blog-detail-manager/${post.id}`} className="blog-manager-button">
                          <Eye size={16} />
                          Xem
                        </Link>
                        <button className="blog-manager-button" onClick={() => handleUpdateStatus(post.id, post.status === 'approved')}>
                          {post.status === 'approved' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="blog-manager-pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogApprovalDashboard;