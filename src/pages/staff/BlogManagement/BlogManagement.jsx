import React, { useState, useEffect } from 'react';
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
  faTag,
  faToggleOn,
  faToggleOff,
  faBan
} from '@fortawesome/free-solid-svg-icons';
import './BlogManagement.css';
import { getBlogByAccountId, getBlogById } from '../../../services/blog';
import { getBlogComment, updateCommentStatus } from '../../../services/task';
import { banAccountCustomer } from '../../../services/staff';
import { useAuth } from '../../../context/AuthContext';
const BlogManagement = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedBlogDetails, setSelectedBlogDetails] = useState(null);
  const [selectedBlogComments, setSelectedBlogComments] = useState([]);
  const [showBanConfirm, setShowBanConfirm] = useState(false);
  const [selectedAccountId, 
    setSelectedAccountId] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const accountId = user?.accountId;
        const response = await getBlogByAccountId(accountId);
        
        const transformedBlogs = response.data.map(blog => ({
          id: blog.blogId,
          title: blog.blogName,
          excerpt: blog.blogDescription,
          createdAt: blog.createDate,
          status: blog.status ? 'published' : 'hidden',
          author: blog.fullName,
          category: blog.historyEventName,
          image: blog.historicalImages?.[0] || null
        }));
        
        setBlogs(transformedBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

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

  const handleBlogCardClick = async (blog) => {
    try {
      const blogResponse = await getBlogById(blog.id);
      setSelectedBlog(blog);

      const commentsResponse = await getBlogComment(blog.id);
      console.log('Comments response:', commentsResponse);

      const transformed = commentsResponse?.data?.map(comment => ({
        id: comment.commentId,
        accountId: comment.accountId,
        accountName: comment.accountName,
        accountStatus: comment.accountStatus,
        accountAvatar: comment.accountAvatar,
        content: comment.content,
        createdDate: comment.createdDate,
        commentIcons: comment.commentIcons,
        status: comment.status,
      })) || [];

      console.log('Transformed comments:', transformed);
      setSelectedBlogComments(transformed);

    } catch (error) {
      console.error('Error fetching blog details:', error);
      setSelectedBlogComments([]);
      if (error.response?.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        alert('Không thể tải thông tin bài viết. Vui lòng thử lại sau.');
      }
    }
  };

  const handleClosePopup = () => {
    setSelectedBlog(null);
  };

  const handleToggleComment = async (commentId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await updateCommentStatus(commentId, newStatus);
      
      // Cập nhật state của comments
      setSelectedBlogComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId 
            ? { ...comment, status: newStatus }
            : comment
        )
      );
    } catch (error) {
      console.error('Error toggling comment status:', error);
      alert('Không thể thay đổi trạng thái bình luận. Vui lòng thử lại sau.');
    }
  };

  const handleBanAccount = async () => {
    try {
      await banAccountCustomer(selectedAccountId, user.accountId);
      alert('Đã chặn tài khoản thành công');
      setShowBanConfirm(false);
      
      // Refresh comments after banning
      if (selectedBlog) {
        const commentsResponse = await getBlogComment(selectedBlog.id);
        const transformed = commentsResponse?.data?.map(comment => ({
          id: comment.commentId,
          accountId: comment.accountId,
          accountName: comment.accountName,
          accountStatus: comment.accountStatus,
          accountAvatar: comment.accountAvatar,
          content: comment.content,
          createdDate: comment.createdDate,
          commentIcons: comment.commentIcons,
          status: comment.status,
        })) || [];
        
        setSelectedBlogComments(transformed);
      }
    } catch (error) {
      console.error('Error banning account:', error);
      alert('Không thể chặn tài khoản. Vui lòng thử lại sau.');
    }
  };

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
              <div 
                key={blog.id} 
                className="blog-mgmt-card"
                onClick={() => handleBlogCardClick(blog)}
              >
                {blog.image && (
                  <div className="blog-mgmt-card-image">
                    <img src={blog.image} alt={blog.title} />
                  </div>
                )}
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

      {selectedBlog && (
        <div className="blog-detail-popup-overlay" onClick={handleClosePopup}>
          <div className="blog-detail-popup" onClick={e => e.stopPropagation()}>
            <button className="blog-detail-close" onClick={handleClosePopup}>&times;</button>
            {selectedBlog.image && (
              <div className="blog-detail-image">
                <img src={selectedBlog.image} alt={selectedBlog.title} />
              </div>
            )}
            <h2>{selectedBlog.title}</h2>
            <div className="blog-detail-meta">
              <span><FontAwesomeIcon icon={faUser} /> {selectedBlog.author}</span>
              <span><FontAwesomeIcon icon={faTag} /> {selectedBlog.category}</span>
              <span><FontAwesomeIcon icon={faCalendarAlt} /> {new Date(selectedBlog.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
            <p className="blog-detail-content">{selectedBlog.excerpt}</p>
            <div className="blog-detail-status">
              <span className={`blog-mgmt-status-badge blog-mgmt-${selectedBlog.status}`}>
                {selectedBlog.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
              </span>
            </div>

            <div className="blog-detail-comments">
              <h3>Bình luận ({selectedBlogComments.length})</h3>
              {selectedBlogComments.length === 0 ? (
                <p>Chưa có bình luận nào</p>
              ) : (
                <div className="blog-detail-comments-list">
                  {selectedBlogComments.map(comment => (
                    <div key={comment.id} className="blog-detail-comment" 
                      style={{ opacity: comment.accountStatus ? 1 : 0.5 }}
                    >
                      <div className="blog-detail-comment-header">
                        <div className="blog-detail-comment-info">
                          <img 
                            src={comment.accountAvatar || '/default-avatar.png'} 
                            alt={`${comment.accountName}'s avatar`}
                            className="comment-avatar"
                          />
                          <span className="blog-detail-comment-author">{comment.accountName}</span>
                          <span className="blog-detail-comment-date">
                            {new Date(comment.createdDate).toLocaleDateString('vi-VN')}
                          </span>
                          {!comment.status && (
                            <span className="comment-hidden-status">
                              Đã ẩn bình luận
                            </span>
                          )}
                        </div>
                        <div className="comment-actions">
                          <button 
                            className="comment-toggle-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleComment(comment.id, comment.status);
                            }}
                            title={comment.status ? "Ẩn bình luận" : "Hiện bình luận"}
                          >
                            <FontAwesomeIcon 
                              icon={comment.status ? faToggleOn : faToggleOff} 
                              className={comment.status ? "comment-visible" : "comment-hidden"}
                            />
                          </button>
                          {!comment.status && (
                            <button 
                              className="ban-account-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAccountId(comment.accountId);
                                setShowBanConfirm(true);
                              }}
                              title="Chặn tài khoản"
                            >
                              <FontAwesomeIcon icon={faBan} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="blog-detail-comment-content">{comment.content}</p>
                      <div className="blog-detail-comment-reactions">
                        <span>
                          👍 {comment.commentIcons?.filter(icon => icon.iconId === 1).length || 0}
                        </span>
                        <span>
                          👎 {comment.commentIcons?.filter(icon => icon.iconId === 2).length || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showBanConfirm && (
        <div className="ban-confirm-overlay">
          <div className="ban-confirm-popup">
            <h3>Xác nhận chặn tài khoản</h3>
            <p>Bạn có chắc chắn muốn chặn tài khoản này không?</p>
            <div className="ban-confirm-actions">
              <button onClick={handleBanAccount}>Xác nhận</button>
              <button onClick={() => setShowBanConfirm(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;

// Here's the CSS file that should be saved as BlogManagement.css

