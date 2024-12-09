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
import { getOrder, getTotalAccountsByRoles } from "../../../services/admin";

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
  const [orders, setOrders] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('7'); // 7 ngày mặc định
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [availableYears, setAvailableYears] = useState([]);
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [{
      label: 'Doanh thu theo tháng',
      data: [],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    }]
  });
  const [orderStatusData, setOrderStatusData] = useState({
    labels: ["Chờ xử lý", "Đã tiếp nhận", "Đã hủy", "Đang thực hiện", "Hoàn thành", "Quá hạn"],
    datasets: [{
      data: [0, 0, 0, 0, 0, 0],
      backgroundColor: ["#FF6384", "#36A2EB", "#FF9F40", "#FFCE56", "#4BC0C0", "#808080"],
      hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FF9F40", "#FFCE56", "#4BC0C0", "#808080"],
    }]
  });
  const [accountTotals, setAccountTotals] = useState({
    staff: 0,    // role 3
    managers: 0, // role 2
    customers: 0 // role 4
  });

  useEffect(() => {
    fetchOrders();
    fetchAccountTotals();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrder();
      setOrders(data);
      
      // Lấy danh sách các năm từ orderDate
      const years = [...new Set(data.map(order => 
        new Date(order.orderDate).getFullYear()
      ))].sort((a, b) => b - a); // Sắp xếp giảm dần
      
      setAvailableYears(years);
      // Set năm mới nhất làm mặc định
      if (years.length > 0) {
        setSelectedYear(years[0].toString());
        updateRevenueData(data, years[0].toString());
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchAccountTotals = async () => {
    try {
      // Get all totals in one API call
      const totals = await getTotalAccountsByRoles(2, 3, 4); // Managers, Staff, Customers

      setAccountTotals({
        managers: totals["2"],  // role 2
        staff: totals["3"],     // role 3
        customers: totals["4"]  // role 4
      });
    } catch (error) {
      console.error("Error fetching account totals:", error);
    }
  };

  const updateRevenueData = (orders, year) => {
    // Lọc orders theo năm được chọn
    const filteredOrders = orders.filter(order => 
      new Date(order.orderDate).getFullYear().toString() === year
    );

    // Khởi tạo mảng doanh thu cho 12 tháng
    const monthlyRevenue = Array(12).fill(0);

    // Tính tổng doanh thu cho từng tháng
    filteredOrders.forEach(order => {
      const date = new Date(order.orderDate);
      const month = date.getMonth(); // 0-11
      monthlyRevenue[month] += order.totalPrice;
    });

    // Tạo labels cho 12 tháng
    const monthLabels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);

    setRevenueData({
      labels: monthLabels,
      datasets: [{
        label: 'Doanh thu theo tháng',
        data: monthlyRevenue,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      }]
    });
  };

  const updateOrderStatusData = (orders, period) => {
    // Lọc orders theo period
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      const today = new Date();
      const diffTime = Math.abs(today - orderDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= parseInt(period);
    });

    // Đếm số lượng đơn hàng theo từng trạng thái
    const statusCounts = filteredOrders.reduce((acc, order) => {
      order.orderDetails.forEach(detail => {
        const status = detail.orderStatus;
        // Map lại status theo thứ tự mới
        const statusMapping = {
          0: 0, // Chờ xử lý
          1: 1, // Đã tiếp nhận
          2: 2, // Đã hủy
          3: 3, // Đang thực hiện
          4: 4, // Hoàn thành
          5: 5  // Quá hạn
        };
        const mappedStatus = statusMapping[status];
        acc[mappedStatus] = (acc[mappedStatus] || 0) + 1;
      });
      return acc;
    }, {});

    setOrderStatusData(prev => ({
      ...prev,
      datasets: [{
        ...prev.datasets[0],
        data: [
          statusCounts[0] || 0, // Chờ xử lý
          statusCounts[1] || 0, // Đã tiếp nhận
          statusCounts[2] || 0, // Đã hủy
          statusCounts[3] || 0, // Đang thực hiện
          statusCounts[4] || 0, // Hoàn thành
          statusCounts[5] || 0  // Quá hạn
        ]
      }]
    }));
  };

  // Thêm useEffect để theo dõi thay đổi của selectedPeriod
  useEffect(() => {
    if (orders.length > 0) {
      updateOrderStatusData(orders, selectedPeriod);
    }
  }, [selectedPeriod, orders]);

  // Thêm useEffect để theo dõi thay đổi của selectedYear
  useEffect(() => {
    if (orders.length > 0) {
      updateRevenueData(orders, selectedYear);
    }
  }, [selectedYear, orders]);

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // Tính toán số liệu thống kê
  const calculateStats = (orders) => {
    return orders.reduce((acc, order) => ({
      totalAmount: acc.totalAmount + order.totalPrice,
      count: acc.count + 1
    }), { totalAmount: 0, count: 0 });
  };

  // Cập nhật widget để hiển thị số lượng đơn hàng thực tế
  const orderStats = calculateStats(orders);

  // Cập nhật hàm calculateOrderStats để tách biệt việc đếm detailId và orderStatus
  const calculateOrderStats = (orders) => {
    const statusCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalDetailIds = 0;
    let totalAmount = 0;

    orders.forEach(order => {
      // Đếm orderStatus
      statusCounts[order.orderStatus] = (statusCounts[order.orderStatus] || 0) + 1;
      
      // Đếm tổng số detailId
      totalDetailIds += order.orderDetails.length;
      
      // Tính tổng doanh thu
      order.orderDetails.forEach(detail => {
        totalAmount += detail.orderPrice;
      });
    });

    return {
      statusCounts,
      totalDetailIds,
      totalAmount
    };
  };

  const stats = calculateOrderStats(orders);

  // Thêm widget quản lý và tính toán đơn hàng, doanh thu trong tháng
  const calculateCurrentMonthStats = (orders) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Lọc đơn hàng trong tháng hiện tại
    const currentMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate.getMonth() === currentMonth && 
             orderDate.getFullYear() === currentYear;
    });

    // Tính tổng số đơn hàng và doanh thu
    return currentMonthOrders.reduce((acc, order) => ({
      totalDetailIds: acc.totalDetailIds + order.orderDetails.length,
      totalAmount: acc.totalAmount + order.totalPrice
    }), { totalDetailIds: 0, totalAmount: 0 });
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
                  <h3 className="widget-value">{accountTotals.staff}</h3>
                  <p className="widget-change">Tổng số nhân viên hiện tại</p>
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
                  <h3 className="widget-value">{accountTotals.customers}</h3>
                  <p className="widget-change">Tổng số khách hàng hiện tại</p>
                </div>
              </div>
            </div>
            <div className="widget">
              <div className="widget-content">
                <div className="widget-icon-wrapper">
                  <FontAwesomeIcon icon={faShoppingCart} className="widget-icon" />
                </div>
                <div className="widget-info">
                  <p className="widget-label">Đơn hàng (Tháng hiện tại)</p>
                  <h3 className="widget-value">
                    {calculateCurrentMonthStats(orders).totalDetailIds}
                  </h3>
                  <p className="widget-change">Tổng công việc trong tháng</p>
                </div>
              </div>
            </div>
            <div className="widget">
              <div className="widget-content">
                <div className="widget-icon-wrapper">
                  <FontAwesomeIcon icon={faDollarSign} className="widget-icon" />
                </div>
                <div className="widget-info">
                  <p className="widget-label">Doanh thu (Tháng hiện tại)</p>
                  <h3 className="widget-value">
                    {calculateCurrentMonthStats(orders).totalAmount.toLocaleString('vi-VN')}đ
                  </h3>
                  <p className="widget-change">Tổng doanh thu trong tháng</p>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-charts">
            <div className="chart-card">
              <div className="chart-header">
                <h3>Trạng thái đơn hàng</h3>
                <select 
                  className="chart-period" 
                  value={selectedPeriod}
                  onChange={handlePeriodChange}
                >
                  <option value="7">7 ngày qua</option>
                  <option value="30">30 ngày qua</option>
                  <option value="90">3 tháng qua</option>
                </select>
              </div>
              <Pie
                data={orderStatusData}
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
                <select 
                  className="chart-period"
                  value={selectedYear}
                  onChange={handleYearChange}
                >
                  {availableYears.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
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
