import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Change Switch to Routes
import Dashboard from './admin/dashBoard/dashboard'; // Import your components
import OrderList from './admin/phanViecDonHang/OrderList';
import StaffManagement from './admin/StaffManager/StaffManagement';
import GraveView from './admin/graveView/GraveView';
import PayManagement from './admin/payManagement/payManagement';
import FeedbackManagement from './admin/feedbackManagement/FeedbackManagement';
import TaskList from './admin/taskList/TaskList';
import AccountManagement from './admin/accountManagement/accountManagement';
import TaskDescription from './admin/taskDescription/TaskDescription';
import GraveDetail from './admin/graveDetail/GraveDetail';
import OrderDetail from './admin/orderDetail/OrderDetai';
import AddTask from './admin/addTask/AddTask';
import ProfileForm from './admin/profileForm/ProfileForm';
function App() {
  return (
    <Router>
      <Routes> {/* Use Routes instead of Switch */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/danhsachaccount" element={<AccountManagement />} />
        <Route path="/danhsachdonhang" element={<OrderList />} />
        <Route path="/danhsachnhanvien" element={<StaffManagement />} />
        <Route path="/danhsachmo" element={<GraveView />} />
        <Route path="/danhSachCongViec" element={<TaskList />} />
        <Route path="/danhsachthanhtoan" element={<PayManagement />} />
        <Route path="/danhsachphannhoikhachhang" element={<FeedbackManagement />} />
        <Route path="/chitietcongviec" element={<TaskDescription />} />
        <Route path="/chitietmo" element={<GraveDetail />} />
        <Route path="/chitietdonhang" element={<OrderDetail />} />
        <Route path='/taoCongViec' element={<AddTask />} />
        <Route path='/suathongtin' element={<ProfileForm />} />
      </Routes>
    </Router>
  );
}

export default App;