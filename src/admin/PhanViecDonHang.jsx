import Sidebar from "../components/Sidebar/sideBar"
import '../admin/PhanViecDonHang.css';
const PhanViecDonHang = () => {
    return (
        <div className="contribute-bill">
            <Sidebar />
            <aside className="contribute-work-list">
                <div className="date-fill">
                    <h1>Đơn hàng</h1>
                    <label>
                        Từ ngày <input type="date" />
                    </label>
                    <label>Đến ngày <input type="date" /></label>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th><u>Dịch vụ</u></th>
                            <th><u>Loại</u></th>
                            <th><u>Ngày đặt</u></th>
                            <th><u>Thời hạn</u></th>
                            <th><u>Vị trí</u></th>
                            <th><u>Số lượng</u></th>
                            <th><u>Trạng thái</u></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Array.from({ length: 11 }).map((_, index) => (
                                <tr key={index}>
                                    <td><u>Thay hoa ở mộ</u></td>
                                    <td><u>Hoa cúc</u></td>
                                    <td><u>18/9/2024</u></td>
                                    <td><u>25/9/2024</u></td>
                                    <td><u><b>K37 - 63</b></u></td>
                                    <td><u>2</u></td>
                                    <td><u style={{ color: 'red' }}><div style={{ color: 'red' }}>Đang xử lý</div></u></td>
                                    <td><button><u>Chi tiết</u></button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div className="pagination">
                    <span>&lt;</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>&gt;</span>
                </div>
            </aside>
        </div>
    )
}
export default PhanViecDonHang;