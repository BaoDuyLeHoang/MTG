import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header/header';
import Footer from '../../../components/Footer/footer';
import { getAllBlogs, getBlogCategories, getBlogCategoryById } from '../../../APIcontroller/API';
import './BlogView.css';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../../components/Loading/Loading';

const BlogView = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 4;
  const [categories, setCategories] = useState([]);
  const [categoryPage, setCategoryPage] = useState(1);
  const [categoryTotalPages, setCategoryTotalPages] = useState(1);
  const categoryPageSize = 4;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await getAllBlogs(currentPage, pageSize);
        console.log('API Response:', response);

        if (response && response.data) {
          setBlogs(response.data);
          setTotalPages(response.totalPage);
        } else {
          setBlogs([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getBlogCategories(categoryPage, categoryPageSize);
        if (response && response.data) {
          console.log("Categories data:", response.data);
          setCategories(response.data);
          setCategoryTotalPages(response.totalPage);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, [categoryPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCategoryPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= categoryTotalPages) {
      setCategoryPage(newPage);
    }
  };

  const handleCategoryClick = async (id) => {
    try {
      console.log("Clicking category with ID:", id);
      if (!id) {
        console.error("Category ID is undefined");
        return;
      }
      const categoryDetail = await getBlogCategoryById(id);
      setSelectedCategory(categoryDetail);
      navigate(`/blog-category/${id}`);
    } catch (error) {
      console.error("Error fetching category details:", error);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="blog-view__pagination">
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="blog-view__pagination-button"
        >
          Trước
        </button>
        
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`blog-view__pagination-button ${
                  currentPage === pageNumber ? 'active' : ''
                }`}
              >
                {pageNumber}
              </button>
            );
          } else if (
            pageNumber === currentPage - 2 ||
            pageNumber === currentPage + 2
          ) {
            return <span key={pageNumber}>...</span>;
          }
          return null;
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="blog-view__pagination-button"
        >
          Sau
        </button>
      </div>
    );
  };

  const renderCategoryPagination = () => {
    if (categoryTotalPages <= 1) return null;

    return (
      <div className="blog-view__pagination">
        <button 
          onClick={() => handleCategoryPageChange(categoryPage - 1)}
          disabled={categoryPage === 1}
          className="blog-view__pagination-button"
        >
          Trước
        </button>
        
        {[...Array(categoryTotalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handleCategoryPageChange(index + 1)}
            className={`blog-view__pagination-button ${
              categoryPage === index + 1 ? 'active' : ''
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handleCategoryPageChange(categoryPage + 1)}
          disabled={categoryPage === categoryTotalPages}
          className="blog-view__pagination-button"
        >
          Sau
        </button>
      </div>
    );
  };

  const renderBlogsList = () => {
    if (loading) {
      return <Loading fullScreen={false} text="Đang tải bài viết..." />;
    }

    if (!blogs || blogs.length === 0) {
      return <div>Không có bài viết nào</div>;
    }

    const defaultImage = "https://firebasestorage.googleapis.com/v0/b/mtg-capstone-2024.appspot.com/o/blog_images%2Fthap%20nen%20tri%20an.jpg?alt=media&token=c02f0d74-ba81-4937-b6df-d9021f4f5eb8";

    return (
      <>
        <div className="blog-view__posts-list">
          {blogs.map(blog => (
            <div key={blog.blogId} className="blog-view__post-card">
              <Link to={`/blog/${blog.blogId}`} className="blog-view__post-link">
                <div className="blog-view__post-image-container">
                  {blog.historicalImages && blog.historicalImages.length > 0 ? (
                    <img
                      src={blog.historicalImages[0]}
                      alt={blog.blogName}
                      className="blog-view__post-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                      }}
                    />
                  ) : (
                    <img
                      src={defaultImage}
                      alt="Default"
                      className="blog-view__post-image"
                    />
                  )}
                </div>
                <div className="blog-view__post-content">
                  <h3 className="blog-view__post-title">
                    {blog.blogName}
                  </h3>
                  <p className="blog-view__post-excerpt">
                    {blog.blogContent ? `${blog.blogContent.substring(0, 100)}...` : ''}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        {renderPagination()}
      </>
    );
  };

  return (
    <>
      <Header />
      <div className="blog-view__container">
        <div className="blog-view__hero-container">
          {/* Welcome Section */}
          <div className="blog-view__welcome-section">
            <h2 className="blog-view__heading">Chào mừng</h2>
            <div className="blog-view__profile-card">
              <div className="blog-view__profile-header">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/mtg-capstone-2024.appspot.com/o/blog_images%2FHinh-nen-Quoc-Ky-VN-9.jpg?alt=media&token=d29557a9-a47d-47d4-a390-e605b764dce7"
                  alt="Hồ sơ"
                  className="blog-view__profile-image"
                />
                <div className="blog-view__profile-stats">
                  <div className="blog-view__stat">
                    <span className="blog-view__stat-number">150+</span>
                    <span className="blog-view__stat-label">Bài viết</span>
                  </div>
                  <div className="blog-view__stat">
                    <span className="blog-view__stat-number">10k+</span>
                    <span className="blog-view__stat-label">Độc giả</span>
                  </div>
                </div>
              </div>
              <p className="blog-view__welcome-text">
                Xin chào và chào mừng quý khách đến với Trang Bài Viết của Nghĩa trang
                Liệt sĩ! <br /> Đây là nơi chúng tôi chia sẻ những thông tin,
                câu chuyện về công tác quản lý, bảo tồn và tri ân các anh hùng
                liệt sĩ – những người đã hy sinh vì độc lập và tự do của Tổ
                quốc. Với mục tiêu kết nối cộng đồng, giữ
                gìn và phát huy những giá trị lịch sử thiêng liêng của dân tộc.
                Thông qua những bài viết chân thực và các hình ảnh quý giá,
                chúng tôi hy vọng sẽ giúp mọi người hiểu hơn về sự hy sinh cao
                cả của thế hệ đi trước. Hãy đồng hành cùng chúng tôi trong hành
                trình bảo vệ và gìn giữ những di sản thiêng liêng của dân tộc
                Việt Nam.
              </p>
            </div>


          </div>

          {/* Latest Article Section */}
          <div className="blog-view__latest-article">
            <div className="blog-view__article-card">
              <div className="blog-view__article-image-wrapper">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/mtg-capstone-2024.appspot.com/o/blog_images%2F-3456-1699802636_1200x0.jpg?alt=media&token=acdfd928-1fd1-4921-b510-d31bbde74811"
                  alt="Latest article"
                  className="blog-view__article-image"
                />
                <div className="blog-view__article-overlay">
                  <span className="blog-view__article-category">Tin Tức</span>
                </div>
              </div>
              <div className="blog-view__article-content">
                <div className="blog-view__article-metadata">
                  <span>QuanLk</span>
                  <span>9 Tháng 10</span>
                </div>
                <span className="blog-view__article-tag">
                  Lịch Sử
                </span>
                <h3 className="blog-view__article-title">
                  Trở về quá khứ Điện Biên hào hùng
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Categories Section */}
        <div className="blog-view__categories">
          <div className="blog-view__categories-container">
            <div className="blog-view__categories-grid">
              {/* Category 1 */}
              <div className="blog-view__category">
                <div className="blog-view__category-header">
                  <h2 className="blog-view__category-title">
                    Bài viết lịch sử
                  </h2>

                </div>
                {renderBlogsList()}
              </div>
              {/* Category 2 */}
              <div className="blog-view__category">
                <div className="blog-view__category-header">
                  <h2 className="blog-view__category-title">
                    Chủ đề cần biết
                  </h2>
                </div>
                <div className="blog-view__category-list">
                  {categories.length > 0 ? (
                    <>
                      {categories.map(category => (
                        <div 
                          key={category.historyId}
                          className="blog-view__category-item"
                          onClick={() => handleCategoryClick(category.historyId)}
                        >
                          <h3 className="blog-view__category-name">
                            {category.blogCategoryName}
                          </h3>
                          <p className="blog-view__category-description">
                            {category.description 
                              ? `${category.description.substring(0, 100)}...` 
                              : 'Không có mô tả'}
                          </p>
                        </div>
                      ))}
                      {renderCategoryPagination()}
                    </>
                  ) : (
                    <div>Không có chủ đề nào</div>
                  )}
                </div>
              </div>

            
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogView;
