import React from "react";
import "./SearchGraveInterface.css";
import Header from "../Header/header";
const SearchGraveInterface = () => {
  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="search-grave-interface-container">
        <div className="search-container">
          <h1 className="title">TÌM KIẾM MỘ</h1>
          <div className="search-form">
            <div className="main-search">
              <input
                type="text"
                className="search-input"
                placeholder="Họ và Tên người mất"
              />
              <span className="search-icon">🔍</span>
            </div>
            <div className="filters">
              <input
                type="text"
                className="filter-input"
                placeholder="Năm sinh"
              />
              <input
                type="text"
                className="filter-input"
                placeholder="Năm mất"
              />
              <input
                type="text"
                className="filter-input"
                placeholder="Quê quán"
              />
            </div>
            <button className="search-button">TÌM KIẾM</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchGraveInterface;
