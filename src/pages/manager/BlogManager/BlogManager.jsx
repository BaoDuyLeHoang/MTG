import React, { useState, useEffect } from 'react';
import { Calendar, Eye, Check, X } from 'lucide-react';
import './BlogManager.css';
import Sidebar from '../../../components/Sidebar/sideBar';
import { getAllBlogsManager } from '../../../services/blog';
import AlertMessage from '../../../components/AlertMessage/AlertMessage';

const BlogApprovalDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const [filters, setFilters] = useState({
    search: '',
    department: 'all',
    status: 'all'
  });

  // Fetch blogs when component mounts
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getAllBlogsManager();
      // Transform the API response to match your table structure
      const transformedPosts = response.map(blog => ({
        id: blog.blogId,
        title: blog.blogName,
        author: blog.fullName || 'Unknown Author',
        department: blog.historyEventName || 'Unknown Event',
        status: blog.status ? 'approved' : 'pending',
        createdAt: new Date(blog.createDate).toLocaleDateString('vi-VN'),
        updatedAt: new Date(blog.updateDate).toLocaleDateString('vi-VN'),
        summary: blog.blogDescription
      }));
      setPosts(transformedPosts);
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

  const handleApprove = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, status: 'approved' } : post
    ));
  };

  const handleReject = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, status: 'rejected' } : post
    ));
  };

  const getStatusBadge = (status) => {
    const statusText = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối'
    };

    return (
      <span className={`blog-manager-status-badge blog-manager-status-${status}`}>
        {statusText[status]}
      </span>
    );
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
                        <button className="blog-manager-button">
                          <Eye size={16} />
                          Xem
                        </button>
                        {post.status === 'pending' && (
                          <>
                            <button className="blog-manager-button blog-manager-button-approve">
                              <Check size={16} />
                              Duyệt
                            </button>
                            <button className="blog-manager-button blog-manager-button-reject">
                              <X size={16} />
                              Từ chối
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogApprovalDashboard;