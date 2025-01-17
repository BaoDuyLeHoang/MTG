import React from "react";
import Sidebar from "../../../components/Sidebar/sideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBoxes,
  faShoppingCart,
  faDollarSign,
  faTimes,
  faFilter,
  faEye,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import "./dashBoard.css";
import { useState, useEffect } from "react";
import { fetchDashboardStats } from "../../../services/dashboard";
import { fetchAreas } from "../../../services/area";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedArea, setSelectedArea] = useState('all');
  const [areas, setAreas] = useState([]);
  const [availableYears] = useState(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({length: 3}, (_, i) => currentYear - i);
  });
  
  const [dashboardStats, setDashboardStats] = useState({
    totalManager: 0,
    totalStaff: 0,
    totalTask: 0,
    totalRevenue: 0,
    totalOrder: 0,
    totalAssignmentTask: 0,
    totalRequestTask: 0,
    monthSales: [],
    topCustomer: []
  });

  // Cập nhật state cho biểu đồ tròn với nhãn mới
  const [taskData, setTaskData] = useState({
    labels: ['Công việc thường', 'Công việc định kì', 'Công việc theo yêu cầu'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: [
        'rgb(54, 162, 235)',    // Xanh dương - công việc thường
        'rgb(75, 192, 192)',    // Xanh lá - công việc định kì
        'rgb(255, 159, 64)'     // Cam - công việc theo yêu cầu
      ],
      borderWidth: 1
    }]
  });

  const [revenueData, setRevenueData] = useState({
    labels: Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`),
    datasets: [{
      label: 'Doanh thu theo tháng',
      data: Array(12).fill(0),
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    }]
  });

  useEffect(() => {
    const loadAreas = async () => {
      try {
        const areasData = await fetchAreas();
        setAreas([
          { areaId: 'all', areaName: 'Tất cả khu vực' },
          ...areasData
        ]);
      } catch (error) {
        console.error('Error loading areas:', error);
      }
    };

    loadAreas();
  }, []);

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const stats = await fetchDashboardStats(selectedYear, selectedArea);
        if (stats) {
          setDashboardStats(stats);
          
          // Cập nhật dữ liệu biểu đồ doanh thu
          const monthlyData = stats.monthSales.map(sale => sale.totalSales);
          setRevenueData(prev => ({
            ...prev,
            datasets: [{
              ...prev.datasets[0],
              data: monthlyData
            }]
          }));

          // Cập nhật dữ liệu biểu đồ công việc
          setTaskData(prev => ({
            ...prev,
            datasets: [{
              ...prev.datasets[0],
              data: [
                stats.totalTask,             // Công việc thường
                stats.totalAssignmentTask,   // Công việc định kì
                stats.totalRequestTask       // Công việc theo yêu cầu
              ]
            }]
          }));
        }
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      }
    };

    loadDashboardStats();
  }, [selectedYear, selectedArea]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleAreaChange = (event) => {
    setSelectedArea(event.target.value);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard">
        <main className="main-content">
          <div className="dashboard-filters">
            <div className="filter-group">
              <label>Năm:</label>
              <select 
                value={selectedYear}
                onChange={handleYearChange}
                className="filter-select"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Khu vực:</label>
              <select 
                value={selectedArea}
                onChange={handleAreaChange}
                className="filter-select"
              >
                {areas.map(area => (
                  <option key={area.areaId} value={area.areaId}>
                    {area.areaName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="dashboard-widgets">
            
            <div className="widget">
              <div className="widget-content">
                <div className="widget-icon-wrapper">
                  <FontAwesomeIcon icon={faUsers} className="widget-icon" />
                </div>
                <div className="widget-info">
                  <p className="widget-label">Nhân viên</p>
                  <h3 className="widget-value">{dashboardStats.totalStaff}</h3>
                  <p className="widget-change">Tổng số nhân viên hiện tại</p>
                </div>
              </div>
            </div>

            <div className="widget">
              <div className="widget-content">
                <div className="widget-icon-wrapper">
                  <FontAwesomeIcon icon={faUserTie} className="widget-icon" />
                </div>
                <div className="widget-info">
                  <p className="widget-label">Quản lý</p>
                  <h3 className="widget-value">{dashboardStats.totalManager}</h3>
                  <p className="widget-change">Tổng số quản lý hiện tại</p>
                </div>
              </div>
            </div>

            <div className="widget">
              <div className="widget-content">
                <div className="widget-icon-wrapper">
                  <FontAwesomeIcon icon={faShoppingCart} className="widget-icon" />
                </div>
                <div className="widget-info">
                  <p className="widget-label">Tổng công việc</p>
                  <h3 className="widget-value">{dashboardStats.totalTask + dashboardStats.totalAssignmentTask + dashboardStats.totalRequestTask}</h3>
                  <p className="widget-change">
                    Tổng số công việc trong nghĩa trang                    
                  </p>
                </div>
              </div>
            </div>

            <div className="widget">
              <div className="widget-content">
                <div className="widget-icon-wrapper">
                  <FontAwesomeIcon icon={faDollarSign} className="widget-icon" />
                </div>
                <div className="widget-info">
                  <p className="widget-label">Doanh thu</p>
                  <h3 className="widget-value">
                    {dashboardStats.totalRevenue.toLocaleString('vi-VN')}đ
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-lists">
            <div className="list-card">
              <h3>Khách hàng hàng đầu</h3>
              <div className="customer-list">
                {dashboardStats.topCustomer && dashboardStats.topCustomer.map((customer) => (
                  <div key={customer.accountId} className="customer-item">
                    <div className="customer-avatar">
                      {customer.avatarPath ? (
                        <img src={customer.avatarPath} alt={customer.fullName} />
                      ) : (
                        <div className="avatar-placeholder">
                          {customer.fullName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="customer-info">
                      <h4>{customer.fullName}</h4>
                      <p>Chi tiêu: {customer.customerSpending.toLocaleString('vi-VN')}đ</p>
                      <p>{customer.phoneNumber}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dashboard-charts">
            {/* Biểu đồ tròn cho công việc với nhãn mới */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Phân loại công việc</h3>
              </div>
              <Pie
                data={taskData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  aspectRatio: 2,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        boxWidth: 12
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>

            {/* Biểu đồ doanh thu */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Doanh thu theo tháng</h3>
              </div>
              <Line
                data={revenueData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  aspectRatio: 1.5,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const value = context.raw || 0;
                          return `Doanh thu: ${value.toLocaleString('vi-VN')}đ`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return value.toLocaleString('vi-VN') + 'đ';
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
