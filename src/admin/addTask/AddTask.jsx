import Sidebar from "../../components/Sidebar/sideBar";
import '../addTask/AddTask.css';
export default function AddTask() {
    return (
        <div className="add-task">
            <Sidebar />
            <div className="add-task-list">
                <div className="op">
                    <h1>Bảng tạo công việc</h1>
                </div>
                <div className="task-fillers">
                    <p><b>Tên công việc :</b> Thay đổi ngoại cảnh</p>
                    <p><b>Mô tả công việc: </b>
                        <input type="text" placeholder="Some thing here (maximum 300 word)" />
                    </p>
                    <p><b>Vị trí thực hiện: </b>MTG-K20D11-3</p>
                    <p><b>Người thực hiện: </b>Hoàng Nguyeenc ô</p>
                    <p><b>Ngày bắt đầu: </b><input type="date" value="" /></p>
                    <p><b>Ngày kết thúc: </b><input type="date" value="" /></p>
                </div>
                <button>Tạo công việc</button>
            </div>
        </div>
    )
}