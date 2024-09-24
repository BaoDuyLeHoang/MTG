import pl from '../components/logo-giao-duc-an-nhien.jpg';
import '../components/FeedbackManagement.css';
export default function FeedbackManagement() {
    return (
        <div className="feedback-management">
            <aside className="sidebar">
                <img src={pl} className='logo' />
                <nav>
                    <ul>
                        <li><a href="#">Trang chủ</a></li>
                        <li><a href="#">Đơn hàng</a></li>
                        <li><a href="#">Lịch sử đơn hàng</a></li>
                        <li><a href="#">Công việc hằng ngày</a></li>
                        <li><a href="#">Thông tin cá nhân</a></li>
                        <li><a href="#">Thông tin mộ</a></li>
                        <li><a href="#">Đăng xuất</a></li>
                    </ul>
                </nav>
            </aside>
            <aside className='feedback-list'>
                <h1>Danh sách các feedback</h1>
                <div className='date-fillers'>
                    <label>
                        Từ ngày:
                        <input type="date" />
                    </label>
                    <label>
                        Đến ngày:
                        <input type="date" />
                    </label>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên người tạo</th>
                            <th>Ngày tạo</th>
                            <th>Loại</th>
                            <th>Tiêu đề</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Array.from({ length: 10 }).map((_, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>Nguyen Cong Ty</td>
                                    <td>01/01/2024</td>
                                    <td>Lỗi web</td>
                                    <td>WEB lỗi quá nhiều</td>
                                    <td><button>Xem</button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div className='pagination'>
                    <span>&lt;&lt;</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>&gt;&gt;</span>
                </div>
            </aside>
        </div>
    )
}