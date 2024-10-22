import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getServiceDetails, getServicesByCategory, getGravesByCustomerCode, addToCart } from "../../APIcontroller/API";
import "./ServiceDetailPage.css";
import Header from "../../components/Header/header";
import { useAuth } from "../../context/AuthContext";

const ServiceDetailPage = () => {
  const [service, setService] = useState(null);
  const [otherServices, setOtherServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [graveOptions, setGraveOptions] = useState([]);
  const [selectedGrave, setSelectedGrave] = useState("");
  const { serviceId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const details = await getServiceDetails(serviceId);
        setService(details);

        // Log the entire user object
        console.log("User object:", user);
        
        // Log the customer code (if it exists)
        console.log("Customer Code:", user?.customerCode);

        // If customerCode doesn't exist, log all keys of the user object
        if (!user?.customerCode) {
          console.log("User object keys:", Object.keys(user || {}));
        }

        // Fetch grave options for the customer
        if (user && user.customerCode) {
          const graves = await getGravesByCustomerCode(user.customerCode);
          console.log("Graves received:", graves); // Keep this for debugging

          setGraveOptions(graves.map(grave => ({
            value: grave.martyrId,
            label: grave.matyrGraveInformations[0]?.name || grave.martyrCode || "Unknown"
          })));
        } else {
          console.log("Unable to fetch graves: No customer code found in the token");
        }

        // Fetch other services from the same category
        if (details.categoryId) {
          const categoryServices = await getServicesByCategory(details.categoryId);
          // Filter out the current service from the list
          const filteredServices = categoryServices.filter(s => s.id !== serviceId);
          // Randomly select up to 4 services
          const randomServices = shuffleArray(filteredServices).slice(0, 4);
          setOtherServices(randomServices);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load service details. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceId, user]);

  const handleGraveChange = (event) => {
    setSelectedGrave(event.target.value);
  };

  const handleAddToCart = async () => {
    if (!selectedGrave) {
      alert("Vui lòng chọn mộ trước khi thêm vào giỏ hàng");
      return;
    }

    if (!user || !user.accountId) {
      alert("Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.");
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
      
      
      // Navigate to the checkout page with the cart item
     
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại sau.");
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
                <td>{item.price}</td>
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
              <td>{service.price}</td>
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