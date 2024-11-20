import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../../components/Header/header";
import ServiceCard from "../../../components/ServiceCard/ServiceCard";
import SellServiceCard from "../../../components/SellServiceCard/SellServiceCard";
import Loading from "../../../components/Loading/Loading";
import "./ServicePage.css";
import { getServices, getServicesByCategory } from "../../../APIcontroller/API";

const ServicePage = () => {
  const [services, setServices] = useState([]);
  const [categoryServices, setCategoryServices] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Add scroll handler function
  const scrollToCategory = (categoryName) => {
    const element = document.getElementById(`category-${categoryName}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const servicesData = await getServices();
        setServices(servicesData);

        // Fetch services for each category
        const categoryServicesData = {};
        for (const category of servicesData) {
          const categoryServices = await getServicesByCategory(
            category.categoryId
          );
          categoryServicesData[category.categoryId] = categoryServices;
        }
        setCategoryServices(categoryServicesData);
        console.log(categoryServicesData);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div>
      <Header />
      <div className="intro-container">
        <div className="quote-wrapper">
          <h1 className="title">Các loại dịch vụ của chúng tôi</h1>
          <p className="quote">
            "Chăm sóc nơi an nghỉ, gửi gắm yêu thương. Để mỗi khi bạn đến thăm,
            là một hành trình bình yên, nơi ký ức mãi mãi còn trong tim. Chúng
            tôi không chỉ quản lý, mà còn vun đắp sự yên bình."
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div
              onClick={() => scrollToCategory(service.categoryName)}
              style={{ cursor: "pointer" }}
              key={index}
            >
              <ServiceCard
                categoryName={service.categoryName}
                description={service.description}
                urlImageCategory={service.urlImageCategory}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="service-container" style={{ position: 'relative', minHeight: '400px' }}>
        <h1>Dịch vụ đang có sẵn</h1>
        {isLoading ? (
          <Loading 
            text="Đang tải thông tin dịch vụ..." 
            color="#4F46E5"
            size={64}
          />
        ) : (
          services.map((category, index) => (
            <div
              key={index}
              className="change-planner-service"
              id={`category-${category.categoryName}`}
            >
              <h2>{category.categoryName}</h2>
              <div className="sell-service-grid">
                {categoryServices[category.categoryId]?.map(
                  (service, serviceIndex) => (
                    <Link
                      key={serviceIndex}
                      to={`/chitietdichvu/${service.serviceId}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <SellServiceCard
                        imagePath={service.imagePath}
                        serviceName={service.serviceName}
                        price={service.price}
                      />
                    </Link>
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServicePage;
