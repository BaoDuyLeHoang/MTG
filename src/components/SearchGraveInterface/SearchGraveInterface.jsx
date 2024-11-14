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
    birthYear: "",
    deathYear: "",
    hometown: "",
  });
  const [alertOpen, setAlertOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Trim whitespace and normalize input
    const normalizedValue = value;
    setSearchParams((prev) => ({ ...prev, [name]: normalizedValue }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Validate if at least one field has been filled
    const hasValue = Object.values(searchParams).some(value => value.length > 0);
    if (!hasValue) {
      setAlertOpen(true);
      return;
    }

    try {
      const results = await searchGraves(searchParams);
      if (results.length === 0) {
        setAlertOpen(true);
      } else {
        navigate("/search-results", { state: { results } });
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
          severity={Object.values(searchParams).some(value => value.length > 0) ? "info" : "warning"}
          message={Object.values(searchParams).some(value => value.length > 0) ? 
            "Không tìm thấy kết quả phù hợp" : 
            "Vui lòng nhập ít nhất một thông tin tìm kiếm"}
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
            <div className="filters">
              <input
                type="number"
                name="birthYear"
                className="filter-input-byear"
                placeholder="Năm sinh"
                value={searchParams.birthYear}
                onChange={handleInputChange}
              
                max={new Date().getFullYear()}
                aria-label="Năm sinh"
              />
              <input
                type="number"
                name="deathYear"
                className="filter-input-dyear"
                placeholder="Năm mất"
                value={searchParams.deathYear}
                onChange={handleInputChange}
               
                max={new Date().getFullYear()}
              />
              <input
                type="text"
                name="hometown"
                className="filter-input-hometown"
                placeholder="Quê quán"
                value={searchParams.hometown}
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
