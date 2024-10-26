import React from "react";
import "./RelativeGrave.css";
import Header from "../../components/Header/header";

const RelativeGrave = () => {
  const graves = [
    {
      id: 1,
      martyrName: "Nguyễn Văn An",
      dateOfMartyrdom: "2023-05-15",
      graveLocation: "Khu A, Hàng 3, Lô 12",
      familyRelation: "Cha",
      status: "Đã chăm sóc",
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/mtg-capstone-2024.appspot.com/o/grave_images%2FPhandinhgiot.jpg?alt=media&token=8e252c1f-69c2-464a-a974-37860507cfb3",
    },
    {
      id: 2,
      martyrName: "Trần Văn Bình",
      dateOfMartyrdom: "2023-06-20",
      graveLocation: "Khu B, Hàng 1, Lô 8",
      familyRelation: "Anh trai",
      status: "Cần chăm sóc",
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/mtg-capstone-2024.appspot.com/o/grave_images%2FPhandinhgiot.jpg?alt=media&token=8e252c1f-69c2-464a-a974-37860507cfb3",
    },
  ];

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  return (
    <div className="relative-grave-container">
      <Header />

      <div className="relative-grave-list">
        {graves.map((grave) => (
          <div key={grave.id} className="relative-grave-card">
            <div className="relative-grave-image-container">
              <img
                src={grave.imageUrl}
                alt={`Mộ của ${grave.martyrName}`}
                className="relative-grave-image"
              />
            </div>
            <div className="relative-grave-info">
              <h2 className="relative-grave-martyr-name">{grave.martyrName}</h2>
              <div className="relative-grave-info-group">
                <span className="relative-grave-label">Ngày hy sinh:</span>
                <span>{formatDate(grave.dateOfMartyrdom)}</span>
              </div>
              <div className="relative-grave-info-group">
                <span className="relative-grave-label">Vị trí:</span>
                <span>{grave.graveLocation}</span>
              </div>
              <div className="relative-grave-info-group">
                <span className="relative-grave-label">Tình trạng:</span>
                <span
                  className={`relative-grave-status-badge ${
                    grave.status === "Đã chăm sóc"
                      ? "relative-grave-status-maintained"
                      : "relative-grave-status-needs-maintenance"
                  }`}
                >
                  {grave.status}
                </span>
              </div>
            </div>
            <div className="relative-grave-button-group">
              <button className="relative-grave-button relative-grave-button-primary">Xem Chi Tiết</button>
              <button className="relative-grave-button relative-grave-button-secondary">Đăng Ký Thăm Viếng</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelativeGrave;
