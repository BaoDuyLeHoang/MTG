import Sidebar from "../../components/Sidebar/sideBar"
import '../orderDetail/OrderDetail.css';
import pl from '../../assets/logo/cay-bach1.jpg';
import DatePicker from "react-datepicker";
import { useState } from "react";
const OrderDetail = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    return (
        <div className="order-detail-container">
            <Sidebar />
            <div className="order-admin-full">
                <div className="header-container">
                    <div className="section-name">Mộ phần</div>
                    <div className="section-details">
                        Họ và Tên: Chu Ngọc Quang Vinh ( K07 - 23 )
                    </div>
                </div>
                <div className="order-section">
                    <div className="order-detail-header">
                        <span>Dịch vụ:</span>
                        <span>Số lượng</span>
                        <span>Thời gian hoàn thành</span>
                        <span>Trạng thái</span>
                        <span>Nhân viên trong khu vực</span>
                    </div>
                    <div className="order-detail-row">
                        <div className="service-details">
                            <img src={pl} className="service-img" />
                            <div className="service-text">
                                <p>Thay cây ở mộ</p>
                                <p>Loại: Cây bách</p>
                            </div>
                        </div>
                        <div className="quantity">2</div>
                        <div className="completion-time">
                            <DatePicker id="date-picker" selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                dateFormat="dd/MM/yyyy" className="custom-input"
                                placeholderText="21/09/2024" />
                        </div>
                        <div className="status">
                            <span className="status-pending">Đang xử lý</span>
                        </div>
                        <ul id="menu">
                            <ul id="menu">
                                <li>
                                    <a style={{ marginRight: '120px' }} href="javascript:void(0)">
                                        Nhân viên
                                        <span class="arrow arrow-down"></span>
                                    </a>
                                    <ul class="dropdown_menu">
                                        <li>
                                            <a href="javascript:void(0)">Nguyễn Công Trứ</a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0)">Phạm Thành Trung</a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0)">Trần Công Hãn</a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </ul>
                    </div>
                    <div className="action">
                        <button className="deliver-button">Bàn giao</button>
                    </div>
                </div>
                <div className="order-summary">
                    <div className="order-summary-detail">
                        <div className="summary-order">
                            <h2>CẬP NHẬT TÌNH TRẠNG ĐƠN HÀNG</h2>
                            <p>Đơn hàng đã được tạo (12:15 12/09/2024)</p>
                            <p>Đơn hàng đã được xác nhận (15:20  12/09/2024)</p>
                        </div>
                    </div>
                    <div className="summary-detail">
                        <p style={{ textAlign: 'right', marginTop: '-110px' }}>Đơn giá: 150.000đ</p>
                        <p style={{ textAlign: 'right', marginTop: '0px' }}>Số lượng: 2</p>
                        <p style={{ textAlign: 'right', marginTop: '4px' }}>Tổng tiền hàng: 300.000đ</p>
                        <p style={{ textAlign: 'right', marginTop: '8px' }}>Tổng cộng giảm giá: -0đ</p>
                        <p style={{ textAlign: 'right', marginTop: '12px' }}>Tổng thanh toán: 300.000đ</p>
                    </div>
                </div>
            </div>
        </div >
    )
}
export default OrderDetail;