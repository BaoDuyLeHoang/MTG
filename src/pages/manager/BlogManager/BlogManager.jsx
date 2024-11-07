import React, { useState } from 'react';
import { Calendar, Eye, Check, X } from 'lucide-react';
import './BlogManager.css';
import Sidebar from '../../../components/Sidebar/sideBar';
import image from '../../../assets/images/image2.png';
const BlogApprovalDashboard = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Kỹ thuật Bảo tồn Di tích Lịch sử",
      author: "Nguyễn Văn A",
      department: "Phòng Bảo tồn",
      status: "pending",
      createdAt: "02/11/2024",
      summary: "Hướng dẫn toàn diện về bảo tồn di tích lịch sử..."
    },
    {
      id: 2,
      title: "Phương pháp Lưu trữ Số hóa",
      author: "Trần Thị B",
      department: "Phòng Tài liệu",
      status: "pending",
      createdAt: "03/11/2024",
      summary: "Cách tiếp cận hiện đại trong việc lưu trữ di tích..."
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    department: 'all',
    status: 'all'
  });

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
      <div className="blog-manager-dashboard">
        <div className="blog-manager-header">
          <h1 className="blog-manager-title">Quản lý Bài viết Chờ duyệt</h1>
        </div>

        <div className="blog-manager-filters">
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề hoặc tác giả..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="blog-manager-search"
          />
          
          <select
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            className="blog-manager-select"
          >
            <option value="all">Tất cả phòng ban</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="blog-manager-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>

        <div className="blog-manager-table-container">
          <table>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Tác giả</th>
                <th>Phòng ban</th>
                <th>Ngày tạo</th>
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
                  <td>{getStatusBadge(post.status)}</td>
                  <td>
                    <div className="blog-manager-button-group">
                      <button 
                        className="blog-manager-button"
                        onClick={() => alert(`Xem chi tiết: ${post.title}`)}
                      >
                        <Eye size={16} />
                        Xem
                      </button>
                      {post.status === 'pending' && (
                        <>
                          <button 
                            className="blog-manager-button blog-manager-button-approve"
                            onClick={() => handleApprove(post.id)}
                          >
                            <Check size={16} />
                            Duyệt
                          </button>
                          <button 
                            className="blog-manager-button blog-manager-button-reject"
                            onClick={() => handleReject(post.id)}
                          >
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
        </div>
      </div>
    </div>
  );
};

export default BlogApprovalDashboard;