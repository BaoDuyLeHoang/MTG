import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getServiceDetails, getServicesByCategory } from "../../../APIcontroller/API";
import "./ServiceDetailPage.css";
import Header from "../../../components/Header/header";

const ServiceDetailPage = () => {
  const [service, setService] = useState(null);
  const [otherServices, setOtherServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { serviceId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const details = await getServiceDetails(serviceId);
        setService(details);

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
  }, [serviceId]);

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
        <img src={service.imagePath} alt={service.serviceName} className="header-image" />
        <h1 className="service-title">{service.serviceName}</h1>
        <p className="description">{service.description}</p>

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
              <td>{service.wage} đ</td>
            </tr>
            <tr>
              <td colSpan={2}>Tổng giá tiền</td>
              <td>{service.price} đ</td>
            </tr>
          </tbody>
        </table>
      

        <h2 className="section-title">Dịch vụ khác</h2>
        <div className="other-services">
          {otherServices.map((otherService) => (
            <Link 
              key={otherService.id} 
              to={`/chitietdichvu/${otherService.serviceId}`} 
              className="service-card-link"
            >
              <div className="service-card">
                <img src={otherService.imagePath} alt={otherService.serviceName} />
                <h3>{otherService.serviceName}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default ServiceDetailPage;
