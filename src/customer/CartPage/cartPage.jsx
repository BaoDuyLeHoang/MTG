import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/header';
import './cartPage.css';
import deleteIcon from '../../assets/images/delete.png';
import { getCartItemsByCustomerId, addToCart } from "../../APIcontroller/API";
import { useAuth } from "../../context/AuthContext";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user || !user.accountId) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getCartItemsByCustomerId(user.accountId);
        console.log('Cart items response:', response);

        if (response && response.cartItemList && Array.isArray(response.cartItemList)) {
          setCartItems(response.cartItemList.map(item => ({ ...item, selected: false })));
        } else {
          setCartItems([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setError("Failed to load cart items. Please try again later.");
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user]);

  const handleDelete = (cartId) => {
    setCartItems(cartItems.filter(item => item.cartId !== cartId));
    // You might want to add an API call here to delete the item from the backend
  };

  const handleSelectItem = (cartId) => {
    setCartItems(cartItems.map(item => 
      item.cartId === cartId ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleSelectAll = () => {
    const allSelected = cartItems.every(item => item.selected);
    setCartItems(cartItems.map(item => ({ ...item, selected: !allSelected })));
  };

  const calculateCartTotal = () => {
    return cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + item.serviceView.price, 0);
  };

  const handlePayment = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    console.log('Processing payment for:', selectedItems);
    // Implement payment logic here
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="cart-page">
      <Header />
      <div className="cart-container">
        <h1>Giỏ hàng</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
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
                <th>Mô tả</th>
                <th>Giá</th>
                <th>Mã mộ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.cartId}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={item.selected}
                      onChange={() => handleSelectItem(item.cartId)}
                      className="item-checkbox"
                    />
                  </td>
                  <td>
                    <div className="service-info">
                      <img src={item.serviceView.imagePath} alt={item.serviceView.serviceName} className="service-image" />
                      <span>{item.serviceView.serviceName}</span>
                    </div>
                  </td>
                  <td>{item.serviceView.description}</td>
                  <td className='price'>{item.serviceView.price.toLocaleString('vi-VN')} đ</td>
                  <td>{item.martyrCode}</td>
                  <td>
                    <button onClick={() => handleDelete(item.cartId)} className="delete-btn">
                      <img src={deleteIcon} alt="Delete" className="delete-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="total-label">Tổng cộng:</td>
                <td colSpan="3" className="total-amount">{calculateCartTotal().toLocaleString('vi-VN')} đ</td>
              </tr>
            </tfoot>
          </table>
        )}
        <div className="cart-actions">
          <button onClick={handlePayment} className="payment-btn">Thanh Toán</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;