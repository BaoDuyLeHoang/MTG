import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchGraveInterface.css";
import Header from "../Header/header";
import { searchGraves } from "../../APIcontroller/API";
import AlertMessage from "../AlertMessage/AlertMessage";

const SearchGraveInterface = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    name: "",
    yearOfBirth: "",
    yearOfSacrifice: "",
    homeTown: "",
    martyrCode: "",
    page: 1,
    pageSize: 15
  });
  const [alertOpen, setAlertOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Kiểm tra có ít nhất một trường được nhập
    const hasValue = Object.entries(searchParams).some(([key, value]) => 
      !['page', 'pageSize'].includes(key) && value.length > 0
    );
    
    if (!hasValue) {
      setAlertOpen(true);
      return;
    }

    try {
      const response = await searchGraves(searchParams);
      
      if (!response.martyrGraves || response.martyrGraves.length === 0) {
        setAlertOpen(true);
      } else {
        navigate("/search-results", { 
          state: { 
            results: response.martyrGraves,
            totalPages: response.totalPage,
            currentPage: searchParams.page,
            searchCriteria: searchParams
          } 
        });
      }
    } catch (error) {
      console.error("Error searching graves:", error);
      setAlertOpen(true);
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <div>
      <div>
        <Header />
        <AlertMessage
          open={alertOpen}
          handleClose={handleAlertClose}
          severity={Object.entries(searchParams).some(([key, value]) => 
            !['page', 'pageSize'].includes(key) && value.length > 0
          ) ? "info" : "warning"}
          message={Object.entries(searchParams).some(([key, value]) => 
            !['page', 'pageSize'].includes(key) && value.length > 0
          ) ? "Không tìm thấy kết quả phù hợp" : "Vui lòng nhập ít nhất một thông tin tìm kiếm"}
        />
      </div>
      <div className="search-grave-interface-container">
        <div className="search-container">
          <h1 className="title">TÌM KIẾM MỘ</h1>
          <form className="search-form" onSubmit={handleSearch} autoComplete="off">
            <div className="main-search">
              <input
                type="text"
                name="name"
                className="search-grave-input"
                placeholder="Họ và Tên người mất"
                value={searchParams.name}
                onChange={handleInputChange}
                maxLength={100}
              />
            </div>
            <div className="filter-inputs">
              <input
                type="text"
                name="martyrCode"
                className="filter-input"
                placeholder="Mã mộ"
                value={searchParams.martyrCode}
                onChange={handleInputChange}
                maxLength={50}
              />
              <input
                type="number"
                name="yearOfBirth"
                className="filter-input"
                placeholder="Năm sinh"
                value={searchParams.yearOfBirth}
                onChange={handleInputChange}
                max={new Date().getFullYear()}
              />
              <input
                type="number"
                name="yearOfSacrifice"
                className="filter-input"
                placeholder="Năm mất"
                value={searchParams.yearOfSacrifice}
                onChange={handleInputChange}
                max={new Date().getFullYear()}
              />
              <input
                type="text"
                name="homeTown"
                className="filter-input"
                placeholder="Quê quán"
                value={searchParams.homeTown}
                onChange={handleInputChange}
                maxLength={200}
              />
            </div>
            <button type="submit" className="search-button">TÌM KIẾM</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchGraveInterface;
