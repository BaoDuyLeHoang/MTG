import React, { useState, useEffect } from 'react';
import './staffFilter.css';
import { FaMapMarkerAlt } from 'react-icons/fa';

const StaffFilter = ({ onFilterChange, staffData }) => {
  const [selectedArea, setSelectedArea] = useState('all');
  const [uniqueAreas, setUniqueAreas] = useState([]);

  useEffect(() => {
    // Extract unique areas from staffData
    const areas = [...new Set(staffData.map(staff => staff.areaId))]
      .filter(areaId => areaId !== null)
      .sort((a, b) => a - b);

    setUniqueAreas(areas);
  }, [staffData]);

  const handleAreaChange = (areaId) => {
    const newArea = areaId === selectedArea ? 'all' : areaId;
    setSelectedArea(newArea);
    onFilterChange(newArea);
  };

  return (
    <div className="staff-filter">
      <div className="filter-header">
        <FaMapMarkerAlt className="location-icon" />
        <h3>Lọc theo khu vực</h3>
      </div>
      <div className="area-filter">
        <button 
          className={`filter-btn ${selectedArea === 'all' ? 'active' : ''}`}
          onClick={() => handleAreaChange('all')}
        >
          Tất cả khu vực
        </button>
        {uniqueAreas.map(areaId => (
          <button
            key={areaId}
            className={`filter-btn ${selectedArea === areaId ? 'active' : ''}`}
            onClick={() => handleAreaChange(areaId)}
          >
            Khu vực {areaId}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StaffFilter;
