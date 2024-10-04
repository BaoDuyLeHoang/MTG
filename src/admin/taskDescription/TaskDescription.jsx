import React from "react";
import Sidebar from "../../components/Sidebar/sideBar";
import "./TaskDescription.css"; // Add styles for the main page layout

const TaskDescription = () => {
  return (
    <div className="main-container">
      <Sidebar />
      <div className="task-detail-container">
        <h1>Chi tiết công việc</h1>

        <div className="task-info-container">
          <div className="task-info-left">
            <div className="info-row">
              <label>Tên công việc:</label>
              <span>Thay đổi ngoại cảnh</span>
            </div>
            <div className="info-row">
              <label>Trạng thái:</label>
              <span className="status-overdue">Quá hạn</span>
            </div>
            <div className="info-row description">
              <label>Mô tả công việc:</label>
              <div className="description-box">
                Quét sạch lá rụng trong sân, bao gồm các khu vực như đường đi,
                lối vào, và các khu vực xung quanh vườn. Sau khi quét xong, lá
                cần được đơm lại và bỏ vào bao hoặc khu vực thu gom rác.
              </div>
            </div>
          </div>

          <div className="task-info-right">
            <div className="info-row">
              <label>Vị trí thực hiện:</label>
              <span>MTG-K20D11-3</span>
            </div>
            <div className="info-row">
              <label>Người thực hiện:</label>
              <span>Hoàng Nguyeenc ô</span>
            </div>
            <div className="date-inputs">
              <div className="info-row">
                <label>Từ ngày:</label>
                <div className="date-input-container">
                  <input type="text" value="21/09/2024" readOnly />
                  <i className="fas fa-calendar-alt calendar-icon"></i>
                </div>
              </div>
              <div className="info-row">
                <label>Đến ngày:</label>
                <div className="date-input-container">
                  <input type="text" value="21/09/2024" readOnly />
                  <i className="fas fa-calendar-alt calendar-icon"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h2>Trao đổi</h2>
        <div className="exchange-section">
          <div className="exchange-info">
            <div className="info-row">
              <label>Họ và tên:</label>
              <span>Nguyễn Văn A</span>
            </div>
            <div className="info-row">
              <label>Vị trí thực hiện:</label>
              <span>MTG-K20D11-3</span>
            </div>
            <div className="info-row">
              <label>Ngày:</label>
              <span>21/09/2024</span>
            </div>
            <div className="info-row">
              <label>Lý do:</label>
              <div className="reason-box">Ngày 21/09 tôi đề suất công việc</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDescription;
