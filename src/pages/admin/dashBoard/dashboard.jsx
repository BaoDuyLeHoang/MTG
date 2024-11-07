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
          <h2>Tổng quan</h2>
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
          <div className="dashboard-charts">
            <div className="chart-container">
              <h3>Trạng thái đơn hàng</h3>
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  aspectRatio: 2, // Adjust this value to control the size
                }}
              />
            </div>
            <div className="chart-container">
              <h3>Doanh thu theo tháng</h3>
              <Line
                data={lineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  aspectRatio: 2, // Adjust this value to control the size
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
