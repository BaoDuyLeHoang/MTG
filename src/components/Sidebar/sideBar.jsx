import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faShoppingCart, faHistory, faTasks, faUser, faMonument, faSignOutAlt, faMoneyBillWave, faComments } from '@fortawesome/free-solid-svg-icons';
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
                    <li><a href="/"><FontAwesomeIcon icon={faHome} /> Trang chủ</a></li>
                    <li><a href="/danhsachdonhang"><FontAwesomeIcon icon={faShoppingCart} /> Đơn hàng</a></li>
                    <li><a href="/danhSachCongViec"><FontAwesomeIcon icon={faTasks} /> Công việc</a></li>
                    <li><a href="/danhsachnhanvien"><FontAwesomeIcon icon={faUser} /> Nhân viên</a></li>
                    <li><a href="/danhsachmo"><FontAwesomeIcon icon={faMonument} /> Danh sách mộ</a></li>
                    <li><a href="/danhsachthanhtoan"><FontAwesomeIcon icon={faMoneyBillWave} /> Thanh toán</a></li>
                    <li><a href="/danhsachphannhoikhachhang"><FontAwesomeIcon icon={faComments} /> Phản hồi khách hàng</a></li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;