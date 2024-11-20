import React, { useState, useEffect } from "react";
import Slider from "../../../components/imageSlider/imageSlider";
import image1 from "../../../assets/images/image1.png";
import image2 from "../../../assets/images/image2.png";
import image3 from "../../../assets/images/image3.png";
import Header from "../../../components/Header/header";
import "./homePage.css";
import CustomerFeedbackCard from "../../../components/CustomerFeedbackCard/CustomerFeedbackCard";
import { MapPin } from 'lucide-react';
import { getTrendingServices, getMartyrsByArea } from "../../../APIcontroller/API";
import { formatCurrency } from '../../../components/Format/formatCurrency';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const images = [image1, image2, image3];

  const [selectedArea, setSelectedArea] = useState(null);
  const [martyrs, setMartyrs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const mapSections = [
    { id: 11, color: '#8B5CF6', name: 'Khu 1', position: { top: '20%', left: '25%' } },
    { id: 12, color: '#EF4444', name: 'Khu 2', position: { top: '20%', left: '50%' } },
    { id: 13, color: '#10B981', name: 'Khu 3', position: { top: '40%', right: '8%' } },
    { id: 14, color: '#F59E0B', name: 'Khu 4', position: { bottom: '30%', left: '15%' } },
    { id: 15, color: '#3B82F6', name: 'Khu 5', position: { bottom: '25%', left: '38%' } },
    { id: 16, color: '#EC4899', name: 'Khu 6', position: { bottom: '40%', right: '23%' } },
  ];

  const [trendingServices, setTrendingServices] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingServices = async () => {
      try {
        const data = await getTrendingServices(5);
        setTrendingServices(data);
      } catch (error) {
        console.error('Error fetching trending services:', error);
      }
    };

    fetchTrendingServices();
  }, []);

  const scrollTrendingServices = (direction) => {
    const container = document.querySelector('.trending-grid');
    const scrollAmount = 300; // Adjust this value based on your card width
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const fetchMartyrs = async (areaId, page) => {
    try {
      const response = await getMartyrsByArea(areaId, page, pageSize);
      setMartyrs(response.martyrGraves);
      setTotalPages(response.totalPage);
    } catch (error) {
      console.error('Error fetching martyrs:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleAreaClick = async (areaId) => {
    setSelectedArea(areaId);
    setCurrentPage(1);
    await fetchMartyrs(areaId, 1);
  };

  const handlePageChange = async (page) => {
    setCurrentPage(page);
    await fetchMartyrs(selectedArea, page);
  };

  const handleMartyrClick = (martyrId) => {
    navigate(`/chitietmo/${martyrId}`);
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages) {
        handlePageChange(page);
      }
    };

    return (
      <div className="pagination">
        <button 
          onClick={() => goToPage(1)} 
          disabled={currentPage === 1}
          className="pagination-nav"
        >
          ≪
        </button>
        <button 
          onClick={() => goToPage(currentPage - 1)} 
          disabled={currentPage === 1}
          className="pagination-nav"
        >
          ‹
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          // Hiển thị 5 trang xung quanh trang hiện tại
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={currentPage === pageNumber ? 'active' : ''}
              >
                {pageNumber}
              </button>
            );
          } else if (
            pageNumber === currentPage - 3 ||
            pageNumber === currentPage + 3
          ) {
            return <span key={pageNumber}>...</span>;
          }
          return null;
        })}

        <button 
          onClick={() => goToPage(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="pagination-nav"
        >
          ›
        </button>
        <button 
          onClick={() => goToPage(totalPages)} 
          disabled={currentPage === totalPages}
          className="pagination-nav"
        >
          ≫
        </button>
      </div>
    );
  };

  // Thêm useEffect để handle Esc key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && selectedArea) {
        setSelectedArea(null);
      }
    };

    // Thêm event listener khi modal được mở
    if (selectedArea) {
      document.addEventListener('keydown', handleEscKey);
    }

    // Cleanup function để remove event listener
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [selectedArea]); // Dependency array chỉ chạy lại khi selectedArea thay đổi

  return (
    <div className="home-page">
      <Header />
      <Slider images={images} />

      {/* Introduction Section */}
      <section className="home-section home-introduction-section">
        <div className="home-container">
          <h1 className="home-section-title">
            Giới thiệu về nghĩa trang liệt sỹ An Nhiên
          </h1>
          <div className="home-content-wrapper">
            <p className="home-introduction-text">
              An Nhiên – Nghĩa trang Liệt sĩ là một địa điểm linh thiêng, nơi an
              nghỉ vĩnh hằng của những anh hùng đã hiến dâng cuộc đời mình cho
              sự nghiệp đấu tranh giành độc lập, tự do và thống nhất Tổ quốc.
              Đây là biểu tượng cao quý của lòng yêu nước, sự hy sinh cao cả và
              tinh thần bất khuất của dân tộc Việt Nam. Du khách đến viếng thăm
              không chỉ để dâng hương tưởng niệm, mà còn để thể hiện lòng tri ân
              sâu sắc đối với những người chiến sĩ đã ngã xuống vì nền hòa bình
              và độc lập dân tộc. Nghĩa trang An Nhiên là biểu tượng trường tồn
              của lòng biết ơn và sự kính trọng đối với những người anh hùng đã
              viết nên trang sử vàng chói lọi của đất nước.
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="home-section section map-section">
        <div className="container">
          <h1 className="section-title">
            <span>Bản đồ nghĩa trang An Nhiên</span>
          </h1>
          <div className="map-container">
            <div className="map-wrapper">
              <img
                src='https://saigonthienphuc.com/wp-content/uploads/2021/12/Layer-2.png'
                alt="Bản đồ nghĩa trang An Nhien"
                className="map-image"
              />
              {mapSections.map((section) => (
                <button
                  key={section.id}
                  className="map-section-button"
                  style={{
                    ...section.position,
                    backgroundColor: section.color,
                  }}
                  title={section.name}
                  onClick={() => handleAreaClick(section.id)}
                >
                  <MapPin size={24} color="white" />
                </button>
              ))}
            </div>
            <div className="map-overlay">
              <div className="map-info">
                <h3>Địa chỉ</h3>
                <p>123 Đường ABC, Quận XYZ, TP.HCM</p>
              </div>
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
          <h1 className="section-title">
            <span>Dịch vụ xu hướng</span>
          </h1>
          <div className="trending-container">
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
          </div>
        </div>
      </section>
      
      {/* Modal */}
      {selectedArea && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setSelectedArea(null)}>×</button>
            <h2>Danh sách liệt sĩ - {mapSections.find(s => s.id === selectedArea)?.name}</h2>
            
            <div className="martyrs-list">
              {martyrs.map((martyr) => (
                <div 
                  key={martyr.martyrId} 
                  className="martyr-card"
                  onClick={() => handleMartyrClick(martyr.martyrId)}
                >
                  <h3>{martyr.matyrGraveInformations[0]?.name}</h3>
                  <div className="martyr-info-grid">
                    <div className="info-item">
                      <span className="info-label">Mã</span>
                      <span className="info-value">{martyr.martyrCode}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Vị trí</span>
                      <span className="info-value">{martyr.locationDescription}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Chức vụ</span>
                      <span className="info-value">{martyr.matyrGraveInformations[0]?.position}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Quê quán</span>
                      <span className="info-value">{martyr.matyrGraveInformations[0]?.homeTown}</span>
                    </div>
                    <div className="medal-info">
                      <span className="info-label">Huân chương</span>
                      <span className="info-value">{martyr.matyrGraveInformations[0]?.medal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
