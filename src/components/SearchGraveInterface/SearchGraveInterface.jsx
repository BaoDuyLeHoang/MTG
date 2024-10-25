import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchGraveInterface.css";
import Header from "../Header/header";
import { searchGraves } from "../../APIcontroller/API";

const SearchGraveInterface = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    name: "",
    birthYear: "",
    deathYear: "",
    hometown: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const results = await searchGraves(searchParams);
      // Navigate to the search results page with the results
      navigate("/search-results", { state: { results } });
    } catch (error) {
      console.error("Error searching graves:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="search-grave-interface-container">
        <div className="search-container">
          <h1 className="title">TÌM KIẾM MỘ</h1>
          <form className="search-form" onSubmit={handleSearch}>
            <div className="main-search">
              <input
                type="text"
                name="name"
                className="search-grave-input"
                placeholder="Họ và Tên người mất"
                value={searchParams.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="filters">
              <input
                type="text"
                name="birthYear"
                className="filter-input-byear"
                placeholder="Năm sinh"
                value={searchParams.birthYear}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="deathYear"
                className="filter-input-dyear"
                placeholder="Năm mất"
                value={searchParams.deathYear}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="hometown"
                className="filter-input-hometown"
                placeholder="Quê quán"
                value={searchParams.hometown}
                onChange={handleInputChange}
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
