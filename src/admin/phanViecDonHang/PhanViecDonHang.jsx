import Sidebar from "../../components/Sidebar/sideBar"
import '../phanViecDonHang/PhanViecDonHang.css';
import DateFilter from '../../components/DateFilter/dateFilter';

const PhanViecDonHang = () => {
    const handleDateFilterChange = (startDate, endDate) => {
        console.log('Start Date:', startDate);
        console.log('End Date:', endDate);
    };
    return (
        <div className="contribute-bill">
            <Sidebar />
            <aside className="contribute-work-list">
            <h1>DANH SÁCH ĐƠN HÀNG</h1>
                <DateFilter onFilterChange={handleDateFilterChange} className="date-filter" />
                
                <table>
                    <thead>
                        <tr>
                            <th>Dịch vụ</th>
                            <th>Loại</th>
                            <th>Ngày đặt</th>
                            <th>Thời hạn</th>
                            <th>Vị trí</th>
                            <th>Số lượng</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Array.from({ length: 11 }).map((_, index) => (
                                <tr key={index}>
                                    <td>Thay hoa ở mộ</td>
                                    <td>Hoa cúc</td>
                                    <td>18/9/2024</td>
                                    <td>25/9/2024</td>
                                    <td><b>K37 - 63</b></td>
                                    <td>2</td>
                                    <td><div style={{ color: 'red' }}>Đang xử lý</div></td>
                                    <td><button>Chi tiết</button></td>
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