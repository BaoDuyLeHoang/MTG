import React from 'react';
import Header from '../../components/Header/header';
import './graveDetailPage.css';
import graveDetail from '../../assets/images/graveDetail.png';

const GraveDetailPage = () => {
  // Sample data - replace with actual data fetching logic
  const graveDetails = {
    image: graveDetail,
    name: 'Nguyễn Văn A',
    nickname: 'Anh Hai',
    position: 'Chủ tịch Hội đồng quản trị',
    birthDate: '1950-01-01',
    deathDate: '2020-12-31',
    hometown: 'Hà Nội',
    medals: 'Huân chương Lao động hạng Nhất',
    graveLocation: 'Khu A, Lô B, Số 123',
  };

  const calculateAge = (birthDate, deathDate) => {
    const birth = new Date(birthDate);
    const death = new Date(deathDate);
    const age = death.getFullYear() - birth.getFullYear();
    return age;
  };

  return (
    <div className="grave-detail-page">
   
      <div className="grave-detail-container">
        <div className="grave-info">
          <img src={graveDetails.image} alt={graveDetails.name} className="grave-image" />
          <div className="grave-details">
            <h1>{graveDetails.name}</h1>
            <div className="grave-details-content">
              <div className='detail-info1'> 
                <p><strong>Bí danh:</strong> {graveDetails.nickname}</p>
                <p><strong>Chức vụ:</strong> {graveDetails.position}</p>
                <p><strong>Ngày sinh:</strong> {graveDetails.birthDate}</p>
                <p><strong>Ngày mất:</strong> {graveDetails.deathDate}</p>
              </div>
              <div className='detail-info2'>
                <p><strong>Quê quán:</strong> {graveDetails.hometown}</p>
                <p><strong>Huân chương:</strong> {graveDetails.medals}</p>
                <p><strong>Vị trí mộ:</strong> {graveDetails.graveLocation}</p>
                <p><strong>Hưởng thọ:</strong> {calculateAge(graveDetails.birthDate, graveDetails.deathDate)} tuổi</p>
              </div>
            </div>
          </div>
        </div>
        <div className="services-section">
          <h2>Dịch vụ chúng tôi có</h2>
          <button className="order-service-btn">Đặt dịch vụ</button>
        </div>
      </div>
    </div>
  );
};

export default GraveDetailPage;
