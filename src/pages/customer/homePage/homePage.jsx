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
              Nghĩa trang liệt sĩ TP.HCM là một địa điểm linh thiêng, nơi an
              nghỉ vĩnh hằng của những anh hùng đã hiến dâng cuộc đời mình cho
              sự nghiệp đấu tranh giành độc lập, tự do và thống nhất Tổ quốc.
              Đây là biểu tượng cao quý của lòng yêu nước, sự hy sinh cao cả và
              tinh thần bất khuất của dân tộc Việt Nam. Du khách đến viếng thăm
              không chỉ để dâng hương tưởng niệm, mà còn để thể hiện lòng tri ân
              sâu sắc đối với những người chiến sĩ đã ngã xuống vì nền hòa bình
              và độc lập dân tộc. Nghĩa trang liệt sĩ TP.HCM là biểu tượng trường tồn
              của lòng biết ơn và sự kính trọng đối với những người anh hùng đã
              viết nên trang sử vàng chói lọi của đất nước.
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
                      <div className="service-image">
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
    </div>
  );
};

export default HomePage;
