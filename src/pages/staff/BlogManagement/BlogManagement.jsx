import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/sideBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faEyeSlash,
  faEye,
  faPlus, 
  faSearch,
  faFilter,
  faCalendarAlt,
  faUser,
  faTag
} from '@fortawesome/free-solid-svg-icons';
import './BlogManagement.css';

const BlogManagement = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: 'Lịch Sử Nghĩa Trang An Nhiên',
      excerpt: 'Khám phá lịch sử phong phú của nghĩa trang...',
      createdAt: '2024-03-15',
      status: 'published',
      author: 'Nguyễn Văn A',
      category: 'Lịch sử'
    },
    {
      id: 2,
      title: 'Hướng Dẫn Bảo Trì Vườn Tưởng Niệm',
      excerpt: 'Các phương pháp tốt nhất để duy trì không gian thiêng liêng...',
      createdAt: '2024-03-20',
      status: 'draft',
      author: 'Trần Thị B',
      category: 'Bảo trì'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleCreateBlog = () => {
    navigate('/blog-create');
  };

  const handleEditBlog = (blogId) => {
    console.log('Edit blog:', blogId);
  };

  const handleToggleVisibility = (blogId) => {
    setBlogs(blogs.map(blog => {
      if (blog.id === blogId) {
        const newStatus = blog.status === 'hidden' ? 'published' : 'hidden';
        return { ...blog, status: newStatus };
      }
      return blog;
    }));
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="blog-mgmt-layout">
      <Sidebar />
      <div className="blog-mgmt-main-content">
        <h1 className="staff-task-list-page-title">Quản Lý Bài Viết</h1>
        <div className="blog-mgmt-container">
          <div className="blog-mgmt-controls">
            <button className="blog-mgmt-create-button" onClick={handleCreateBlog}>
              <FontAwesomeIcon icon={faPlus} />
              <span>Tạo Bài Viết Mới</span>
            </button>
            <div className="blog-mgmt-search">
              <FontAwesomeIcon icon={faSearch} className="blog-mgmt-search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề hoặc nội dung..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="blog-mgmt-filter">
              <FontAwesomeIcon icon={faFilter} className="blog-mgmt-filter-icon" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
                <option value="hidden">Đã ẩn</option>
              </select>
            </div>
          </div>

          <div className="blog-mgmt-list">
            {filteredBlogs.map(blog => (
              <div key={blog.id} className="blog-mgmt-card">
                <div className="blog-mgmt-card-header">
                  <h2>{blog.title}</h2>
                  <div className="blog-mgmt-actions">
                    <button 
                      className="blog-mgmt-action-button blog-mgmt-edit"
                      onClick={() => handleEditBlog(blog.id)}
                      title="Chỉnh sửa bài viết"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button 
                      className={`blog-mgmt-action-button blog-mgmt-visibility ${
                        blog.status === 'hidden' ? 'blog-mgmt-show' : 'blog-mgmt-hide'
                      }`}
                      onClick={() => handleToggleVisibility(blog.id)}
                      title={blog.status === 'hidden' ? 'Hiện bài viết' : 'Ẩn bài viết'}
                    >
                      <FontAwesomeIcon icon={blog.status === 'hidden' ? faEye : faEyeSlash} />
                    </button>
                  </div>
                </div>
                <div className="blog-mgmt-meta">
                  <span className="blog-mgmt-meta-item">
                    <FontAwesomeIcon icon={faUser} />
                    {blog.author}
                  </span>
                  <span className="blog-mgmt-meta-item">
                    <FontAwesomeIcon icon={faTag} />
                    {blog.category}
                  </span>
                  <span className="blog-mgmt-meta-item">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <p className="blog-mgmt-excerpt">{blog.excerpt}</p>
                <span className={`blog-mgmt-status-badge blog-mgmt-${blog.status}`}>
                  {blog.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;

// Here's the CSS file that should be saved as BlogManagement.css

