import { useEffect, useState } from "react"
import DatePicker from "react-datepicker";
import '../profileForm/ProfileForm.css';
import Sidebar from "../../components/Sidebar/sideBar";
export default function ProfileForm() {
    const [dob, setDob] = useState(null);
    const [stateWork, setStatusWork] = useState([]);
    const [formData, setFormData] = useState({
        email: "baoduylehoang2001@gmail.com",
        password: "**********",
        fullName: "Lê Hoàng Bảo Duy",
        phone: "0969777567",
        workStart: "13/09/2024",
        workStatus: "Đang hoạt động",
    });
    useEffect(() => {
        const workState = [
            { status: 'Đang hoạt động' },
            { status: 'Không hoạt động' }
        ];
        setStatusWork(workState);
    }, []);
    const getStatusWorking = (status) => {
        switch (status) {
            case 'Đang hoạt động':
                return 'working';
            case 'Không hoạt động':
                return 'not-working';
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Information updated successfully");
    }
    return (
        <div className="profile-form">
            <Sidebar />
            <div className="profile-form-container">
                <h2>THÔNG TIN CÁ NHÂN</h2>
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input type="email" name="email"
                        value={formData.email} onChange={handleChange}
                        disabled />
                    <label>Password</label>
                    <input type="password" name="password"
                        value={formData.password} onChange={handleChange}
                        disabled />
                    <label>Họ và tên</label>
                    <input type="text" name="fullName" value={formData.fullName}
                        onChange={handleChange} disabled />
                    <label>Số điện thoại</label>
                    <input type="text" name="phone" value={formData.phone}
                        onChange={handleChange} disabled />
                    <label>Ngày sinh</label>
                    <DatePicker className="date-picker" value="24/09/2024" selected={dob} dateFormat="dd/MM/yyyy" />
                    <label>Ngày nhận việc</label>
                    <input type="text" name="workStart" value={formData.workStart}
                        onChange={handleChange} disabled />
                    <label>Tình trạng làm việc</label>
                    <select name="workStatus" value={formData.workStatus}
                        onChange={handleChange}>
                        <option className={getStatusWorking(stateWork)} value="Hoạt động">Hoạt động</option>
                        <option value="Không hoạt động" className={getStatusWorking(stateWork)}>Không hoạt động</option>
                    </select>
                    <button type="submit">Chỉnh sửa</button>
                </form>
            </div>
        </div>
    )
}