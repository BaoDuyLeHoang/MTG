import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../../../components/Header/header';
import { getBlogById, postComment, postCommentIcon, updateComment, updateCommentIcon, deleteCommentIcon, deleteComment } from '../../../APIcontroller/API';
import './BlogDetail.css';

const BlogDetail = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndices, setCurrentImageIndices] = useState({});
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reactions, setReactions] = useState({
    likes: 0,
    dislikes: 0
  });
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');

  // Lấy thông tin user và token
  const accessToken = localStorage.getItem('accessToken');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  // Log để debug
  useEffect(() => {
    console.log('Access token:', accessToken);
    console.log('User string from localStorage:', userStr);
    console.log('Parsed user:', user);
  }, []);

  useEffect(() => {
    if (blog?.relatedMartyrDetails) {
      const initialIndices = {};
      blog.relatedMartyrDetails.forEach(martyr => {
        initialIndices[martyr.martyrGraveId] = 0;
      });
      setCurrentImageIndices(initialIndices);
    }
  }, [blog]);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        const response = await getBlogById(blogId);
        if (response && response.data) {
          setBlog(response.data);
        }
      } catch (error) {
        console.error('Error fetching blog detail:', error);
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlogDetail();
    }
  }, [blogId]);

  const handlePrevImage = (e, martyrId, images) => {
    e.preventDefault();
    setCurrentImageIndices(prev => ({
      ...prev,
      [martyrId]: prev[martyrId] === 0 ? images.length - 1 : prev[martyrId] - 1
    }));
  };

  const handleNextImage = (e, martyrId, images) => {
    e.preventDefault();
    setCurrentImageIndices(prev => ({
      ...prev,
      [martyrId]: prev[martyrId] === images.length - 1 ? 0 : prev[martyrId] + 1
    }));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!accessToken) {
      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      navigate('/login', { state: { from: `/blog/${blogId}` } });
      return;
    }

    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await postComment(blogId, newComment);
      const response = await getBlogById(blogId);
      if (response && response.data) {
        setBlog(response.data);
      }
      setNewComment('');
    } catch (error) {
      if (error.response?.status === 403) {
        alert('Bạn không có quyền thực hiện hành động này.');
      } else if (error.response?.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login', { state: { from: `/blog/${blogId}` } });
      } else {
        console.error('Error posting comment:', error);
        alert('Không thể đăng bình luận. Vui lòng thử lại sau.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReaction = (type) => {
    if (!user) {
      alert('Vui lòng đăng nhập để thích');
      navigate('/login', { state: { from: `/blog/${blogId}` } });
      return;
    }

    setReactions(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.commentId);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      await updateComment(commentId, editContent);
      // Refresh blog data to get updated comments
      const response = await getBlogById(blogId);
      if (response && response.data) {
        setBlog(response.data);
      }
      setEditingCommentId(null);
      setEditContent('');
    } catch (error) {
      if (error.response?.status === 403) {
        alert('Bạn không có quyền chỉnh sửa bình luận này.');
      } else if (error.response?.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login', { state: { from: `/blog/${blogId}` } });
      } else {
        console.error('Error updating comment:', error);
        alert('Không thể cập nhật bình luận. Vui lòng thử lại sau.');
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      return;
    }

    try {
      await deleteComment(commentId);
      // Refresh data sau khi xóa thành công
      const response = await getBlogById(blogId);
      if (response && response.data) {
        setBlog(response.data);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        alert('Bạn không có quyền xóa bình luận này.');
      } else if (error.response?.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login', { state: { from: `/blog/${blogId}` } });
      } else {
        console.error('Error deleting comment:', error);
        alert('Không thể xóa bình luận. Vui lòng thử lại sau.');
      }
    }
  };

  const renderRelatedMartyrs = () => {
    if (!blog.relatedMartyrDetails || blog.relatedMartyrDetails.length === 0) {
      return null;
    }

    return (
      <div className="blog-detail__related-martyrs">
        <h2 className="blog-detail__related-title">Các anh hùng liên quan:</h2>
        <div className="blog-detail__martyrs-grid">
          {blog.relatedMartyrDetails.map((martyr, index) => (
            <Link 
              to={`/chitietmo/${martyr.martyrGraveId}`} 
              key={martyr.martyrGraveId || index} 
              className="blog-detail__martyr-link"
            >
              <div className="blog-detail__martyr-card">
                <h3 className="blog-detail__martyr-name">{martyr.name}</h3>
                <div className="blog-detail__martyr-image-slider">
                  {martyr.images && martyr.images.map((image, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={image}
                      alt={`${martyr.name} - Ảnh ${imgIndex + 1}`}
                      className={`blog-detail__martyr-image ${
                        imgIndex === currentImageIndices[martyr.martyrGraveId] ? 'active' : ''
                      }`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-martyr-image.jpg';
                      }}
                    />
                  ))}
                  {martyr.images && martyr.images.length > 1 && (
                    <>
                      <button 
                        className="blog-detail__slider-button blog-detail__slider-button--prev"
                        onClick={(e) => handlePrevImage(e, martyr.martyrGraveId, martyr.images)}
                      >
                        ‹
                      </button>
                      <button 
                        className="blog-detail__slider-button blog-detail__slider-button--next"
                        onClick={(e) => handleNextImage(e, martyr.martyrGraveId, martyr.images)}
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  const renderComments = () => {
    if (!blog.comments || blog.comments.length === 0) {
      return <p className="blog-detail__no-comments">Chưa có bình luận nào</p>;
    }

    // Lấy currentAccountId từ token
    const accessToken = localStorage.getItem('accessToken');
    const decodedToken = accessToken ? JSON.parse(atob(accessToken.split('.')[1])) : null;
    const currentAccountId = decodedToken?.accountId;

    // Lọc bỏ các comment trùng lặp
    const uniqueComments = blog.comments.reduce((acc, current) => {
      const x = acc.find(item => item.commentId === current.commentId);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    return (
      <div className="blog-detail__comments-section">
        <h2 className="blog-detail__comments-title">Bình luận</h2>
        <div className="blog-detail__comments-list">
          {uniqueComments.map((comment) => {
            const isEditing = editingCommentId === comment.commentId;
            const isOwnComment = currentAccountId && parseInt(currentAccountId) === comment.accountId;

            // Di chuyển handleIconClick vào trong map function
            const handleIconClick = async (commentId, iconId) => {
              if (!accessToken) {
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                navigate('/login', { state: { from: `/blog/${blogId}` } });
                return;
              }

              try {
                console.log('Comment Icons:', comment.commentIcons);
                const currentIcon = comment.commentIcons?.find(icon => icon.iconId === iconId);
                console.log('Found current icon:', currentIcon);

                if (currentIcon) {
                  console.log('Deleting icon with ID:', currentIcon.id);
                  await deleteCommentIcon(currentIcon.id);
                } else {
                  console.log('Creating new icon for comment:', commentId);
                  await postCommentIcon(commentId, iconId);
                }
                
                const response = await getBlogById(blogId);
                if (response && response.data) {
                  setBlog(response.data);
                }
              } catch (error) {
                console.error('Error handling icon:', error);
                if (error.response?.status === 403) {
                  alert('Bạn không có quyền thực hiện hành động này.');
                } else if (error.response?.status === 401) {
                  alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                  navigate('/login', { state: { from: `/blog/${blogId}` } });
                } else {
                  alert('Bạn không có quyền chỉnh sửa của người khác');
                }
              }
            };

            const hasLiked = comment.commentIcons?.some(icon => icon.iconId === 1);
            const hasDisliked = comment.commentIcons?.some(icon => icon.iconId === 2);

            return (
              <div key={comment.commentId} className="blog-detail__comment">
                <div className="blog-detail__comment-header">
                  <span className="blog-detail__comment-author">{comment.accountName}</span>
                  <div className="blog-detail__comment-actions-wrapper">
                    <span className="blog-detail__comment-date">
                      {new Date(comment.createdDate).toLocaleDateString('vi-VN')}
                    </span>
                    {isOwnComment && (
                      <div className="blog-detail__comment-buttons">
                        <button 
                          onClick={() => handleEditClick(comment)}
                          className="blog-detail__edit-button"
                        >
                          Chỉnh sửa
                        </button>
                        <button 
                          onClick={() => handleDeleteComment(comment.commentId)}
                          className="blog-detail__delete-button"
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="blog-detail__edit-form">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="blog-detail__edit-input"
                    />
                    <div className="blog-detail__edit-actions">
                      <button 
                        onClick={() => handleUpdateComment(comment.commentId)}
                        className="blog-detail__edit-save"
                      >
                        Lưu
                      </button>
                      <button 
                        onClick={handleCancelEdit}
                        className="blog-detail__edit-cancel"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="blog-detail__comment-content">{comment.content}</p>
                )}

                <div className="blog-detail__comment-reactions">
                  <button 
                    className={`blog-detail__icon-button ${hasLiked ? 'active' : ''}`}
                    onClick={() => handleIconClick(comment.commentId, 1)}
                  >
                    <img 
                      src="https://firebasestorage.googleapis.com/v0/b/mtg-capstone-2024.appspot.com/o/icons%2Flike.png?alt=media&token=13a2e940-5a3d-485c-80ef-cf9056f66b82" 
                      alt="Like"
                    />
                    <span>{comment.commentIcons?.filter(icon => icon.iconId === 1).length || 0}</span>
                  </button>

                  <button 
                    className={`blog-detail__icon-button ${hasDisliked ? 'active' : ''}`}
                    onClick={() => handleIconClick(comment.commentId, 2)}
                  >
                    <img 
                      src="https://firebasestorage.googleapis.com/v0/b/mtg-capstone-2024.appspot.com/o/icons%2Fdislike.png?alt=media&token=0b4ec610-2d7e-4855-ab24-356c951ad690" 
                      alt="Dislike"
                    />
                    <span>{comment.commentIcons?.filter(icon => icon.iconId === 2).length || 0}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCommentForm = () => {
    if (!accessToken) {
      return (
        <div className="blog-detail__login-prompt">
          <p>Vui lòng <Link 
            to="/login" 
            state={{ from: `/blog/${blogId}` }} 
            className="blog-detail__login-link"
          >
            đăng nhập
          </Link> để bình luận</p>
        </div>
      );
    }

    return (
      <form onSubmit={handleCommentSubmit} className="blog-detail__comment-form">

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Viết bình luận của bạn..."
          className="blog-detail__comment-input"
          disabled={submitting}
        />
        <button 
          type="submit" 
          className="blog-detail__comment-submit"
          disabled={submitting || !newComment.trim()}
        >
          {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
        </button>
      </form>
    );
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!blog) {
    return <div>Không tìm thấy bài viết</div>;
  }

  return (
    <>
      <Header />
      <div className="blog-detail__container">
        <button 
          className="blog-detail__back-button"
          onClick={() => navigate(-1)}
        >
          ← Quay lại
        </button>
        
        <article className="blog-detail__article">
          <header className="blog-detail__header">
            <h1 className="blog-detail__title">{blog.blogName}</h1>
            <div className="blog-detail__meta">
              <span className="blog-detail__author">Tác giả: {blog.fullName}</span>
              <span className="blog-detail__date">
                {new Date(blog.createDate).toLocaleDateString('vi-VN')}
              </span>
              <span className="blog-detail__category">{blog.blogCategoryName}</span>
            </div>
          </header>

          {blog.historicalImages && blog.historicalImages.length > 0 && (
            <div className="blog-detail__image-container">
              <img
                src={blog.historicalImages[0]}
                alt={blog.blogName}
                className="blog-detail__main-image"
              />
            </div>
          )}

          <div className="blog-detail__content">
            <p className="blog-detail__description">{blog.blogDescription}</p>
            <div className="blog-detail__body">
              {blog.blogContent}
            </div>
            {renderRelatedMartyrs()}
            {renderComments()}
            {renderCommentForm()}
          </div>
        </article>
      </div>
    </>
  );
};

export default BlogDetail;
