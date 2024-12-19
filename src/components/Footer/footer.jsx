import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook, 
  faYoutube, 
  faInstagram 
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section about-section">
          <h3>Nghĩa trang Liệt sĩ TP.HCM</h3>
          <p>
            Nơi tri ân và tưởng nhớ các anh hùng liệt sĩ đã hy sinh vì độc lập, 
            tự do của Tổ quốc. Chúng tôi cam kết mang đến dịch vụ chăm sóc mộ 
            phần chu đáo và tận tâm nhất để chuyến viếng thăm được trở nên ý nghĩa hơn.
          </p>
        </div>
        
        <div className="footer-section">
          <h3>Thông tin liên hệ</h3>
          <ul className="contact-info">
            <li>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <div>
                <span>Địa chỉ:</span>
                Xa lộ Hà Nội, khu phố Giãn Dân, phường Long Bình, thành phố Thủ Đức, TP. HCM
              </div>
            </li>
            <li>
              <FontAwesomeIcon icon={faPhone} />
              <div>
                <span>Hotline:</span>
                (028) 3855 2323
              </div>
            </li>
            <li>
              <FontAwesomeIcon icon={faEnvelope} />
              <div>
                <span>Email:</span>
                contact@nghiatranglietsihcm.vn
              </div>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Chức năng nổi bật</h3>
          <ul className="services-list-footer">
            <li><Link to="/dichvu">Dịch vụ chăm sóc mộ</Link></li>
            <li><Link to="/tim-kiem-mo">Tìm kiếm mộ</Link></li>
            <li><Link to="/livestream">Thăm viếng trực tuyến</Link></li>
            <li><Link to="/blog-view">Tin tức & Sự kiện</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Bản đồ</h3>
          <div className="map-container-footer">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.1882626354904!2d106.81105014847336!3d10.873281166057783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a964f9cb8d%3A0xbaa4ab98fd658b19!2zTmdoxKlhIHRyYW5nIExp4buHdCBzxKkgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5o!5e0!3m2!1svi!2sus!4v1734275140973!5m2!1svi!2sus"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>
          
          Bản quyền © {new Date().getFullYear()}. Đồ án tốt nghiệp sinh viên trường Đại học FPT TP.HCM.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
