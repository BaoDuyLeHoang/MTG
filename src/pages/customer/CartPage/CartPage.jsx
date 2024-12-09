import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../../components/Header/header';
import './CartPage.css';
import deleteIcon from '../../../assets/images/delete.png';
import { getCartItemsByCustomerId, updateItemStatus, deleteCartItem, getServiceById } from "../../../APIcontroller/API";
import { useAuth } from "../../../context/AuthContext";
import AlertMessage from '../../../components/AlertMessage/AlertMessage';
import { addToAnonymousCart } from '../../../services/cart';
import { getMartyrGraveById } from '../../../services/graves';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  // Add these new state variables for the alert
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        if (user?.accountId) {
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
        } else {
          const savedCartItems = JSON.parse(sessionStorage.getItem('savedCartItems') || '[]');
          console.log('Loaded from session:', savedCartItems);
          
          if (savedCartItems.length > 0) {
            try {
              // Transform the items into the required format
              const itemsForApi = savedCartItems.map(item => ({
                serviceId: item.serviceId,
                martyrId: item.martyrId
              }));
              
              const response = await addToAnonymousCart(itemsForApi);
              
              if (response && response.cartItemList && Array.isArray(response.cartItemList)) {
                const mappedItems = await Promise.all(response.cartItemList.map(async item => {
                  const martyrInfo = await getMartyrGraveById(item.martyrId);
                  return {
                    cartId: `temp-${item.martyrId}`,
                    selected: item.status || false,
                    martyrId: item.martyrId,
                    martyrCode: item.martyrCode,
                    martyrName: martyrInfo.name,
                    serviceView: {
                      serviceId: item.serviceView.serviceId,
                      serviceName: item.serviceView.serviceName,
                      description: item.serviceView.description,
                      price: item.serviceView.price,
                      imagePath: item.serviceView.imagePath
                    }
                  };
                }));
                
                console.log('Mapped items from API:', mappedItems);
                setCartItems(mappedItems);
              }
            } catch (error) {
              console.error("Error sending items to anonymous cart:", error);
              setAlertMessage("Có lỗi xảy ra khi đồng bộ giỏ hàng. Vui lòng thử lại sau.");
              setAlertSeverity("error");
              setAlertOpen(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setError("Failed to load cart items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthLoading) {
      fetchCartItems();
    }
  }, [user, isAuthLoading]);

  const handleDelete = async (cartId) => {
    try {
      if (user?.accountId) {
        await deleteCartItem(cartId);
        setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
        
        // Remove specific item from session storage
        const savedCartItems = JSON.parse(sessionStorage.getItem('savedCartItems') || '[]');
        const itemToDelete = cartItems.find(item => item.cartId === cartId);
        const updatedItems = savedCartItems.filter(item => 
          item.serviceId !== itemToDelete.serviceView.serviceId
        );
        sessionStorage.setItem('savedCartItems', JSON.stringify(updatedItems));
      } else {
        // For non-logged in users
        const savedCartItems = JSON.parse(sessionStorage.getItem('savedCartItems') || '[]');
        const itemToDelete = cartItems.find(item => item.cartId === cartId);
        const updatedItems = savedCartItems.filter(item => 
          item.serviceId !== itemToDelete.serviceView.serviceId
        );
        sessionStorage.setItem('savedCartItems', JSON.stringify(updatedItems));
        
        // Call API to update anonymous cart
        if (updatedItems.length > 0) {
          const itemsForApi = updatedItems.map(item => ({
            serviceId: item.serviceId,
            martyrId: item.martyrId
          }));
          
          const response = await addToAnonymousCart(itemsForApi);
          
          if (response && response.cartItemList && Array.isArray(response.cartItemList)) {
            const mappedItems = await Promise.all(response.cartItemList.map(async item => {
              const martyrInfo = await getMartyrGraveById(item.martyrId);
              return {
                cartId: `temp-${item.martyrId}`,
                selected: item.status || false,
                martyrId: item.martyrId,
                martyrCode: item.martyrCode,
                martyrName: martyrInfo.name,
                serviceView: {
                  serviceId: item.serviceView.serviceId,
                  serviceName: item.serviceView.serviceName,
                  description: item.serviceView.description,
                  price: item.serviceView.price,
                  imagePath: item.serviceView.imagePath
                }
              };
            }));
            setCartItems(mappedItems);
          } else {
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
      }
      
      setAlertMessage("Sản phẩm đã được xóa khỏi giỏ hàng thành công!");
      setAlertSeverity("success");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error deleting cart item:", error);
      setAlertMessage("Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại sau.");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
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
    
    // Check if there are selected items
    if (selectedItems.length === 0) {
      setAlertMessage("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      setAlertSeverity("warning");
      setAlertOpen(true);
      return;
    }

    // Check if user is logged in
    if (!user?.accountId) {
      setAlertMessage("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục thanh toán.");
      setAlertSeverity("warning");
      setAlertOpen(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Navigate after 2 seconds so user can see the message
      return;
    }

    // If user is logged in, proceed with normal checkout
    navigate('/checkout', { state: { accountId: user.accountId } });
  };

  const navigateToServices = () => {
    navigate('/tim-kiem-mo'); // Adjust this path if needed
  };

  const navigateToLogin = () => {
    navigate('/login'); // Adjust this path if needed
  };

  // Function to handle closing the alert
  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <div className="cart-page-wrapper">
      <Header />
      <AlertMessage 
        open={alertOpen}
        handleClose={handleAlertClose}
        severity={alertSeverity}
        message={alertMessage}
      />
      <div className="cart-page-container">
        <div className="cart-page-header">
          <h1 className="cart-page-title">Giỏ hàng của bạn</h1>
          <p className="cart-page-subtitle">
            {cartItems.length} sản phẩm trong giỏ hàng
          </p>
        </div>
        {loading ? (
          <div className="cart-page-loading-spinner">
            <div>Đang tải...</div>
          </div>
        ) : error ? (
          <div>{error}</div>
        ) : (cartItems.length === 0) ? (
          <div className="cart-page-empty">
            <div className="cart-page-empty-message">
              <i className="fas fa-shopping-cart cart-icon"></i>
              <h2>Giỏ hàng của bạn đang trống</h2>
              <p>Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
              <div className="cart-page-empty-buttons">
                <button onClick={navigateToServices} className="cart-page-button primary">
                  <i className="fas fa-search"></i>
                  Đến trang tìm kiếm mộ
                </button>
                {user?.accountId && (
                  <button onClick={() => navigate('/relative-grave')} className="cart-page-button secondary">
                    <i className="fas fa-heart"></i>
                    Đến mộ thân nhân
                  </button>
                )}
                {!user?.accountId && (
                  <button onClick={navigateToLogin} className="cart-page-button tertiary">
                    <i className="fas fa-user"></i>
                    Đăng nhập / Đăng ký
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <table className="cart-page-table">
            <thead className='cart-page-table-header'>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    checked={cartItems.length > 0 && cartItems.every(item => item.selected)}
                    onChange={handleSelectAll}
                    className="cart-page-select-all"
                  />
                </th>
                <th>Tên dịch vụ</th>
                <th>Mô tả</th>
                <th>Giá</th>
                <th>Tên Liệt sĩ</th>
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
                      className="cart-page-item-checkbox"
                    />
                  </td>
                  <td>
                    <div className="cart-page-service-info">
                      <img src={item.serviceView.imagePath} alt={item.serviceView.serviceName} className="cart-page-service-image" />
                      <span>{item.serviceView.serviceName}</span>
                    </div>
                  </td>
                  <td>{item.serviceView.description}</td>
                  <td className='cart-page-price'>{item.serviceView.price.toLocaleString('vi-VN')} đ</td>
                  <td>
                    <Link to={`/chitietmo/${item.martyrId}`} className="cart-page-martyr-link">
                      {item.martyrName}
                    </Link>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(item.cartId)} className="cart-page-delete-btn">
                      <img src={deleteIcon} alt="Delete" className="cart-page-delete-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="cart-page-total-label">Tổng cộng:</td>
                <td colSpan="3" className="cart-page-total-amount">{calculateCartTotal().toLocaleString('vi-VN')} đ</td>
              </tr>
            </tfoot>
          </table>
        )}
        {cartItems.length > 0 && (
          <div className="cart-page-actions">
            <button onClick={handlePayment} className="cart-page-payment-btn">Thanh Toán</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;