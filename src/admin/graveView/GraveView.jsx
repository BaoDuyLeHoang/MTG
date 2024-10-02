import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/Sidebar/sideBar";
import "../graveView/GraveView.css";
import { Link } from "react-router-dom";

export default function GraveView() {
  const [graves, setGraves] = useState([]);

  useEffect(() => {
    fetchGraves();
  }, []);

  const fetchGraves = async () => {
    try {
      const response = await fetch('http://localhost:5244/api/MartyrGrave');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setGraves(data);
    } catch (error) {
      console.error('Error fetching graves:', error);
    }
  };
  
  return (
    <div className="grave-view">
      <Sidebar />
      <aside className="grave-view-list">
        <h1>Danh sách mộ</h1>
        <div className="search-fillers">
          <input type="search" placeholder="Hinted search text" />
          <button type="button">Thêm mộ</button>
        </div>
        <table>
          <thead>
            <tr>
              <td>Mã mộ</td>
              <td>Tên mộ</td>
              <td>Vị trí mộ</td>
              <td>Tên thân nhân</td>
              <td>SĐT người thân</td>
              <td>Tình trạng mộ</td>
              <td>Người quản lý</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {graves.map((grave, index) => (
              <tr key={index}>
                <td>{grave.code}</td>
                <td>{grave.name}</td>
                <td>{grave.location}</td>
                <td>{grave.relativeName}</td>
                <td>{grave.relativePhone}</td>
                <td>{grave.status}</td>
                <td>{grave.manager}</td>
                <td>
                  <Link to={`/chitietmo/${grave.id}`}>
                    <button>Chi tiết</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <span>&lt;</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>&gt;</span>
        </div>
      </aside>
    </div>
  );
}
