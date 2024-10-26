import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/header';
import './CartPage.css';
import deleteIcon from '../../assets/images/delete.png';
import { getCartItemsByCustomerId, updateItemStatus } from "../../APIcontroller/API";
import { useAuth } from "../../context/AuthContext";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (isAuthLoading) {
        // Wait for authentication to complete
        return;
      }

      if (!user || !user.accountId) {
        setError("User not authenticated. Please log in and try again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getCartItemsByCustomerId(user.accountId);
        console.log('Cart items response:', response);

        if (response && response.cartItemList && Array.isArray(response.cartItemList)) {
          const mappedItems = response.cartItemList.map(item => ({
            ...item,
            selected: item.status || false
          }));
          setCartItems(mappedItems);
          console.log('All cart items:', mappedItems);
        } else if (response && response.message === "No cart items found for this account.") {
          setCartItems([]);
          console.log('Cart is empty');
        } else {
          setCartItems([]);
          console.log('Unexpected response format');
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setError("Failed to load cart items. Please try again later.");
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user, isAuthLoading]);

  const handleDelete = (cartId) => {
    setCartItems(cartItems.filter(item => item.cartId !== cartId));
    // You might want to add an API call here to delete the item from the backend
  };

  const handleSelectItem = async (cartId) => {
    try {
      const updatedItems = cartItems.map(item => 
        item.cartId === cartId ? { ...item, selected: !item.selected } : item
      );
      setCartItems(updatedItems);
      
      const selectedItem = updatedItems.find(item => item.cartId === cartId);
      await updateItemStatus(cartId, selectedItem.selected);
    } catch (error) {
      console.error("Error updating item status:", error);
      // Optionally, you can show an error message to the user here
    }
  };

  const handleSelectAll = async () => {
    try {
      const allSelected = cartItems.every(item => item.selected);
      const updatedItems = cartItems.map(item => ({ ...item, selected: !allSelected }));
      setCartItems(updatedItems);
      
      // Update status for all items
      for (const item of updatedItems) {
        await updateItemStatus(item.cartId, item.selected);
      }
    } catch (error) {
      console.error("Error updating all items status:", error);
      // Optionally, you can show an error message to the user here
    }
  };

  const calculateCartTotal = () => {
    return cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + item.serviceView.price, 0);
  };

  const handlePayment = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }
    // Only pass the account ID to the checkout page
    navigate('/checkout', { state: { accountId: user.accountId } });
  };

  const navigateToServices = () => {
    navigate('/dichvu'); // Adjust this path if needed
  };

  return (
    <div className="cart-page">
      <Header />
      <div className="cart-container">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart-message">
            <h1>Giỏ hàng của bạn đang trống</h1>
            <button onClick={navigateToServices} className="go-to-services-btn">
              Xem Dịch Vụ
            </button>
          </div>
        ) : (
          <table className="cart-table">
            <thead className='cart-table-header'>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    checked={cartItems.length > 0 && cartItems.every(item => item.selected)}
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
        {cartItems.length > 0 && (
          <div className="cart-actions">
            <button onClick={handlePayment} className="payment-btn">Thanh Toán</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
