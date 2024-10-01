import React from "react";
import Sidebar from "../../components/Sidebar/sideBar";
import "./TaskDescription.css"; // Add styles for the main page layout

const TaskDescription = () => {
  return (
    <div className="main-container">
      <Sidebar />
      <div className="content">
        <h1>Chi tiết công việc</h1>
        <div className="task-description">
          <div className="task-description-left">
            <table>
              <tbody>
                <td>
                  <tr> <h2>Tên Công Việc :</h2></tr>
                  <tr> <h2>Trạng Thái :</h2></tr>
                  <tr> <h2>Mô Tả Công Việc :</h2></tr>
                </td>
                <td>
                  <tr> Tuoi cay khu vuc 20 </tr>
                  <tr> chua haon thanh</tr>
                  <tr>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Magni sequi consequuntur necessitatibus! Assumenda corrupti
                    dolores facere. Sed quidem error odit perferendis libero
                    ducimus voluptatem, vitae quibusdam, temporibus repudiandae,
                    est pariatur?
                  </tr>
                </td>
                {/* Add rows here */}
              </tbody>
            </table>
          </div>
          <div className="task-description-right">
            <h2>thong tin bai tap</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDescription;
