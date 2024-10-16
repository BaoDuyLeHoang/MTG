import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faShoppingCart, faHistory, faTasks, faUser, faMonument, faSignOutAlt, faMoneyBillWave, faComments } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/logo/logo-giao-duc-an-nhien.png';
import './sideBar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const menuItems = [
        { to: "/", icon: faHome, text: "Trang chủ", roles: [1, "staff"] },
        { to: "/danhsachaccount", icon: faUser, text: "Quản lý tài khoản", roles: [1] },
        { to: "/danhsachdonhang", icon: faShoppingCart, text: "Đơn hàng", roles: [2] },
        { to: "/danhSachCongViec", icon: faTasks, text: "Công việc", roles: [2] },
        { to: "/danhsachnhanvien", icon: faUser, text: "Nhân viên", roles: [2] },
        { to: "/danhsachmo", icon: faMonument, text: "Danh sách mộ", roles: [2] },
        { to: "/danhsachthanhtoan", icon: faMoneyBillWave, text: "Thanh toán", roles: [2] },
        { to: "/danhsachphannhoikhachhang", icon: faComments, text: "Phản hồi khách hàng", roles: [2] },
        { to: "/chitietdonhang", icon: faShoppingCart, text: "Giao việc", roles: [2] },
    ];

    return (
        <aside className="sidebar">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
            </div>
            <div className='user-info'>
                <div className='user-avatar'>
                    <img alt="Avatar" />
                </div>
                <div className='user-details'>
                    <p>{user?.accountName || 'User Name'}</p>
                    <p>{user?.role || 'Role'}</p>
                </div>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map((item, index) => (
                        (item.roles.includes(user?.role)) && (
                            <li key={index}>
                                <Link to={item.to}>
                                    <FontAwesomeIcon icon={item.icon} /> {item.text}
                                </Link>
                            </li>
                        )
                    ))}
                    <li>
                        <Link onClick={handleLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
