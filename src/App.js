import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";


// Context and Utils
import { AuthProvider } from "./context/AuthContext";
import { ROLES } from "./utils/auth";

// Common Components
import { ProtectedRoute } from "./components/ProtectedRoute";
import SessionCheck from "./components/SessionCheck";
import SearchGraveInterface from './components/SearchGraveInterface/SearchGraveInterface';

// Admin Components
import Dashboard from "./pages/admin/dashBoard/dashboard";
import ServiceManagement from './pages/admin/serviceManagement/serviceManagement';
import PayManagement from "./pages/admin/payManagement/payManagement";
import AccountManagement from "./pages/admin/accountManagement/accountManagement";
import TaskDescription from "./pages/admin/taskDescription/TaskDescription";
import AddTask from "./pages/admin/addTask/AddTask";

// Manager Components
import OrderManagementManager from "./pages/manager/OrderManagement/OrderManagement";
import OrderDetail from "./pages/manager/orderDetail/OrderDetai";
  import GraveView from "./pages/manager/graveView/GraveView";
import FeedbackManagement from "./pages/manager/feedbackManagement/FeedbackManagement";
import StaffManagement from "./pages/manager/StaffManager/StaffManagement";
import ProfileStaff from "./pages/manager/ProfileStaff/ProfileStaff";
import CreateGrave from "./pages/manager/CreateGrave/CreateGrave";
import GraveDetailManager from "./pages/manager/GraveDetailManager/GraveDetailManager";
import AttendanceManager from "./pages/manager/AttendanceManager/AttendanceManager";
import CreateService from "./pages/manager/CreateService/CreateService";
// Staff Components
import TaskList from "./pages/staff/OrderManagement/TaskList";
  import BlogCreate from "./pages/staff/BlogCreate/BlogCreate";
import TaskDetails from './pages/staff/TaskDetail/TaskDetail';

// Customer Components
import HomePage from "./pages/customer/homePage/homePage";
import MyGraveDetail from "./pages/customer/MyGraveDetail/MyGraveDetail";
    import ServicePage from "./pages/customer/ServicePage/ServicePage";
import CheckOut from "./pages/customer/CheckOutPage/CheckOut";
import CartPage from "./pages/customer/CartPage/CartPage";
import ServiceDetailPage from "./pages/customer/ServiceDetailPage/ServiceDetailPage";
import Login from "./pages/customer/Login/Login";
import CheckoutSuccessPage from './pages/customer/CheckOutSuccessPage/checkoutSuccessPage';
import CheckoutFailPage from './pages/customer/CheckOutFailPage/checkoutFailPage';
import OrderHistory from './pages/customer/OrderHistory/OrderHistory';
import SearchResult from './pages/customer/SearchResult/SearchResult';
import ServiceListing from './pages/customer/ServiceListing/ServiceListing';
import Register from './pages/customer/Register/Register';
import RelativeGrave from './pages/customer/RelaticeGrave/RelativeGrave';
import OrderDetailCus from './pages/customer/OrderDetailCus/OrderDetailCus';
import UserProfile from './pages/customer/UserProfile/UserProfile';
import BlogView from './pages/customer/BlogView/BlogView';
import BlogManagement from './pages/staff/BlogManagement/BlogManagement';
import BlogManager from './pages/manager/BlogManager/BlogManager';
import ScheduleManager from './pages/staff/ScheduleManager/ScheduleManager';
import ScheduleStaff from './pages/manager/ScheduleStaff/ScheduleStaff';
import ServiceList from './pages/manager/ServiceList/ServiceList';
import MaterialManagement from './pages/admin/materialManagement/materialManagement';
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
          
          <Route path="/blog-view" element={<BlogView />} />
          <Route path="/create-service" element={<CreateService />} />
          <Route path="/service-list" element={<ServiceList />} />


          
          {/* Protected routes */}
          <Route path="/user" element={<ProtectedRoute requiredRole={ROLES.CUSTOMER}><HomePage /></ProtectedRoute>} />
          <Route path="/order-detail-cus/:orderId" element={<ProtectedRoute requiredRole={ROLES.CUSTOMER}><OrderDetailCus /></ProtectedRoute>} />
          <Route path="/order-history" element={<ProtectedRoute requiredRole={ROLES.CUSTOMER}><OrderHistory /></ProtectedRoute>} />
          <Route path="/user-profile" element={<ProtectedRoute requiredRole={ROLES.CUSTOMER}><UserProfile /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute requiredRole={ROLES.ADMIN}><Dashboard /></ProtectedRoute>} />
          <Route path="/service-management" element={<ProtectedRoute requiredRole={ROLES.ADMIN}><ServiceManagement /></ProtectedRoute>} />
          <Route path="/material-management" element={<ProtectedRoute requiredRole={ROLES.ADMIN}><MaterialManagement /></ProtectedRoute>} />
          <Route path="/danhsachaccount" element={<ProtectedRoute requiredRole={ROLES.ADMIN}><AccountManagement /></ProtectedRoute>} />
          <Route path="/danhsachnhanvien" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><StaffManagement /></ProtectedRoute>} />
          <Route path="/danhsachmo" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><GraveView /></ProtectedRoute>} />
          <Route path="/danhSachCongViec" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><TaskList /></ProtectedRoute>} />
          <Route path="/danhsachthanhtoan" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><PayManagement /></ProtectedRoute>} />
          <Route path="/danhsachphannhoikhachhang" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><FeedbackManagement /></ProtectedRoute>} />
          <Route path="/chitietcongviec" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><TaskDescription /></ProtectedRoute>} />
          <Route path="/taoCongViec" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><AddTask /></ProtectedRoute>} />
          

          {/* Manager routes */}
          <Route path="/manager" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><OrderManagementManager /></ProtectedRoute>} />
          <Route path="/schedule-manager" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><ScheduleStaff /></ProtectedRoute>} />
          <Route path="/danhsachdonhang" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><OrderManagementManager /></ProtectedRoute>} />
          <Route path="/danhsachdonhang/:orderId" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><OrderDetail /></ProtectedRoute>} />
          <Route path="/profilestaff" element={<ProtectedRoute requiredRole={[ROLES.MANAGER]}><ProfileStaff /></ProtectedRoute>} />
          <Route path="/creategrave" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><CreateGrave /></ProtectedRoute>} />
          <Route path="/chitietmoquanly/:martyrId" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><GraveDetailManager /></ProtectedRoute>} />
          <Route path="/blog-manager" element={<BlogManager />} />
          <Route path="/attendance-manager" element={<AttendanceManager />} />
          
          {/* Staff routes */}
          <Route path="/staff" element={<ProtectedRoute requiredRole={ROLES.STAFF}><ScheduleManager /></ProtectedRoute>} />
          <Route path="/danhsachdonhang-staff" element={<ProtectedRoute requiredRole={ROLES.STAFF}><TaskList /></ProtectedRoute>} />
          <Route path="/task-detail/:accountId/:scheduleDetailId" element={<ProtectedRoute requiredRole={ROLES.STAFF}><TaskDetails /></ProtectedRoute>} />
          <Route path="/profilestaff-staff" element={<ProtectedRoute requiredRole={[ROLES.STAFF]}><ProfileStaff /></ProtectedRoute>} />
          <Route path="/blog-management" element={<ProtectedRoute requiredRole={ROLES.STAFF}><BlogManagement /></ProtectedRoute>} />
          <Route path="/blog-create" element={<ProtectedRoute requiredRole={ROLES.STAFF}><BlogCreate /></ProtectedRoute>} />
          <Route path="/schedule-staff" element={<ScheduleManager />} />

          

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
