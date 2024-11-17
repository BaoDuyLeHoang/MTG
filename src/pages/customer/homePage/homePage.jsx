import React from "react";
import Slider from "../../../components/imageSlider/imageSlider";
import image1 from "../../../assets/images/image1.png";
import image2 from "../../../assets/images/image2.png";
import image3 from "../../../assets/images/image3.png";
import Header from "../../../components/Header/header";
import "./homePage.css";
import CustomerFeedbackCard from "../../../components/CustomerFeedbackCard/CustomerFeedbackCard";
import { MapPin } from 'lucide-react';

const HomePage = () => {
  const images = [image1, image2, image3];

  const mapSections = [
    { id: 1, color: '#8B5CF6', name: 'Khu 1', position: { top: '20%', left: '25%' } },
    { id: 2, color: '#EF4444', name: 'Khu 2', position: { top: '20%', left: '50%' } },
    { id: 3, color: '#10B981', name: 'Khu 3', position: { top: '40%', right: '8%' } },
    { id: 4, color: '#F59E0B', name: 'Khu 4', position: { bottom: '30%', left: '15%' } },
    { id: 5, color: '#3B82F6', name: 'Khu 5', position: { bottom: '25%', left: '38%' } },
    { id: 6, color: '#EC4899', name: 'Khu 6', position: { bottom: '40%', right: '23%' } },
  ];

  return (
    <div className="home-page">
      <Header />
      <Slider images={images} />

      {/* Introduction Section */}
      <section className="home-section home-introduction-section">
        <div className="home-container">
          <h1 className="home-section-title">
            Giới thiệu về nghĩa trang liệt sỹ An Nhien
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
          <h1 className="section-title">Bản đồ nghĩa trang An Nhiên</h1>
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

      {/* Customer Reviews Section */}
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
      </section>
    </div>
  );
};

export default HomePage;
