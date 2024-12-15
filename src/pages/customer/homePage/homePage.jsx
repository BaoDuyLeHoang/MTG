import React, { useState, useEffect } from "react";
import Slider from "../../../components/imageSlider/imageSlider";
import image1 from "../../../assets/images/image1.jpg";
import image2 from "../../../assets/images/image2.jpeg";
import image3 from "../../../assets/images/image3.jpg";
import Header from "../../../components/Header/header";
import "./homePage.css";
import { getTrendingServices } from "../../../APIcontroller/API";
import { formatCurrency } from '../../../components/Format/formatCurrency';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../../components/Loading/Loading';
import Footer from "../../../components/Footer/footer";

const HomePage = () => {
  const images = [image1, image2, image3];

  const [trendingServices, setTrendingServices] = useState([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [showAreaPopup, setShowAreaPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingServices = async () => {
      setIsLoadingTrending(true);
      try {
        const data = await getTrendingServices(5);
        setTrendingServices(data);
      } catch (error) {
        console.error('Error fetching trending services:', error);
      } finally {
        setIsLoadingTrending(false);
      }
    };

    fetchTrendingServices();
  }, []);

  const scrollTrendingServices = (direction) => {
    const container = document.querySelector('.trending-grid');
    const scrollAmount = 300;
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleAreaClick = (area) => {
    navigate(`/danh-sach-liet-si/M${area}`);
    setShowAreaPopup(false);
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setShowAreaPopup(false);
      }
    };

    if (showAreaPopup) {
      document.addEventListener('keydown', handleEscKey);
    }

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showAreaPopup]);

  return (
    <div className="home-page">
      <Header />
      <Slider images={images} />

      {/* Introduction Section */}
      <section className="home-section home-introduction-section">
        <div className="home-container">
          <h1 className="home-section-title">
            Giới thiệu về nghĩa trang liệt sĩ TP.HCM
          </h1>
          <div className="home-content-wrapper">
            <p className="home-introduction-text">
            Nghĩa trang liệt sĩ TP.HCM là một địa điểm linh thiêng và trang nghiêm, nơi an nghỉ 
            vĩnh hằng của những người anh hùng đã hiến dâng cả cuộc đời mình cho sự nghiệp bảo vệ 
            độc lập, tự do và thống nhất đất nước. Nằm giữa lòng thành phố mang tên Bác, nghĩa trang 
            không chỉ là nơi yên nghỉ của các liệt sĩ mà còn là biểu tượng cao quý của lòng yêu nước, 
            tinh thần bất khuất và sự hy sinh vô giá của dân tộc Việt Nam. Được xây dựng như một minh 
            chứng cho lòng tri ân sâu sắc của thế hệ hôm nay đối với những người đã ngã xuống, nơi đây 
            đồng thời mang ý nghĩa giáo dục truyền thống cách mạng cho thế hệ trẻ, giúp họ hiểu rõ hơn 
            giá trị của hòa bình và trách nhiệm đối với Tổ quốc. Vào những dịp lễ lớn như Ngày Thương 
            binh Liệt sĩ 27/7 hay Ngày Quốc khánh 2/9, hàng ngàn người dân khắp cả nước đến dâng hương tưởng 
            niệm, bày tỏ lòng biết ơn chân thành với những chiến sĩ đã hy sinh để đất nước được trường 
            tồn. Với không gian yên bình, từng hàng bia mộ ngay ngắn và khung cảnh xanh mát được chăm sóc 
            kỹ lưỡng, Nghĩa trang liệt sĩ TP.HCM không chỉ là nơi tưởng nhớ mà còn là biểu tượng trường 
            tồn của lòng biết ơn, sự kính trọng và tinh thần bất khuất của dân tộc Việt Nam.
            </p>
          </div>
        </div>
      </section>

      {/* Simplified Map Section */}
      <section className="home-section section map-section">
        <div className="container">
          <h1 className="section-title">
            <span>Bản đồ nghĩa trang liệt sĩ TP.HCM</span>
          </h1>
          <div className="map-container">
            <div className="map-wrapper">
              <img
                src='https://firebasestorage.googleapis.com/v0/b/mtg-capstone-2024.appspot.com/o/map%2Fmap.png?alt=media&token=6f290078-37a1-40bf-a472-6ac1b572b005'
                alt="Bản đồ nghĩa trang TP.HCM"
                className="map-image"
              />
            </div>
            <div className="map-controls">
              <button 
                className="select-area-btn"
                onClick={() => setShowAreaPopup(true)}
              >
                <span className="btn-icon">🗺️</span>
                <span className="btn-text">Chọn khu vực</span>
              </button>

              {showAreaPopup && (
                <div className="area-popup">
                  <div className="area-popup-content">
                    <button 
                      className="close-popup"
                      onClick={() => setShowAreaPopup(false)}
                      title="Đóng (ESC)"
                    >
                      ×
                    </button>
                    <h3>Danh sách khu vực</h3>
                    <div className="area-grid">
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          className="area-button"
                          onClick={() => handleAreaClick(num)}
                        >
                          M{num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section
      <section className="home-section section reviews-section">
        <div className="home-container">
          <h1 className="section-title">Đánh giá của khách hàng</h1>
          <div className="reviews-container">
            <div className="reviews-grid">
              {[...Array(3)].map((_, index) => (
                <div className="review-card-wrapper" key={index}>
                  <CustomerFeedbackCard />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Trending Services Section */}
      <section className="home-section section trending-section">
        <div className="home-container">
          <h1 className="trending-title">
            <span>Dịch vụ xu hướng</span>
          </h1>
          <div className="trending-container" style={{ position: 'relative', minHeight: '300px' }}>
            {isLoadingTrending ? (
              <Loading 
                text="Đang tải dịch vụ xu hướng..." 
                color="#4F46E5"
                size={56}
              />
            ) : (
              <>
                <button 
                  className="slide-nav-button prev-button" 
                  onClick={() => scrollTrendingServices('left')}
                >
                  ←
                </button>
                <button 
                  className="slide-nav-button next-button" 
                  onClick={() => scrollTrendingServices('right')}
                >
                  →
                </button>
                <div className="trending-grid">
                  {trendingServices.map((service) => (
                    <Link 
                      to={`/chitietdichvu/${service.serviceId}`} 
                      className="trending-service-card" 
                      key={service.serviceId}
                    >
                      <div className="trending-service-image">
                        <img src={service.imagePath} alt={service.serviceName} />
                      </div>
                      <div className="service-content">
                        <h3 className="service-title">{service.serviceName}</h3>
                        <div className="service-price">
                          {formatCurrency(service.price)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
