import React, { useState, useEffect } from 'react';
import LivestreamViewer from '../../components/LivestreamViewer/LivestreamViewer';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/footer';
import './Livestream.css';

// Dữ liệu mẫu cho livestreams
const MOCK_LIVESTREAMS = [
  {
    id: 1,
    title: "Lễ Tưởng Niệm Anh Hùng Liệt Sĩ",
    description: "Chương trình tưởng niệm và tri ân các anh hùng liệt sĩ",
    thumbnailUrl: "https://example.com/thumbnail1.jpg",
    scheduledTime: new Date().toISOString(),
    viewerCount: 150,
    isLive: true
  },
  {
    id: 2,
    title: "Nghi Lễ Dâng Hương Tại Nghĩa Trang",
    description: "Buổi lễ dâng hương tưởng nhớ các anh hùng",
    thumbnailUrl: "https://example.com/thumbnail2.jpg",
    scheduledTime: new Date().toISOString(),
    viewerCount: 89,
    isLive: false
  },
];

const Livestream = () => {
  const [livestreams, setLivestreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStream, setSelectedStream] = useState(null);

  useEffect(() => {
    const fetchLivestreams = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLivestreams(MOCK_LIVESTREAMS);
        setTotalPages(1);
      } catch (err) {
        setError('Không thể tải danh sách phát sóng');
        console.error('Error fetching livestreams:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLivestreams();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="livestream-page">
      <Header />
      <div className="livestream-content">
        {/* Main Livestream Viewer - Chỉ hiển thị một lần */}
        <section className="main-livestream-section">
          <h2>Phát sóng trực tiếp hiện tại</h2>
          <div className="main-livestream-container">
            <LivestreamViewer />
          </div>
        </section>

        {/* Danh sách các livestream khác */}
        <section className="other-livestreams-section">
          <h2>Các buổi phát sóng trước đây</h2>
          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <>
              <div className="livestream-grid">
                {livestreams.map((stream) => (
                  <div 
                    key={stream.id} 
                    className="livestream-card"
                    onClick={() => setSelectedStream(stream)}
                  >
                    <div className="livestream-thumbnail">
                      <img 
                        src={stream.thumbnailUrl} 
                        alt={stream.title}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Livestream';
                        }}
                      />
                      {stream.isLive && <span className="live-badge">LIVE</span>}
                    </div>
                    <div className="livestream-info">
                      <h3>{stream.title}</h3>
                      <p>{stream.description}</p>
                      <div className="stream-details">
                        <span>{new Date(stream.scheduledTime).toLocaleString()}</span>
                        <span>{stream.viewerCount} người xem</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </button>
                  <span>{currentPage}/{totalPages}</span>
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Livestream;
