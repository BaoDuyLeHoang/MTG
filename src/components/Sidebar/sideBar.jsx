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
  faUserCog,
  faCalendarAlt,
  faClipboardList,
  faUsers,
  faBuilding,
  faCommentDots,
  faListAlt,
  faFileAlt,
  faUserClock,
  faCreditCard,
  faUserTie,
  faBriefcase,
  faPen,
  faMessage
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/logo/logo-giao-duc-an-nhien.png";
import "./sideBar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../services/profile";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [avatarPath, setAvatarPath] = React.useState(null);
  const [fullName, setFullName] = React.useState("");

  // Add useEffect to fetch profile data
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (user?.accountId) {
        try {
          const profileData = await getProfile(user.accountId);
          setAvatarPath(profileData.avatarPath);
          setFullName(profileData.fullName);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [user?.accountId]);

  // Moved menuItems inside component to access user context
  const menuItems = [
    // Admin Items (Role 1)
    {
      to: "/admin",
      icon: faCreditCard,
      text: "Thống kê",
      roles: [1],
    },
    {
      to: "/danhsachaccount",
      icon: faUserCog,
      text: "Quản lý nhân sự",
      roles: [1],
    },
    {
      to: "/service-management",
      icon: faBuilding,
      text: "Quản lý dịch vụ",
      roles: [1],
    },
    {
      to: "/material-management",
      icon: faListAlt,
      text: "Quản lý vật liệu",
      roles: [1],
    },
    


    // Manager Items (Role 2)
    {
      to: "/profileManager",
      icon: faUserTie,
      text: "Hồ sơ nhân viên",
      roles: [2],
    },
    {
      to: "/danhsachdonhang",
      icon: faShoppingCart,
      text: "Đơn hàng",
      roles: [2],
    },
    { 
      to: "/danhsachnhanvien", 
      icon: faUsers, 
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
      to: "/blog-manager",
      icon: faFileAlt,
      text: "Quản lý bài viết",
      roles: [2],
    },
    {
      to: "/attendance-manager",
      icon: faUserClock,
      text: "Quản lý công việc",
      roles: [2],
    },
    {
      to: "/danhsachthanhtoan",
      icon: faCreditCard,
      text: "Thanh toán",
      roles: [],
    },

    // Staff Items (Role 3)
    {
      to: "/profilestaff-staff",
      icon: faUserTie,
      text: "Hồ sơ nhân viên",
      roles: [3],
    },
    { 
      to: "/schedule-staff", 
      icon: faBriefcase, 
      text: "Lịch làm việc", 
      roles: [3] 
    },
    { 
      to: "/danhsachdonhang-staff", 
      icon: faClipboardList, 
      text: "Công việc", 
      roles: [3] 
    },
    { 
      to: "/recurring-tasks", 
      icon: faClipboardList, 
      text: "Công việc định kì", 
      roles: [3] 
    },
    {
      to: "/blog-management",
      icon: faPen,
      text: "Bài viết",
      roles: [3],
    },
    {
      to: "/notifications-staff",
      icon: faMessage,
      text: "Thông báo",
      roles: [3],
    }
    

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
        <h3 className="user-name">Xin chào, {fullName || "Guest"}!</h3>
        <div className="user-profile">
          <div className="user-avatar">
            {avatarPath ? (
              <img
                src={`${avatarPath}`}
                alt={user?.accountName || "User"}
                onError={(e) => {
                  if (e.target) {
                    e.target.style.display = "none";
                    if (e.target.nextElementSibling) {
                      e.target.nextElementSibling.style.display = "flex";
                    }
                  }
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
              {user?.role === 1 ? "Quản trị" : user?.role === 2 ? "Quản lý" : "Nhân viên"}
            </span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {user?.role === ROLES.ADMIN && (
          <div className="menu-category">
            <h3>Bảng quản trị</h3>
            <MenuItems items={menuCategories.admin} isActiveRoute={isActiveRoute} />
          </div>
        )}

        {user?.role === ROLES.MANAGER && (
          <div className="menu-category">
            <h3>Bảng quản lý</h3>
            <MenuItems items={menuCategories.manager} isActiveRoute={isActiveRoute} />
          </div>
        )}

        {user?.role === ROLES.STAFF && (
          <div className="menu-category">
            <h3>Bảng nhân viên</h3>
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
