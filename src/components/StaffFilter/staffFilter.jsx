import React, { useState } from 'react';
import './staffFilter.css';

const StaffFilter = ({ onFilterChange }) => {
  const [activeStatus, setActiveStatus] = useState('active');
  const [selectedCategories, setSelectedCategories] = useState(['all']);

  const categories = ['K01', 'K02', 'K03', 'K37', 'K45', 'K46', 'K47', 'K48'];

  const handleStatusChange = (status) => {
    setActiveStatus(status);
    onFilterChange({ status, categories: selectedCategories });
  };

  const handleCategoryChange = (category) => {
    let newCategories;
    if (category === 'all') {
      newCategories = ['all'];
    } else {
      newCategories = selectedCategories.includes('all') 
        ? [category]
        : selectedCategories.includes(category)
          ? selectedCategories.filter(c => c !== category)
          : [...selectedCategories, category];
      
      if (newCategories.length === 0) {
        newCategories = ['all'];
      } else if (newCategories.length === categories.length) {
        newCategories = ['all'];
      }
    }
    setSelectedCategories(newCategories);
    onFilterChange({ status: activeStatus, categories: newCategories });
  };

  return (
    <div className="staff-filter">
      <div className="status-filter">
        <button 
          className={activeStatus === 'active' ? 'active' : ''}
          onClick={() => handleStatusChange('active')}
        >
          ✓ Đang hoạt động
        </button>
        <button 
          className={activeStatus === 'inactive' ? 'active' : ''}
          onClick={() => handleStatusChange('inactive')}
        >
          Ngưng hoạt động
        </button>
      </div>
      <div className="category-filter">
        <button 
          className={selectedCategories.includes('all') ? 'active' : ''}
          onClick={() => handleCategoryChange('all')}
        >
          ✓ Tất cả
        </button>
        {categories.map(category => (
          <button 
            key={category}
            className={selectedCategories.includes(category) ? 'active' : ''}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StaffFilter;
