import React from 'react';
import LivestreamViewer from '../../components/LivestreamViewer/LivestreamViewer';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/footer';
import './Livestream.css';

const Livestream = () => {
  return (
    <div className="livestream-page">
      <Header />
      <div className="livestream-content">
        <section className="main-livestream-section">
          <h2>Phát sóng trực tiếp ngày lễ</h2>
          <div className="livestream-description">
            <p>Kênh phát sóng trực tiếp các sự kiện và ngày lễ được tổ chức tại đây.</p>
            <p className="event-note">Xem trực tiếp các nghi lễ, lễ kỷ niệm và sự kiện đặc biệt.</p>
          </div>
          <div className="main-livestream-container">
            <LivestreamViewer />
          </div>
          <div className="livestream-info">
            <div className="upcoming-events">
              <h3>Các ngày lễ quan trọng như:</h3>
              <ul>
                <li>Ngày Thương binh Liệt sĩ 27/7</li>
                <li>Ngày Quốc khánh 2/9</li>
                <li>Các ngày lễ quan trọng khác</li>
              </ul>
            </div>
            <div className="livestream-notes">
              <h3>Hướng dẫn xem</h3>
              <ul>
                <li>Vui lòng đảm bảo kết nối internet ổn định</li>
                <li>Có thể xem lại video sau khi buổi lễ kết thúc</li>
                <li>Điều chỉnh âm thanh và chất lượng video phù hợp</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Livestream;
