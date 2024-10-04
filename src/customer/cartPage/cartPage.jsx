import React from 'react';
import Header from '../../components/Header/header';
import './cartPage.css';

const CartPage = () => {
  // Sample cart items - replace with actual data from your state management
  const cartItems = [
    { id: 1, name: 'Dịch vụ A', type: 'Loại 1', time: '2 giờ', price: 100000, quantity: 2, graveCode: 'MO001' },
    { id: 2, name: 'Dịch vụ B', type: 'Loại 2', time: '1 giờ', price: 150000, quantity: 1, graveCode: 'MO002' },
  ];

  const handleDelete = (id) => {
    // Implement delete functionality
    console.log('Delete item with id:', id);
  };

  const calculateTotal = (item) => {
    return item.price * item.quantity;
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => total + calculateTotal(item), 0);
  };

  return (
    <div className="cart-page">
      <Header />
      <div className="cart-container">
        <h1>Giỏ hàng</h1>
        <table className="cart-table">
          <thead>
            <tr>
              <th>Tên dịch vụ</th>
              <th>Loại</th>
              <th>Thời gian thực hiện</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Mã mộ</th>
              <th>Tổng tiền</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.time}</td>
                <td>{item.price.toLocaleString('vi-VN')} đ</td>
                <td>{item.quantity}</td>
                <td>{item.graveCode}</td>
                <td>{calculateTotal(item).toLocaleString('vi-VN')} đ</td>
                <td>
                  <button onClick={() => handleDelete(item.id)} className="delete-btn">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="6" className="total-label">Tổng cộng:</td>
              <td colSpan="2" className="total-amount">{calculateCartTotal().toLocaleString('vi-VN')} đ</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default CartPage;
