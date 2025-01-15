import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchResult.css';
import Header from '../../../components/Header/header';
import Footer from '../../../components/Footer/footer';
import Loading from '../../../components/Loading/Loading';
import { searchGraves } from '../../../APIcontroller/API';

const SearchResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15; // Đồng bộ với pageSize từ API
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState(null);

  const DEFAULT_IMAGE = "/Hinh-nen-co-Viet-Nam-hinh-nen-Quoc-ky-Viet-Nam-dep-cho-dien-thoai-3D.jpg";

  useEffect(() => {
    if (location.state) {
      const { results, totalPages, currentPage, searchCriteria } = location.state;
      setResults(results);
      setTotalPages(totalPages);
      setCurrentPage(currentPage);
      setSearchParams(searchCriteria);
      setLoading(false);
    }
  }, [location.state]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="search-result__container">
          <Loading fullScreen={false} text="Đang tải kết quả tìm kiếm..." />
        </div>
        <Footer />
      </>
    );
  }

  if (!results || results.length === 0) {
    return (
      <>
        <Header />
        <div className="search-result__container">
          <h1 className="search-result__heading">Không tìm thấy kết quả</h1>
        </div>
        <Footer />
      </>
    );
  }

  const handlePageChange = async (page) => {
    setLoading(true);
    try {
      const response = await searchGraves({
        ...searchParams,
        page: page,
        pageSize: itemsPerPage
      });

      if (response.martyrGraves) {
        setResults(response.martyrGraves);
        setCurrentPage(page);
        setTotalPages(response.totalPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Error fetching page data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        className={`search-result__page-button ${currentPage === 1 ? 'search-result__page-button--disabled' : ''}`}
        disabled={currentPage === 1}
      >
        ‹
      </button>
    );

    // First page
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="search-result__page-button"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className="search-result__page-ellipsis">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`search-result__page-button ${currentPage === i ? 'search-result__page-button--active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis2" className="search-result__page-ellipsis">...</span>);
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="search-result__page-button"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        className={`search-result__page-button ${currentPage === totalPages ? 'search-result__page-button--disabled' : ''}`}
        disabled={currentPage === totalPages}
      >
        ›
      </button>
    );

    return buttons;
  };

  const handleCardClick = (martyrId) => {
    console.log("Clicking grave with ID:", martyrId);
    
    try {
      if (martyrId) {
        navigate(`/chitietmo/${martyrId}`);
      } else {
        console.error("Invalid martyrId:", martyrId);
      }
    } catch (error) {
      console.error("Error navigating to detail:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="search-result__container">
        <h1 className="search-result__heading">Kết Quả Tìm Kiếm</h1>
        
        <div className="search-result__grid" style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '20px'
        }}>
          {results.map((grave) => (
            <div
              key={grave.martyrId}
              className={`search-result__card ${hoveredCard === grave.martyrId ? 'search-result__card--hover' : ''}`}
              onMouseEnter={() => setHoveredCard(grave.martyrId)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleCardClick(grave.martyrId)}
              style={{ cursor: 'pointer' }}
            >
              <div className="search-result__image-container">
                <img
                  src={grave.imageUrls?.[0]?.image || DEFAULT_IMAGE}
                  alt={`Grave of ${grave.name}`}
                  className="search-result__image"
                />
              </div>
              
              <div className="search-result__content">
                <h2 className="search-result__name">{grave.name}</h2>
                
                <div className="search-result__info-grid">
                  <div className="search-result__info-item">
                    <span>Năm sinh: {grave.dateOfBirth}</span>
                  </div>
                  <div className="search-result__info-item">
                    <span>Năm mất: {grave.dateOfSacrifice}</span>
                  </div>
                  <div className="search-result__info-item">
                    <span>Quê quán: {grave.homeTown}</span>
                  </div>
                  <div className="search-result__info-item">
                    <span>Vị trí: {grave.martyrCode}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="search-result__pagination">
          {renderPaginationButtons()}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchResult;
