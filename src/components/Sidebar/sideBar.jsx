import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faShoppingCart,
  faHistory,
  faTasks,
  faUser,
  faMonument,
  faSignOutAlt,
  faMoneyBillWave,
  faComments,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/logo/logo-giao-duc-an-nhien.png";
import "./sideBar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Moved menuItems inside component to access user context
  const menuItems = [
    // Admin Items (Role 1)
    {
      to: "/danhsachaccount",
      icon: faUser,
      text: "Quản lý tài khoản",
      roles: [1],
    },

    // Manager Items (Role 2)
    {
      to: "/profilestaff",
      icon: faUser,
      text: "Hồ sơ nhân viên",
      roles: [2],
    },
    { 
      to: "/", 
      icon: faChartLine, 
      text: "Thống kê", 
      roles: [1, 2] 
    },
    {
      to: "/danhsachdonhang",
      icon: faShoppingCart,
      text: "Đơn hàng",
      roles: [2],
    },
    { 
      to: "/danhsachnhanvien", 
      icon: faUser, 
      text: "Nhân viên", 
      roles: [2] 
    },
    { 
      to: "/danhsachmo", 
      icon: faMonument, 
      text: "Danh sách mộ", 
      roles: [2] 
    },
    {
      to: "/danhsachphannhoikhachhang",
      icon: faComments,
      text: "Phản hồi khách hàng",
      roles: [2],
    },
    {
      to: "/chitietdonhang",
      icon: faShoppingCart,
      text: "Giao việc",
      roles: [2],
    },
    {
      to: "/blog-manager",
      icon: faComments,
      text: "Quản lý bài viết",
      roles: [2],
    },
    {
      to: "/danhsachthanhtoan",
      icon: faMoneyBillWave,
      text: "Thanh toán",
      roles: [2],
    },

    // Staff Items (Role 3)
    {
      to: "/profilestaff-staff",
      icon: faUser,
      text: "Hồ sơ nhân viên",
      roles: [3],
    },
    { 
      to: "/danhsachdonhang-staff", 
      icon: faTasks, 
      text: "Công việc", 
      roles: [3] 
    },
    {
      to: "/blog-management",
      icon: faMoneyBillWave,
      text: "Bài viết",
      roles: [3],
    },
    


  ];

  // First, define the role constants to avoid magic numbers
  const ROLES = {
    ADMIN: 1,
    MANAGER: 2,
    STAFF: 3
  };

  // Then improve the menu filtering
  const menuCategories = {
    admin: menuItems.filter(item => 
      item.roles.includes(ROLES.ADMIN)
    ),
    manager: menuItems.filter(item => 
      item.roles.includes(ROLES.MANAGER)
    ),
    staff: menuItems.filter(item => 
      item.roles.includes(ROLES.STAFF)
    )
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Add toast notification here
    }
  };

  // Active menu item tracking
  const isActiveRoute = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <h3 className="user-name">Welcome, {user?.accountName || "Guest"}!</h3>
        <div className="user-profile">
          <div className="user-avatar">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user?.accountName || "User"}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "flex";
                }}
              />
            ) : (
              <div className="default-avatar">
                <FontAwesomeIcon icon={faUser} />
              </div>
            )}
          </div>

          <div className="user-info">
            <span className="user-role">
              {user?.role === 1 ? "Admin" : user?.role === 2 ? "Manager" : "Staff"}
            </span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {user?.role === ROLES.ADMIN && (
          <div className="menu-category">
            <h3>Admin Dashboard</h3>
            <MenuItems items={menuCategories.admin} isActiveRoute={isActiveRoute} />
          </div>
        )}

        {user?.role === ROLES.MANAGER && (
          <div className="menu-category">
            <h3>Manager Dashboard</h3>
            <MenuItems items={menuCategories.manager} isActiveRoute={isActiveRoute} />
          </div>
        )}

        {user?.role === ROLES.STAFF && (
          <div className="menu-category">
            <h3>Staff Dashboard</h3>
            <MenuItems items={menuCategories.staff} isActiveRoute={isActiveRoute} />
          </div>
        )}

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất
          </button>
        </div>
      </nav>
    </aside>
  );
};

// Separate component for menu items
const MenuItems = ({ items, isActiveRoute }) => (
  <ul>
    {items.map((item, index) => (
      <li key={index}>
        <Link
          to={item.to}
          className={`sidebar-menu-item ${isActiveRoute(item.to) ? "active" : ""}`}
        >
          <FontAwesomeIcon icon={item.icon} />
          <span>{item.text}</span>
        </Link>
      </li>
    ))}
  </ul>
);

export default Sidebar;
