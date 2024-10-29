import React from "react";
import "../graveDetail/GraveDetail.css";
import Sidebar from "../../components/Sidebar/sideBar"; // Add this import

const GraveDetail = () => {
  const serviceHistory = [
    {
      date: "20/09/2025",
      serviceType: "Thay hoa",
      content: "Thay hoa ở trước mộ thành hoa vạn thọ",
      staff: "Bùi Văn B",
      amount: "5.000.000 vnd",
    },
    // Repeated entries for the table
  ].concat(
    Array(3).fill({
      date: "20/09/2025",
      serviceType: "Thay hoa",
      content: "Thay hoa ở trước mộ thành hoa vạn thọ",
      staff: "Bùi Văn B",
      amount: "5.000.000 vnd",
    })
  );

  return (
    <div className="layout-container">
      {" "}
      {/* Add a container for layout */}
      <Sidebar /> {/* Add the Sidebar component */}
      <div className="memorial-container">
        <div className="memorial-header">
          <div className="image-container">
            <img
              src="https://th.bing.com/th?id=OSK.a643ad6ee680b5c9532f4d43068c1d5f&w=254&h=133&o=6&dpr=1.4&pid=SANGAM"
              alt="Memorial statue"
              className="memorial-image"
            />
          </div>
          <div className="personal-info">
            <h1>Nguyễn Công Trứ</h1>

            <div className="info-grid">
              <div className="info-item">
                <label>Bí danh:</label>
                <span></span>
              </div>
              <div className="info-item">
                <label>Vị trí mộ:</label>
                <span></span>
              </div>

              <div className="info-item">
                <label>Chức vụ:</label>
                <span></span>
              </div>

              <div className="info-item">
                <label>Ngày sinh:</label>
                <span>19-3-1932</span>
              </div>
              <div className="info-item">
                <label>Ngày mất:</label>
                <span></span>
              </div>

              <div className="info-item">
                <label>Quê quán:</label>
                <span></span>
              </div>

              <div className="info-item">
                <label>Huân chương:</label>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        <div className="memorial-footer">
          <div className="relative-info">
            <h2>Thân nhân sở hữu mộ:</h2>
            <div className="relative-details">
              <div>
                <label>Họ và tên:</label>
                <span>Nguyễn Văn A</span>
              </div>
              <div>
                <label>SĐT người thân:</label>
                <span>091239848714</span>
              </div>
            </div>
          </div>

          <div className="tomb-status">
            <h2>Tình trạng mộ:</h2>
            <div className="status-grid">
              <div>
                <label>
                  <b>Loại hoa được trồng:</b>
                </label>
                <span>Nguyễn Văn A</span>
              </div>
              <div>
                <label>
                  <b>Loại cay được trồng:</b>
                </label>
                <span>Nguyễn Văn A</span>
              </div>
              <div>
                <label>
                  <b> Tình trạng mộ phần:</b>
                </label>
                <span>Nguyễn Văn A</span>
              </div>
            </div>
          </div>
        </div>
        <div className="service-history">
          <h2>Lịch sử bảo dưỡng / dịch vụ mộ:</h2>
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
              {serviceHistory.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.date}</td>
                  <td>{entry.serviceType}</td>
                  <td>{entry.content}</td>
                  <td>{entry.staff}</td>
                  <td>{entry.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <span>{"<"}</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>...</span>
            <span>{">"}</span>
          </div>
          <button className="report-btn">Tạo bản báo cáo</button>
        </div>
      </div>
    </div>
  );
};
export default GraveDetail;
