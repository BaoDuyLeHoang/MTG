import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMartyrsByArea } from '../../../APIcontroller/API';
import Loading from '../../../components/Loading/Loading';
import Header from '../../../components/Header/header';
import './martyrList.css';
import Footer from "../../../components/Footer/footer";


const MartyrList = () => {
  const navigate = useNavigate();
  const { area } = useParams();
  const [martyrs, setMartyrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const fetchMartyrs = async () => {
      try {
        setLoading(true);
        const areaId = area.replace('M', '');
        const response = await getMartyrsByArea(areaId, currentPage, pageSize);
        setMartyrs(response.martyrGraves || []);
        setTotalPages(response.totalPage || 1);
      } catch (error) {
        console.error('Error fetching martyrs:', error);
        setMartyrs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMartyrs();
  }, [area, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleGraveClick = (martyrId) => {
    navigate(`/chitietmo/${martyrId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Không có thông tin';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Không có thông tin';
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return <Loading text="Đang tải danh sách liệt sĩ..." />;
  }

  return (
    <div className="martyr-list-page">
      <Header />
      <div className="martyr-list-container">
        <h1 className="martyr-list-title">Danh sách liệt sĩ khu {area}</h1>
        
        <div className="martyr-grid">
          {martyrs && martyrs.length > 0 ? (
            martyrs.map((martyr) => (
              <div 
                key={martyr.martyrId} 
                className="martyr-card"
                onClick={() => handleGraveClick(martyr.martyrId)}
                style={{ cursor: 'pointer' }}
              >
                <div className="martyr-info">
                  <h3 className="martyr-name">
                    {martyr.matyrGraveInformations?.[0]?.name || 'Không có tên'}
                  </h3>
                  <p><strong>Vị trí:</strong> {martyr.locationDescription || 'Không có thông tin'}</p>
                  <p><strong>Bí danh:</strong> {martyr.matyrGraveInformations?.[0]?.nickName || 'Không có thông tin'}</p>
                  <p><strong>Chức vụ:</strong> {martyr.matyrGraveInformations?.[0]?.position || 'Không có thông tin'}</p>
                  <p><strong>Huân chương:</strong> {martyr.matyrGraveInformations?.[0]?.medal || 'Kh��ng có thông tin'}</p>
                  <p><strong>Quê quán:</strong> {martyr.matyrGraveInformations?.[0]?.homeTown || 'Không có thông tin'}</p>
                  <p><strong>Ngày sinh:</strong> {formatDate(martyr.matyrGraveInformations?.[0]?.dateOfBirth)}</p>
                  <p><strong>Ngày hy sinh:</strong> {formatDate(martyr.matyrGraveInformations?.[0]?.dateOfSacrifice)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data-message">
              Không có dữ liệu liệt sĩ cho khu vực này
            </div>
          )}
        </div>

        {martyrs && martyrs.length > 0 && (
          <div className="pagination">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-button"
            >
              Trước
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="page-button"
            >
              Sau
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MartyrList; 