import React from 'react';
import Sidebar from '../../components/Sidebar/sideBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBoxes, faShoppingCart, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import './dashBoard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard">
        <main className="main-content">
          <h2>Overview</h2>
          <div className="dashboard-widgets">
            <div className="widget">
              <FontAwesomeIcon icon={faUsers} className="widget-icon" />
              <h3>Nhân viên</h3>
              <p className="widget-value">1,234</p>
            </div>
            <div className="widget">
              <FontAwesomeIcon icon={faBoxes} className="widget-icon" />
              <h3>Khách hàng</h3>
              <p className="widget-value">567</p>
            </div>
            <div className="widget">
              <FontAwesomeIcon icon={faShoppingCart} className="widget-icon" />
              <h3>Đơn hàng</h3>
              <p className="widget-value">89</p>
            </div>
            <div className="widget">
              <FontAwesomeIcon icon={faDollarSign} className="widget-icon" />
              <h3>Doanh thu</h3>
              <p className="widget-value">$12,345</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
