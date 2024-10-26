import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getServiceDetails, getServicesByCategory, getGravesByCustomerCode, addToCart } from "../../APIcontroller/API";
import "./ServiceDetailPage.css";
import Header from "../../components/Header/header";
import { useAuth } from "../../context/AuthContext";
import AlertMessage from "../../components/AlertMessage/AlertMessage";

const ServiceDetailPage = () => {
  const [service, setService] = useState(null);
  const [otherServices, setOtherServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [graveOptions, setGraveOptions] = useState([]);
  const [selectedGrave, setSelectedGrave] = useState("");
  const { serviceId } = useParams();
  const { user, checkSession } = useAuth();
  const navigate = useNavigate();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (!checkSession()) {
          setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          setLoading(false);
          navigate('/login');
          return;
        }

        const token = localStorage.getItem('accessToken');
        console.log("Current auth token:", token);

        if (!token) {
          console.error("No token found in localStorage");
          setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          setLoading(false);
          navigate('/login');
          return;
        }

        const details = await getServiceDetails(serviceId);
        setService(details);

        console.log("User object:", user);
        console.log("Customer Code:", user?.customerCode);

        if (user && user.customerCode) {
          try {
            const graves = await getGravesByCustomerCode(user.customerCode, token);
            console.log("Graves received:", graves);

            setGraveOptions(graves.map(grave => ({
              value: grave.martyrId,
              label: grave.matyrGraveInformations[0]?.name || grave.martyrCode || "Unknown"
            })));
          } catch (graveError) {
            console.error("Full error object:", graveError);
            if (graveError.response && graveError.response.status === 401) {
              console.error("Unauthorized access when fetching graves. User might need to re-authenticate.");
              setError("Phiên đăng nhập đã hết hạn hoặc không có quyền truy cập. Vui lòng đăng nhập lại.");
              navigate('/login');
            } else {
              console.error("Error fetching graves:", graveError);
              setError("Không thể tải thông tin mộ. Vui lòng thử lại sau.");
            }
          }
        } else {
          console.error("No customer code found for the user");
          setError("Không tìm thấy mã khách hàng. Vui lòng đăng nhập lại.");
        }

        // Fetch other services from the same category
        if (details.categoryId) {
          const categoryServices = await getServicesByCategory(details.categoryId);
          const filteredServices = categoryServices.filter(s => s.id !== serviceId);
          const randomServices = shuffleArray(filteredServices).slice(0, 4);
          setOtherServices(randomServices);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Không thể tải thông tin dịch vụ. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceId, user, navigate, checkSession]);

  const handleGraveChange = (event) => {
    setSelectedGrave(event.target.value);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const showAlert = (message, severity = "info") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleAddToCart = async () => {
    if (!selectedGrave) {
      showAlert("Vui lòng chọn mộ trước khi thêm vào giỏ hàng", "warning");
      return;
    }

    if (!user || !user.accountId) {
      showAlert("Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.", "error");
      return;
    }

    try {
      console.log('User:', user);
      console.log('Selected Grave:', selectedGrave);
      console.log('Service:', service);

      const cartItem = {
        accountId: user.accountId,
        serviceId: serviceId,
        martyrId: parseInt(selectedGrave, 10) // Convert to number if necessary
      };

      console.log('Cart Item to be sent:', cartItem);

      await addToCart(cartItem);
      showAlert("Đã thêm vào giỏ hàng thành công", "success");
      
      // Navigate to the checkout page with the cart item
     
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      showAlert("Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại sau.", "error");
    }
  };

  // Add this helper function at the top of your component or in a separate utils file
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!service) {
    return <div>No service details found.</div>;
  }

  return (
    <>
      <Header />
      <AlertMessage
        open={alertOpen}
        handleClose={handleAlertClose}
        severity={alertSeverity}
        message={alertMessage}
      />
      <div className="container">
        <img src={service.image} alt={service.serviceName} className="header-image" />
        <h1 className="service-title">{service.serviceName}</h1>
        <p className="description">{service.description}</p>

        <h2 className="section-title">Chọn mộ</h2>
        <select 
          className="grave-select" 
          value={selectedGrave} 
          onChange={handleGraveChange}
        >
          <option value="">Chọn tên mộ</option>
          {graveOptions && graveOptions.map((grave) => (
            <option key={grave.value} value={grave.value}>
              {grave.label}
            </option>
          ))}
        </select>

        <h2 className="section-title">Vật liệu thực hiện</h2>
        <table className="pricing-table">
          <thead>
            <tr>
              <th>Tên vật liệu</th>
              <th>Mô tả</th>
              <th>Giá tiền</th>
            </tr>
          </thead>
          <tbody>
            {service.materials && service.materials.map((item, index) => (
              <tr key={index}>
                <td>{item.materialName}</td>
                <td>{item.description}</td>
                <td>{item.price} đ</td>
              </tr>
            ))}
            <tr className="separator-row">
              <td colSpan={3}></td>
            </tr>
            <tr className="total-row">
              <td colSpan={2}>Tiền công</td>
              <td>{service.laborCost}</td>
            </tr>
            <tr>
              <td colSpan={2}>Tổng giá tiền</td>
              <td>{service.price} đ</td>
            </tr>
          </tbody>
        </table>
        <button className="add-to-cart" onClick={handleAddToCart}>
          Thêm vào giỏ hàng
        </button>

        <h2 className="section-title">Dịch vụ khác</h2>
        <div className="other-services">
          {otherServices.map((otherService) => (
            <div key={otherService.id} className="service-card">
              <img src={otherService.image} alt={otherService.serviceName} />
              <h3>{otherService.serviceName}</h3>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ServiceDetailPage;
