import React, { useState } from 'react';
import Header from '../../components/Header/header';
import './CartPage.css';
import deleteIcon from '../../assets/images/delete.png'; // Make sure to add this image to your assets folder

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Dịch vụ A', type: 'Loại 1', time: '2 giờ', price: 100000, graveCode: 'MO001', selected: false, image: 'https://static.spacet.vn/image-resized/768x7680_max/img/blog/2024-04-19/662236be443d0e3865d73562.webp' },
    { id: 2, name: 'Dịch vụ B', type: 'Loại 2', time: '1 giờ', price: 150000, graveCode: 'MO002', selected: false, image: 'https://static.spacet.vn/image-resized/768x7680_max/img/blog/2024-04-19/662236be443d0e3865d73562.webp' },
    { id: 3, name: 'Dịch vụ C', type: 'Loại 3', time: '3 giờ', price: 200000, graveCode: 'MO003', selected: false, image: 'https://static.spacet.vn/image-resized/768x7680_max/img/blog/2024-04-19/662236be443d0e3865d73562.webp' },
    { id: 4, name: 'Dịch vụ D', type: 'Loại 4', time: '4 giờ', price: 250000, graveCode: 'MO004', selected: false, image: 'https://static.spacet.vn/image-resized/768x7680_max/img/blog/2024-04-19/662236be443d0e3865d73562.webp' },
    { id: 5, name: 'Dịch vụ E', type: 'Loại 5', time: '5 giờ', price: 300000, graveCode: 'MO005', selected: false, image: 'https://static.spacet.vn/image-resized/768x7680_max/img/blog/2024-04-19/662236be443d0e3865d73562.webp' },
  ]);

  const handleDelete = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleSelectItem = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleSelectAll = () => {
    const allSelected = cartItems.every(item => item.selected);
    setCartItems(cartItems.map(item => ({ ...item, selected: !allSelected })));
  };

  const calculateCartTotal = () => {
    return cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + item.price, 0);
  };

  const handlePayment = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    console.log('Processing payment for:', selectedItems);
    // Implement payment logic here
  };

  return (
    <div className="cart-page">
      <Header />
      <div className="cart-container">
        <h1>Giỏ hàng</h1>
        <table className="cart-table">
          <thead className='cart-table-header'>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  checked={cartItems.every(item => item.selected)}
                  onChange={handleSelectAll}
                  className="select-all-checkbox"
                />
              </th>
              <th>Tên dịch vụ</th>
              <th>Loại</th>
              <th>Thời gian thực hiện</th>
              <th>Giá</th>
              <th>Mã mộ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={item.selected}
                    onChange={() => handleSelectItem(item.id)}
                    className="item-checkbox"
                  />
                </td>
                <td>
                  <div className="service-info">
                    <img src={item.image} alt={item.name} className="service-image" />
                    <span>{item.name}</span>
                  </div>
                </td>
                <td>{item.type}</td>
                <td>{item.time}</td>
                <td className='price'>{item.price.toLocaleString('vi-VN')} đ</td>
                <td>{item.graveCode}</td>
                <td>
                  <button onClick={() => handleDelete(item.id)} className="delete-btn">
                    <img src={deleteIcon} alt="Delete" className="delete-icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="total-label">Tổng cộng:</td>
              <td colSpan="3" className="total-amount">{calculateCartTotal().toLocaleString('vi-VN')} đ</td>
            </tr>
          </tfoot>
        </table>
        <div className="cart-actions">
          <button onClick={handlePayment} className="payment-btn">Thanh Toán</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
