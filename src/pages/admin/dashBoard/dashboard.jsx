import React from "react";
import Sidebar from "../../../components/Sidebar/sideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBoxes,
  faShoppingCart,
  faDollarSign,
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
  // Pie chart data
  const pieData = {
    labels: ["Đơn hàng mới", "Đang xử lý", "Đã hoàn thành"],
    datasets: [
      {
        data: [30, 50, 20],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  // Line chart data
  const lineData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Doanh thu theo tháng",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard">
        
        <main className="main-content">
          <div className="dashboard-widgets">
            <div className="widget">
              <div className="widget-content">
                <div className="widget-icon-wrapper">
                  <FontAwesomeIcon icon={faUsers} className="widget-icon" />
                </div>
                <div className="widget-info">
                  <p className="widget-label">Nhân viên</p>
                  <h3 className="widget-value">1,234</h3>
                  <p className="widget-change">+12% so với tháng trước</p>
                </div>
              </div>
            </div>
            <div className="widget">
              <div className="widget-content">
                <div className="widget-icon-wrapper">
                  <FontAwesomeIcon icon={faBoxes} className="widget-icon" />
                </div>
                <div className="widget-info">
                  <p className="widget-label">Khách hàng</p>
                  <h3 className="widget-value">567</h3>
                  <p className="widget-change">+8% so với tháng trước</p>
                </div>
              </div>
            </div>
            <div className="widget">
              <div className="widget-content">
                <div className="widget-icon-wrapper">
                  <FontAwesomeIcon icon={faShoppingCart} className="widget-icon" />
                </div>
                <div className="widget-info">
                  <p className="widget-label">Đơn hàng</p>
                  <h3 className="widget-value">89</h3>
                  <p className="widget-change">+15% so với tháng trước</p>
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
                  <h3 className="widget-value">$12,345</h3>
                  <p className="widget-change">+20% so với tháng trước</p>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-charts">
            <div className="chart-card">
              <div className="chart-header">
                <h3>Trạng thái đơn hàng</h3>
                <select className="chart-period">
                  <option>7 ngày qua</option>
                  <option>30 ngày qua</option>
                  <option>3 tháng qua</option>
                </select>
              </div>
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  aspectRatio: 1.5,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
            <div className="chart-card">
              <div className="chart-header">
                <h3>Doanh thu theo tháng</h3>
                <select className="chart-period">
                  <option>2024</option>
                  <option>2023</option>
                </select>
              </div>
              <Line
                data={lineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  aspectRatio: 1.5,
                  plugins: {
                    legend: {
                      position: 'bottom'
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
