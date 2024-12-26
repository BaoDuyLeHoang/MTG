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
import MaterialManagement from './pages/admin/materialManagement/materialManagement';
import Dashboard from "./pages/admin/dashBoard/dashboard";
import PayManagement from "./pages/admin/payManagement/payManagement";
import AccountManagement from "./pages/admin/accountManagement/accountManagement";
import TaskDescription from "./pages/admin/taskDescription/TaskDescription";
import AddTask from "./pages/admin/addTask/AddTask";
import ServiceManagement from "./pages/admin/serviceManagement/serviceManagement";
import LivestreamAdmin from './pages/admin/Livestream/LivestreamAdmin';

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
import AttendanceList from "./pages/manager/AttendanceList/AttendanceList";
import AttendanceDetail from "./pages/manager/AttendanceDetail/AttendanceDetail";
import CreateService from "./pages/manager/CreateService/CreateService";
import ScheduleAttendanceManager from "./pages/manager/ScheduleAttendanceManager/ScheduleAttendanceManager";
import BlogManager from './pages/manager/BlogManager/BlogManager';
import BlogDetailManager from './pages/manager/BlogDetail/BlogDetailManager';
import NotificationManagerList from './pages/manager/NotificationList/NotificationList';
import RequestManager from './pages/manager/RequestManager/RequestManager';
// Staff Components
import TaskList from "./pages/staff/OrderManagement/TaskList";
import BlogCreate from "./pages/staff/BlogCreate/BlogCreate";
import TaskDetails from './pages/staff/TaskDetail/TaskDetail';
import RecurringTasks from './pages/staff/RecurringTasks/RecurringTasks';
import NotificationList from './pages/staff/NotificationList/NotificationList';

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
import ScheduleManager from './pages/staff/ScheduleManager/ScheduleManager';
import ScheduleStaff from './pages/manager/ScheduleStaff/ScheduleStaff';
import ServiceList from './pages/manager/ServiceList/ServiceList';
import BlogDetail from './pages/customer/BlogDetailView/BlogDetail';
import BlogCategoryDetail from './pages/customer/BlogCategoryDetail/BlogCategoryDetail';
import Notifications from './pages/customer/NotificationList/NotificationList';
import Wallet from './pages/customer/Wallet/Wallet';
import MartyrList from './pages/customer/martyrList/martyrList';
import ScheduleService from './pages/customer/ScheduleService/ScheduleService';
import ScheduleServiceHistory from './pages/customer/ScheduleServiceHistory/ScheduleServiceHistory';
import ServiceDetail from './pages/customer/ServiceDetail/ServiceDetail';
import Livestream from './pages/Livestream/Livestream';
import RequestCustomer from './pages/customer/RequestCustomer/RequestCustomer';
import RequestHistory from './pages/customer/RequestHistory/RequestHistory';
import RequestDetail from './pages/customer/RequestHistory/RequestDetail';
import RequestDetailManager from './pages/manager/RequestDetailManager/RequestDetailManager';

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
          <Route path='/livestream' element={<Livestream/>}/>
          
          <Route path="/blog-view" element={<BlogView />} />
          <Route path="/blog/:blogId" element={<BlogDetail />} />
          <Route path="/create-service" element={<CreateService />} />
          <Route path="/service-list" element={<ServiceList />} />
          <Route path="/blog-category/:id" element={<BlogCategoryDetail />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/danh-sach-liet-si/:area" element={<MartyrList />} />
          <Route path="/schedule-service/:serviceId" element={<ProtectedRoute requiredRole={ROLES.CUSTOMER}><ScheduleService /></ProtectedRoute>} />
          <Route path="/schedule-service-history" element={<ProtectedRoute requiredRole={ROLES.CUSTOMER}><ScheduleServiceHistory /></ProtectedRoute>} />
          <Route path="/schedule-service-detail/:id" element={<ProtectedRoute requiredRole={ROLES.CUSTOMER}><ServiceDetail /></ProtectedRoute>} />
          <Route path="/request-customer" element={<ProtectedRoute requiredRole={ROLES.CUSTOMER}><RequestCustomer /></ProtectedRoute>} />
          <Route path="/request-customer-history" element={<ProtectedRoute requiredRole={ROLES.CUSTOMER}><RequestHistory /></ProtectedRoute>} />
          <Route path="/request-detail/:requestId" element={<ProtectedRoute requiredRole={ROLES.CUSTOMER}><RequestDetail /></ProtectedRoute>} />

          {/* Protected routes */}
          <Route path="/user" element={<ProtectedRoute requiredRole={ROLES.CUSTOMER}><HomePage /></ProtectedRoute>} />
          <Route path="/order-detail-cus/:orderId" element={<ProtectedRoute requiredRole={ROLES.CUSTOMER}><OrderDetailCus /></ProtectedRoute>} />
          <Route path="/order-history" element={<ProtectedRoute requiredRole={ROLES.CUSTOMER}><OrderHistory /></ProtectedRoute>} />
          <Route path="/user-profile" element={<ProtectedRoute requiredRole={ROLES.CUSTOMER}><UserProfile /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute requiredRole={ROLES.CUSTOMER}><Wallet /></ProtectedRoute>} />
          {/* Admin routes */}
          <Route path="/material-management" element={<ProtectedRoute requiredRole={ROLES.ADMIN}><MaterialManagement /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requiredRole={ROLES.ADMIN}><Dashboard /></ProtectedRoute>} />
          <Route path="/danhsachaccount" element={<ProtectedRoute requiredRole={ROLES.ADMIN}><AccountManagement /></ProtectedRoute>} />
          <Route path="/danhsachnhanvien" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><StaffManagement /></ProtectedRoute>} />
          <Route path="/danhsachmo" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><GraveView /></ProtectedRoute>} />
          <Route path="/danhSachCongViec" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><TaskList /></ProtectedRoute>} />
          <Route path="/danhsachthanhtoan" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><PayManagement /></ProtectedRoute>} />
          <Route path="/danhsachphannhoikhachhang" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><FeedbackManagement /></ProtectedRoute>} />
          <Route path="/chitietcongviec" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><TaskDescription /></ProtectedRoute>} />
          <Route path="/taoCongViec" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><AddTask /></ProtectedRoute>} />
          <Route path="/service-management" element={<ProtectedRoute requiredRole={ROLES.ADMIN}><ServiceManagement /></ProtectedRoute>} />
          <Route path="/admin/livestream" element={<LivestreamAdmin />} />
          {/* Manager routes */}
          <Route path="/manager" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><OrderManagementManager /></ProtectedRoute>} />
          <Route path="/schedule-manager" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><ScheduleAttendanceManager /></ProtectedRoute>} />
          <Route path="/attendance-list/:slotId/:date" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><AttendanceList /></ProtectedRoute>} />
          <Route path="/attendance-detail/:attendanceId" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><AttendanceDetail /></ProtectedRoute>} />
          <Route path="/danhsachdonhang" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><OrderManagementManager /></ProtectedRoute>} />
          <Route path="/danhsachdonhang/:orderId" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><OrderDetail /></ProtectedRoute>} />
          <Route path="/profileManager" element={<ProtectedRoute requiredRole={[ROLES.MANAGER]}><ProfileStaff /></ProtectedRoute>} />
          <Route path="/creategrave" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><CreateGrave /></ProtectedRoute>} />
          <Route path="/chitietmoquanly/:martyrId" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><GraveDetailManager /></ProtectedRoute>} />
          <Route path="/blog-manager" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><BlogManager /></ProtectedRoute>} />
          <Route path="/blog-detail-manager/:blogId" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><BlogDetailManager /></ProtectedRoute>} />
          <Route path="/notification-manager" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><NotificationManagerList /></ProtectedRoute>} />
          <Route path="/task-manager" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><AttendanceManager /></ProtectedRoute>} />
          <Route path="/request-manager" element={<ProtectedRoute requiredRole={ROLES.MANAGER}><RequestManager /></ProtectedRoute>} />
          <Route path="/manager/request-detail/:requestId" element={<RequestDetailManager />} />
          {/* Staff routes */}
          <Route path="/staff" element={<ProtectedRoute requiredRole={ROLES.STAFF}><ScheduleManager /></ProtectedRoute>} />
          <Route path="/danhsachdonhang-staff" element={<ProtectedRoute requiredRole={ROLES.STAFF}><TaskList /></ProtectedRoute>} />
          <Route path="/task-detail/:accountId/:scheduleDetailId" element={<ProtectedRoute requiredRole={ROLES.STAFF}><TaskDetails /></ProtectedRoute>} />
          <Route path="/profilestaff-staff" element={<ProtectedRoute requiredRole={[ROLES.STAFF]}><ProfileStaff /></ProtectedRoute>} />
          <Route path="/blog-management" element={<ProtectedRoute requiredRole={ROLES.STAFF}><BlogManagement /></ProtectedRoute>} />
          <Route path="/blog-create" element={<ProtectedRoute requiredRole={ROLES.STAFF}><BlogCreate /></ProtectedRoute>} />
          <Route path="/schedule-staff" element={<ProtectedRoute requiredRole={ROLES.STAFF}><ScheduleManager /></ProtectedRoute>} />
          <Route path="/recurring-tasks" element={<ProtectedRoute requiredRole={ROLES.STAFF}><RecurringTasks /></ProtectedRoute>} />
          <Route path="/notifications-staff" element={<ProtectedRoute requiredRole={ROLES.STAFF}><NotificationList /></ProtectedRoute>} />

          

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
