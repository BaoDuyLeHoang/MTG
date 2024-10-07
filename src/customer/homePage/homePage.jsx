import React from "react";
import Slider from "../../components/imageSlider/imageSlider";
import image1 from "../../assets/images/image1.png";
import image2 from "../../assets/images/image2.png";
import image3 from "../../assets/images/image3.png";
import Header from "../../components/Header/header";
import "./homePage.css";
import CustomerFeedbackCard from "../../components/CustomerFeedbackCard/CustomerFeedbackCard";
const homePage = () => {
  const images = [image1, image2, image3];
  return (
    <div>
      <Header />
      <Slider images={images} />
      <div className="home-page-overview-content">
        <h1>Giới thiệu về nghĩa trang liệt sỹ An Nhien</h1>
        <p>
          An Nhiên – Nghĩa trang Liệt sĩ là một địa điểm linh thiêng, nơi an
          nghỉ vĩnh hằng của những anh hùng đã hiến dâng cuộc đời mình cho sự
          nghiệp đấu tranh giành độc lập, tự do và thống nhất Tổ quốc. Đây là
          biểu tượng cao quý của lòng yêu nước, sự hy sinh cao cả và tinh thần
          bất khuất của dân tộc Việt Nam. Du khách đến viếng thăm không chỉ để
          dâng hương tưởng niệm, mà còn để thể hiện lòng tri ân sâu sắc đối với
          những người chiến sĩ đã ngã xuống vì nền hòa bình và độc lập dân tộc.
          Nghĩa trang An Nhiên là biểu tượng trường tồn của lòng biết ơn và sự
          kính trọng đối với những người anh hùng đã viết nên trang sử vàng chói
          lọi của đất nước.
        </p>
      </div>
      <div className="home-page-map-overview">
        <h1>Bản đồ nghĩa trang An Nhien</h1>
        <div className="home-page-map-image">
          <img src={image3} alt="map" />
        </div>
      </div>
      <div className="home-page-customer-review">
        <h1>Đánh giá của khách hàng</h1>
        <div className="home-page-customer-review-content">
          <div className="home-page-customer-review-item">
            {[...Array(5)].map((_, index) => (
              <CustomerFeedbackCard key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default homePage;
