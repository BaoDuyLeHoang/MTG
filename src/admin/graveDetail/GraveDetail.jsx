import Sidebar from "../../components/Sidebar/sideBar";
import '../graveDetail/GraveDetail.css';
import df from '../../assets/logo/c8dabd63-fe82-4f08-b8ee-f6e172e2a804.jpg';
export default function GraveDetail() {
    return (
        <div className="grave-detail">
            <Sidebar />
            <div className="log">
                <img src={df} className="hoai" />
                <h3>Thân nhân sở hữu mộ:</h3>
                <p>Họ và tên : Nguyễn Văn A</p>
                <p>SĐT người thân : 091239848714</p>
            </div>
            <div className="grave-detail-list">
                <h1>Nguyễn Công Trứ</h1>
                <label>Bí danh :</label><br />
                <label>Chức vụ :</label><br />
                <label>Ngày sinh : 19-3-1922</label><br />
                <label>Quê quán :</label><br />
                <label>Huân chương :</label>
                <h2>Tình trạng mộ:</h2>
                <div className="status-fillers">
                    <label>
                        Loại hoa được trồng:
                        <input type="text" />
                    </label>
                    <label>
                        Loại cây được trồng:
                        <input type="text" />
                    </label>
                    <label>
                        Tình trạng mộ phần:
                        <input type="text" />
                    </label>
                </div>
                <h3>Lịch sử bảo dưỡng / dịch vụ mộ:</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Loại dịch vụ</th>
                            <th>Nội dung</th>
                            <th>Nhân viên thực hiện</th>
                            <th>Số tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Array.from({ length: 4 }).map((_, index) => (
                                <tr key={index}>
                                    <td>20/09/2025</td>
                                    <td>Thay hoa</td>
                                    <td>Thay hoa ở trước mộ thành hoa vạn thọ</td>
                                    <td>Bùi Văn B</td>
                                    <td>5.000.000 vnd</td>
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
            </div>
        </div>
    )
}