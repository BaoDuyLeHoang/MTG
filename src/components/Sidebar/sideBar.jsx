import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faShoppingCart, faHistory, faTasks, faUser, faMonument, faSignOutAlt, faMoneyBillWave, faComments } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/logo/logo-giao-duc-an-nhien.png';
import './sideBar.css';
import { Link } from 'react-router-dom'; // Add this import

const Sidebar = () => {
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
                    <p>Nguyen Cong Ty</p>
                    <p>Admin</p>
                </div>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li><Link to="/"><FontAwesomeIcon icon={faHome} /> Trang chủ</Link></li>
                    <li><Link to="/danhsachaccount"><FontAwesomeIcon icon={faUser} /> Quản lý tài khoản</Link></li>
                    <li><Link to="/danhsachdonhang"><FontAwesomeIcon icon={faShoppingCart} /> Đơn hàng</Link></li>
                    <li><Link to="/danhSachCongViec"><FontAwesomeIcon icon={faTasks} /> Công việc</Link></li>
                    <li><Link to="/danhsachnhanvien"><FontAwesomeIcon icon={faUser} /> Nhân viên</Link></li>
                    <li><Link to="/danhsachmo"><FontAwesomeIcon icon={faMonument} /> Danh sách mộ</Link></li>
                    <li><Link to="/danhsachthanhtoan"><FontAwesomeIcon icon={faMoneyBillWave} /> Thanh toán</Link></li>
                    <li><Link to="/danhsachphannhoikhachhang"><FontAwesomeIcon icon={faComments} /> Phản hồi khách hàng</Link></li>
                    <li><Link to="/chitietdonhang"><FontAwesomeIcon icon={faShoppingCart} />Chi tiết đơn hàng</Link></li>
                    <li><Link to="/chitietmo"><FontAwesomeIcon icon={faMonument} />Chi tiết mộ</Link></li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;