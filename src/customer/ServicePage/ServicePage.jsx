import React, { useState } from "react";
import Header from "../../components/Header/header";
import ServiceCard from "../../components/ServiceCard/ServiceCard";
import SellServiceCard from "../../components/SellServiceCard/SellServiceCard";
import "./ServicePage.css";
import logo from "../../assets/logo/logo-giao-duc-an-nhien.png";

const ServicePage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const services = [
    {
      title: "Thay đổi ngoại cảnh",
      description: "Tu sửa, dọn dẹp và làm đẹp khu mộ theo yêu cầu",
    },
    {
      title: "Bảo dưỡng mộ",
      description: "Chăm sóc và bảo dưỡng mộ phần theo yêu cầu",
    },
    {
      title: "Dịch vụ lễ cúng",
      description: "Cúng các ngày đặc biệt trong năm",
    },
    {
      title: "Mộ phần",
      description: "Xây dựng thiết kế mộ",
    },
  ];

  const sellServices = [
    { title: "Service 1", price: "$10.00", image: logo },
    { title: "Service 2", price: "$15.00", image: logo },
    { title: "Service 3", price: "$20.00", image: logo },
    { title: "Service 4", price: "$25.00", image: logo },
    // Add more services as needed
  ];

  const changePlannerServices = [
    {
      title: "Thay đổi ngoại cảnh",
      services: [
        { title: "Service 1", price: "$10.00", image: logo },
        { title: "Service 2", price: "$15.00", image: logo },
        { title: "Service 3", price: "$20.00", image: logo },
        { title: "Service 4", price: "$25.00", image: logo },
        { title: "Service 10", price: "$25.00", image: logo },
      ],
    },
    {
      title: "Bảo dưỡng mộ",
      services: [
        { title: "Service 5", price: "$30.00", image: logo },
        { title: "Service 6", price: "$35.00", image: logo },
        { title: "Service 7", price: "$40.00", image: logo },
        { title: "Service 8", price: "$45.00", image: logo },
        { title: "Service 11", price: "$25.00", image: logo },
      ],
    },
    // Add more change planner services as needed
  ];

  return (
    <div>
      <Header />
      <div className="intro-container">
        <div className="quote-wrapper">
          <h1 className="title">Dịch vụ của chúng tôi</h1>
          <p className="quote">
            "Chăm sóc nơi an nghỉ, gửi gắm yêu thương. Để mỗi khi bạn đến thăm,
            là một hành trình bình yên, nơi ký ức mãi mãi còn trong tim. Chúng
            tôi không chỉ quản lý, mà còn vun đắp sự yên bình."
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              imageSrc={`service-${index + 1}.jpg`}
            />
          ))}
        </div>
      </div>
      <div className="service-container">
        <h1>Dich vu dang co san</h1>
        {changePlannerServices.map((changePlannerService, index) => (
          <div key={index} className="change-planner-service">
            <h2>{changePlannerService.title}</h2>
            <div className="sell-service-grid">
              {changePlannerService.services.map((service, serviceIndex) => (
                <SellServiceCard
                  key={serviceIndex}
                  image={service.image}
                  title={service.title}
                  price={service.price}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicePage;
