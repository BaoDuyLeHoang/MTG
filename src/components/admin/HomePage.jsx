import ed from './logo-giao-duc-an-nhien.jpg';
import './HomePage.css';
export default function HomePage() {
    return (
        <div className="home-page">
            <aside className="sidebar">
                <img src={ed} className='logo' />
                <ul>
                    <li><a href="#">Trang chủ</a></li>
                    <li><a href="#">Đơn hàng</a></li>
                    <li><a href="#">Lịch sử đơn hàng</a></li>
                    <li><a href="#">Công việc hằng ngày</a></li>
                    <li><a href="#">Thông tin cá nhân</a></li>
                    <li><a href="#">Thông tin mộ</a></li>
                    <li><a href="#">Đăng xuất</a></li>
                </ul>
            </aside>
            <div className='dashboard'>
                <div className='stats'>
                    <div className='stat'>
                        <p>Employees</p>
                        <p>20</p>
                    </div>
                    <div className='stat'>
                        <p>Clients</p>
                        <p>20</p>
                    </div>
                    <div className='stat'>
                        <p>Orders</p>
                        <p>20</p>
                    </div>
                    <div className='stat'>
                        <p>Grave</p>
                        <p>20</p>
                    </div>
                </div>
                <div className='filters'>
                    <input type="date" />
                    <input type="date" />
                </div>
                <div className='charts'>
                    <div className='chart'>
                        <p>Pie Chart</p>
                    </div>
                    <div className='chart'>
                        <p>Bar Chart</p>
                    </div>
                    <div className='chart'>
                        <p>Line Chart</p>
                    </div>
                </div>
            </div>
        </div>
    )
}