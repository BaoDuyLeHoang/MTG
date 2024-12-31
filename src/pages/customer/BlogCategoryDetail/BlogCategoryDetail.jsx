import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogCategoryById } from '../../../APIcontroller/API';
import Header from '../../../components/Header/header';
import './BlogCategoryDetail.css';
import Footer from '../../../components/Footer/footer';
import Loading from '../../../components/Loading/Loading';

const BlogCategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const DEFAULT_IMAGE = "https://firebasestorage.googleapis.com/v0/b/mtg-capstone-2024.appspot.com/o/blog_images%2F20-17148874476072022457880.webp?alt=media&token=ae8f4862-6c99-4909-a1f4-62d408d6d7b7";

  useEffect(() => {
    const fetchCategoryDetail = async () => {
      try {
        const data = await getBlogCategoryById(id);
        setCategory(data);
      } catch (error) {
        console.error("Error fetching category detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetail();
  }, [id]);

  if (loading) return (
    <Loading fullScreen={false} text="Đang tải dữ liệu..." />
  );
  
  if (!category) return (
    <div className="error-container">
      <h2>Không tìm thấy chủ đề</h2>
      <p>Vui lòng thử lại sau</p>
    </div>
  );

  return (
    <>
      <Header />
      <div className="blog-category-detail">
        <button className="back-button" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
          <span>Quay lại</span>
        </button>
        <div className="category-banner">
          <img 
            src={DEFAULT_IMAGE} 
            alt="Category Banner" 
            className="banner-image"
          />
        </div>
        <div className="category-header">
          <h1>{category.blogCategoryName}</h1>
          <div className="category-meta">
            <span className="date">Ngày tạo: {new Date(category.createdDate).toLocaleDateString('vi-VN')}</span>
            <span className="date">Cập nhật: {new Date(category.updatedDate).toLocaleDateString('vi-VN')}</span>
          </div>
          <p className="description">{category.description}</p>
        </div>
        
        <div className="blogs-list">
          <h2>Các bài viết trong chủ đề</h2>
          <div className="blogs-grid">
            {category.blogs?.map(blog => (
              <div key={blog.blogId} className="blog-item">
                <div className="blog-content">
                  <h3>{blog.blogName}</h3>
                  <div className="blog-meta">
                    <div className="author">
                      <i className="fas fa-user"></i>
                      <span>{blog.fullName}</span>
                    </div>
                    <div className="date">
                      <i className="fas fa-calendar"></i>
                      <span>{new Date(blog.createDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
                <button 
                  className="read-more"
                  onClick={() => navigate(`/blog/${blog.blogId}`)}
                >
                  Đọc thêm
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogCategoryDetail; 