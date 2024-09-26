import Sidebar from "../../components/Sidebar/sideBar";
import '../taskDescription/TaskDescription.css';
export default function TaskDescription() {
    return (
        <div className="task-description">
            <Sidebar />
            <div className="task-description-list">
                <div className="ok">
                    <h1>Chi tiết công việc</h1>
                </div>
                <div className="task-desc-fillers">
                    <p><b>Tên công việc: </b>Thay đổi ngoại cảnh</p>
                    <p><b>Trạng thái: </b>Quá hạn</p>
                    <p><b>Mô tả công việc: </b>
                        <input placeholder="Quét sạch lá rụng trong sân, bao gồm các khu vực như đường đi, lối vào, và các khu vực xung quanh vườn. Sau khi quét xong, lá cần được gom lại và bỏ vào bao hoặc khu vực thu gom rác." />
                    </p>
                    <p><b>Vị trí thực hiện: </b>MTG-K20011-3</p>
                    <p><b>Người thực hiện: </b>Hoàng Nguyeenc ô</p>
                    <p><b>Từ ngày: </b><input type="date" /></p>
                    <p><b>Đến ngày: </b><input type="date" /></p>
                </div>
                <div className="oanh">
                    <h3>Trao đổi</h3>
                    <div className="huyen">
                        <p><b>Họ và tên: </b>Nguyễn Văn A</p>
                        <p><b>Ngày: </b>21/09/2024</p>
                        <p><b>Vị trí thực hiện: </b>MTG-K20D11-3</p>
                        <p><b>Lý do: </b><input type="text" placeholder="Ngày 21/09 tôi để soát cong việc" /></p>
                    </div>
                </div>
            </div>

        </div>

    )
}