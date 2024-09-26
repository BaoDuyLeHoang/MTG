import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './searchBar.css';

const SearchBar = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="search-bar">
            
            <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />
            
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
        </div>
    );
};

export default SearchBar;
