import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Change Switch to Routes
import Dashboard from './admin/dashBoard/dashboard'; // Import your components
import OrderList from './admin/phanViecDonHang/OrderList';
import StaffManagement from './admin/StaffManager/StaffManagement';
import GraveView from './admin/graveView/GraveView';
import PayManagement from './admin/payManagement/payManagement';
import FeedbackManagement from './admin/feedbackManagement/FeedbackManagement';
import TaskList from './admin/taskList/TaskList';
function App() {
  return (
    <Router> 
      <Routes> {/* Use Routes instead of Switch */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/danhsachdonhang" element={<OrderList />} />
        <Route path="/danhsachnhanvien" element={<StaffManagement />} />
        <Route path="/danhsachmo" element={<GraveView />} />
        <Route path="/danhSachCongViec" element={<TaskList />} />
        <Route path="/danhsachthanhtoan" element={<PayManagement />} />
        <Route path="/danhsachphannhoikhachhang" element={<FeedbackManagement />} />
      </Routes>
    </Router>
  );
}

export default App;