import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ROLES } from "./utils/auth";
import SessionCheck from "./components/SessionCheck";

// Admin imports
import Dashboard from "./admin/dashBoard/dashboard";


import PayManagement from "./admin/payManagement/payManagement";


import AccountManagement from "./admin/accountManagement/accountManagement";
import TaskDescription from "./admin/taskDescription/TaskDescription";

import AddTask from "./admin/addTask/AddTask";

// Manager imports
import OrderManagementManager from "./manager/OrderManagement/OrderManagement";
import OrderDetail from "./manager/orderDetail/OrderDetai";
import GraveView from "./manager/graveView/GraveView";
import FeedbackManagement from "./manager/feedbackManagement/FeedbackManagement";
import GraveDetail from "./manager/graveDetail/GraveDetail";
import StaffManagement from "./manager/StaffManager/StaffManagement";
// Staff imports
import TaskList from "./staff/OrderManagement/TaskList";

// Customer imports
import HomePage from "./customer/homePage/homePage";
import MyGraveDetail from "./customer/MyGraveDetail/MyGraveDetail";
import ServicePage from "./customer/ServicePage/ServicePage";
import CheckOut from "./customer/CheckOutPage/CheckOut";
import CartPage from "./customer/CartPage/CartPage";
import ServiceDetailPage from "./customer/ServiceDetailPage/ServiceDetailPage";
import Login from "./customer/Login/Login";
import SearchGraveInterface from './components/SearchGraveInterface/SearchGraveInterface';
import CheckoutSuccessPage from './customer/CheckOutSuccessPage/checkoutSuccessPage';
import CheckoutFailPage from './customer/CheckOutFailPage/checkoutFailPage';
import TaskDetails from './staff/TaskDetail/TaskDetail';
import OrderHistory from './customer/OrderHistory/OrderHistory';
import SearchResult from './customer/SearchResult/SearchResult';
import ServiceListing from './customer/ServiceListing/ServiceListing';
import Register from './customer/Register/Register';
import RelativeGrave from './customer/RelaticeGrave/RelativeGrave';
import OrderDetailCus from './customer/OrderDetailCus/OrderDetailCus';
function AppContent() {
  const navigate = useNavigate();

  return (
    <AuthProvider navigate={navigate}>
      <SessionCheck>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/tim-kiem-mo" element={<SearchGraveInterface />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/dichvu" element={<ServicePage />} />
          <Route path="/chitietdichvu/:serviceId" element={<ServiceDetailPage />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/checkout-fail" element={<CheckoutFailPage />} />
          <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
          <Route path="/search-results" element={<SearchResult />} />
          <Route path="/chitietmo/:martyrId" element={<MyGraveDetail />} />
          <Route path="/dichvutheoloai" element={<ServiceListing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/relative-grave" element={<RelativeGrave />} />
          {/* Protected routes */}
          <Route path="/user" element={<ProtectedRoute requiredRole={ROLES.CUSTOMER}><HomePage /></ProtectedRoute>} />
          <Route path="/order-detail-cus/:orderId" element={<ProtectedRoute requiredRole={ROLES.CUSTOMER}><OrderDetailCus /></ProtectedRoute>} />
          <Route path="/order-history" element={<ProtectedRoute requiredRole={ROLES.CUSTOMER}><OrderHistory /></ProtectedRoute>} />
          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute requiredRole={ROLES.ADMIN}><Dashboard /></ProtectedRoute>} />
          <Route path="/danhsachaccount" element={<ProtectedRoute requiredRole={ROLES.ADMIN}><AccountManagement /></ProtectedRoute>} />
          <Route path="/danhsachnhanvien" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><StaffManagement /></ProtectedRoute>} />
          <Route path="/danhsachmo" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><GraveView /></ProtectedRoute>} />
          <Route path="/danhSachCongViec" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><TaskList /></ProtectedRoute>} />
          <Route path="/danhsachthanhtoan" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><PayManagement /></ProtectedRoute>} />
          <Route path="/danhsachphannhoikhachhang" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><FeedbackManagement /></ProtectedRoute>} />
          <Route path="/chitietcongviec" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><TaskDescription /></ProtectedRoute>} />
          <Route path="/chitietmo" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><GraveDetail /></ProtectedRoute>} />
          <Route path="/taoCongViec" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><AddTask /></ProtectedRoute>} />
          

          {/* Manager routes */}
          <Route path="/manager" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><OrderManagementManager /></ProtectedRoute>} />
          <Route path="/danhsachdonhang" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><OrderManagementManager /></ProtectedRoute>} />
          <Route path="/danhsachdonhang/:orderId" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><OrderDetail /></ProtectedRoute>} />

          {/* Staff routes */}
          <Route path="/staff" element={<ProtectedRoute requiredRole={ROLES.STAFF}><TaskList /></ProtectedRoute>} />
          <Route path="/task-detail/:taskId" element={<ProtectedRoute requiredRole={ROLES.STAFF}><TaskDetails /></ProtectedRoute>} />
        </Routes>
      </SessionCheck>
    </AuthProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
