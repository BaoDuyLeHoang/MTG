import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faShoppingCart, faHistory, faTasks, faUser, faMonument, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/logo/logo-giao-duc-an-nhien.png';
import './sideBar.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
            </div>
            <div className='user-info'>
                <div className='user-avatar'>
                    <img  alt="Avatar" />
                </div>
                <div className='user-details'>
                    <p>Nguyen Cong Ty</p>
                    <p>Admin</p>
                </div>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li><a href="#home"><FontAwesomeIcon icon={faHome} /> Trang chủ</a></li>
                    <li><a href="#orders"><FontAwesomeIcon icon={faShoppingCart} /> Đơn hàng</a></li>
                    <li><a href="#history"><FontAwesomeIcon icon={faHistory} /> Lịch sử đơn hàng</a></li>
                    <li><a href="#daily-tasks"><FontAwesomeIcon icon={faTasks} /> Công việc hằng ngày</a></li>
                    <li><a href="#profile"><FontAwesomeIcon icon={faUser} /> Thông tin cá nhân</a></li>
                    <li><a href="#grave-info"><FontAwesomeIcon icon={faMonument} /> Thông tin mộ</a></li>
                    <li><a href="#logout"><FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất</a></li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;