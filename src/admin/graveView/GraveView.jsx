import Sidebar from "../../components/Sidebar/sideBar";
import "../graveView/GraveView.css";
import { Link } from "react-router-dom";
export default function GraveView() {
  return (
    <div className="grave-view">
      <Sidebar />
      <aside className="grave-view-list">
        <h1>Danh sách mộ</h1>
        <div className="search-fillers">
          <input type="search" placeholder="Hinted search text" />
          <button type="button">Thêm mộ</button>
        </div>
        <table>
          <thead>
            <tr>
              <td>Mã mộ</td>
              <td>Tên mộ</td>
              <td>Vị trí mộ</td>
              <td>Tên thân nhân</td>
              <td>SĐT người thân</td>
              <td>Tình trạng mộ</td>
              <td>Người quản lý</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 11 }).map((_, index) => (
              <tr key={index}>
                <td>MTG-K20-12-10</td>
                <td>Nguyễn Công Trứ</td>
                <td>K20-12-10</td>
                <td>Nguyễn Văn A</td>
                <td>0901283461547</td>
                <td>Tốt</td>
                <td>Nguyen Van A</td>
                <td>
                  <Link to="/chitietmo">
                    <button>Chi tiết</button>
                  </Link>
                </td>
              </tr>
            ))}
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
  );
}
