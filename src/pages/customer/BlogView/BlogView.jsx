import React from "react";
import "./BlogView.css";
import Header from "../../../components/Header/header";

const BlogView = () => {
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
                  src="https://th.bing.com/th/id/OIP.sWCvltMZF_s3mjA5sL-RdgHaE8?w=296&h=197&c=7&r=0&o=5&dpr=1.4&pid=1.7"
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
                Xin chào và chào mừng quý khách đến với Blog Quản lý Nghĩa trang
                Liệt sĩ! <br /> Đây là nơi chúng tôi chia sẻ những thông tin,
                câu chuyện về công tác quản lý, bảo tồn và tri ân các anh hùng
                liệt sĩ – những người đã hy sinh vì độc lập và tự do của Tổ
                quốc. Qua blog này, chúng tôi mong muốn kết nối cộng đồng, giữ
                gìn và phát huy những giá trị lịch sử thiêng liêng của dân tộc.
                Thông qua những bài viết chân thực và các hình ảnh quý giá,
                chúng tôi hy vọng sẽ giúp mọi người hiểu hơn về sự hy sinh cao
                cả của thế hệ đi trước. Hãy đồng hành cùng chúng tôi trong hành
                trình bảo vệ và gìn giữ những di sản thiêng liêng của dân tộc
                Việt Nam.
              </p>
            </div>

            {/* Updated search box */}
            <div className="blog-view__search-wrapper">
              <div className="blog-view__search-container">
                <i className="fas fa-search blog-view__search-icon"></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  className="blog-view__search-input"
                />
              </div>
            </div>
          </div>

          {/* Latest Article Section */}
          <div className="blog-view__latest-article">
            <div className="blog-view__article-card">
              <div className="blog-view__article-image-wrapper">
                <img
                  src="https://th.bing.com/th/id/OIP.sWCvltMZF_s3mjA5sL-RdgHaE8?w=296&h=197&c=7&r=0&o=5&dpr=1.4&pid=1.7"
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
                  Trở về qua khu điện biên phủ hảo hùng
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
                    Tin Tức & Sự Kiện
                  </h2>
                  <a href="#" className="blog-view__read-all">
                    + Xem Tất Cả
                  </a>
                </div>

                <div className="blog-view__posts-list">
                  <div className="blog-view__post-card">
                    <img
                      src="path-to-image-1"
                      alt="Lễ tưởng niệm"
                      className="blog-view__post-image"
                    />
                    <div className="blog-view__post-content">
                      <h3 className="blog-view__post-title">
                        Lễ Tưởng Niệm Các Anh Hùng Liệt Sĩ 2024
                      </h3>
                      <p className="blog-view__post-excerpt">
                        Thông tin về các hoạt động tưởng niệm sắp tới tại nghĩa
                        trang liệt sĩ...
                      </p>
                    </div>
                  </div>

                  <div className="blog-view__post-card">
                    <img
                      src="path-to-image-2"
                      alt="Hoạt động tri ân"
                      className="blog-view__post-image"
                    />
                    <div className="blog-view__post-content">
                      <h3 className="blog-view__post-title">
                        Chương Trình "Đền Ơn Đáp Nghĩa"
                      </h3>
                      <p className="blog-view__post-excerpt">
                        Các hoạt động tri ân và chăm sóc các gia đình liệt sĩ...
                      </p>
                    </div>
                  </div>
                  <div className="blog-view__post-card">
                    <img
                      src="path-to-image-2"
                      alt="Hoạt động tri ân"
                      className="blog-view__post-image"
                    />
                    <div className="blog-view__post-content">
                      <h3 className="blog-view__post-title">
                        Chương Trình "Đền Ơn Đáp Nghĩa"
                      </h3>
                      <p className="blog-view__post-excerpt">
                        Các hoạt động tri ân và chăm sóc các gia đình liệt sĩ...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Category 2 */}
              <div className="blog-view__category">
                <div className="blog-view__category-header">
                  <h2 className="blog-view__category-title">
                    Chính Sách & Quy Định
                  </h2>
                  <a href="#" className="blog-view__read-all">
                    + Xem Tất Cả
                  </a>
                </div>
              </div>

              {/* Category 3 */}
              <div className="blog-view__category">
                <div className="blog-view__category-header">
                  <h2 className="blog-view__category-title">
                    Bảo Tồn & Trùng Tu
                  </h2>
                  <a href="#" className="blog-view__read-all">
                    + Xem Tất Cả
                  </a>
                </div>
              </div>

              {/* Category 4 */}
              <div className="blog-view__category">
                <div className="blog-view__category-header">
                  <h2 className="blog-view__category-title">
                    Tìm Kiếm Thông Tin
                  </h2>
                  <a href="#" className="blog-view__read-all">
                    + Xem Tất Cả
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogView;
