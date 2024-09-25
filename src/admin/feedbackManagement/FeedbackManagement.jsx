import Sidebar from '../../components/Sidebar/sideBar';
import '../feedbackManagement/FeedbackManagement.css';
export default function FeedbackManagement() {
    return (
        <div className="feedback-management">
            <Sidebar />
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