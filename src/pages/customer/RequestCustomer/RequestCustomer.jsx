import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  getRelativeGraves, 
  getRequestTypes, 
  getAllServices, 
  createCustomerRequest 
} from '../../../APIcontroller/API';
import './RequestCustomer.css';
import Header from '../../../components/Header/header';
import Footer from '../../../components/Footer/footer';
import AlertMessage from '../../../components/AlertMessage/AlertMessage';

const ConfirmModal = ({ isOpen, onClose, onConfirm, requestData, services, getRequestTypeName }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div className="confirm-modal-content" onClick={e => e.stopPropagation()}>
        <div className="confirm-modal-header">
          <h3>Xác nhận yêu cầu</h3>
          <button className="confirm-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="confirm-modal-body">
          <p className="confirm-modal-message">Bạn có chắc chắn muốn gửi yêu cầu này?</p>
          <div className="confirm-modal-details">
            <p><strong>Loại yêu cầu:</strong> {getRequestTypeName(requestData.typeId)}</p>
            {requestData.serviceId && services && (
              <p><strong>Dịch vụ:</strong> {services.find(s => s.serviceId === parseInt(requestData.serviceId))?.serviceName}</p>
            )}
            <p><strong>Ghi chú:</strong> {requestData.note}</p>
            {requestData.completeDate && (
              <p><strong>Ngày hoàn thành:</strong> {new Date(requestData.completeDate).toLocaleDateString('vi-VN')}</p>
            )}
          </div>
        </div>
        <div className="confirm-modal-footer">
          <button className="confirm-modal-cancel" onClick={onClose}>Hủy bỏ</button>
          <button className="confirm-modal-submit" onClick={onConfirm}>Xác nhận</button>
        </div>
      </div>
    </div>
  );
};

const RequestCustomer = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    customerId: user?.accountId || 0,
    martyrId: '',
    typeId: '',
    note: '',
    serviceId: '',
    completeDate: ''
  });

  const [relatives, setRelatives] = useState([]);
  const [requestTypes, setRequestTypes] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (user?.accountId) {
        try {
          // Fetch relatives
          const relativesData = await getRelativeGraves(user.accountId);
          setRelatives(relativesData);

          // Fetch request types
          const requestTypesData = await getRequestTypes();
          setRequestTypes(requestTypesData);

          // Fetch services if needed
          if (formData.typeId === '3') {
            const servicesData = await getAllServices();
            setServices(servicesData);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        }
      }
    };

    fetchData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form data
    if (!formData.note.trim()) {
      setError('Vui lòng nhập ghi chú cho yêu cầu');
      return;
    }
    
    // Prepare request data
    const requestData = {
      customerId: formData.customerId,
      martyrId: parseInt(formData.martyrId),
      typeId: parseInt(formData.typeId),
      note: formData.note.trim(),
      serviceId: formData.typeId === '3' ? parseInt(formData.serviceId) : null,
      completeDate: formData.completeDate ? new Date(formData.completeDate).toISOString() : new Date().toISOString()
    };

    // Show confirm modal instead of sending request immediately
    setPendingRequest(requestData);
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);
    try {
      await createCustomerRequest(pendingRequest);
      setSuccess('Yêu cầu đã được tạo thành công!');
      setAlertMessage('Yêu cầu đã được tạo thành công!');
      setAlertSeverity('success');
      setAlertOpen(true);
      setFormData({
        customerId: user?.accountId || 0,
        martyrId: '',
        typeId: '',
        note: '',
        serviceId: '',
        completeDate: ''
      });
    } catch (error) {
      console.error('Error details:', error.response?.data);
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi tạo yêu cầu');
      setAlertMessage(error.response?.data?.message || 'Có lỗi xảy ra khi tạo yêu cầu');
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
      setPendingRequest(null);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Fetch services when typeId is 3
    if (name === 'typeId' && value === '3') {
      getAllServices().then(servicesData => {
        setServices(servicesData);
      }).catch(error => {
        console.error('Error fetching services:', error);
        setError('Không thể tải danh sách dịch vụ');
      });
    }
  };

  const getRequestTypeName = (typeId) => {
    switch (parseInt(typeId)) {
      case 1:
        return 'Báo cáo tình trạng mộ';
      case 2:
        return 'Đặt dịch vụ riêng';
      case 3:
        return 'Đăng ký dịch vụ có sẵn';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="page-container">
      <Header />
      <div className="request-customer-container">
        <h2>Tạo Yêu Cầu Mới</h2>

        <div className="request-guidelines">
          <div className="guidelines-title">
            <i className="fas fa-info-circle"></i>
            Hướng dẫn tạo yêu cầu 
          </div>
          
          <div className="request-types-info">
            <h4>Chi tiết các loại yêu cầu:</h4>
            <div className="request-type-item">
              <span className="request-type-title">1. Báo cáo tình trạng mộ:</span>
              <p>Dành cho yêu cầu báo cáo mộ. Bạn sẽ nhận được video và hình ảnh về tình trạng mộ hiện tại.</p>
            </div>
            
            <div className="request-type-item">
              <span className="request-type-title">2. Đặt dịch vụ riêng:</span>
              <p>Dành cho đặt dịch vụ riêng. Nếu bạn có yêu cầu đặc biệt, đội ngũ quản lý sẽ xem xét và báo giá. Dịch vụ sẽ được thực hiện sau khi có sự đồng ý của bạn.</p>
            </div>
            
            <div className="request-type-item">
              <span className="request-type-title">3. Đăng ký dịch vụ có sẵn:</span>
              <p>Đăng ký các dịch vụ có sẵn trong nghĩa trang. Bao gồm dịch vụ thường và định kỳ. Lưu ý: Đối với dịch vụ thường có thể cho cả người ngoài sử dụng. </p>
            </div>
          </div>

          <ul className="guidelines-list">
            <li>Vui lòng chọn mộ người thân từ danh sách có sẵn</li>
            <li>Đối với yêu cầu thăm viếng hoặc thắp hương, cần chọn ngày hoàn thành dự kiến trước ít nhất 3 ngày</li>
            <li>Đối với dịch vụ chăm sóc mộ, vui lòng chọn dịch vụ phù hợp từ danh sách</li>
            <li>Ghi chú chi tiết sẽ giúp chúng tôi phục vụ bạn tốt hơn</li>
          </ul>
        </div>

        <div className="warning-box">
          <div className="warning-title">
            <i className="fas fa-exclamation-triangle"></i>
            Lưu ý quan trọng
          </div>
          <div className="warning-content">
            Sau khi gửi yêu cầu, vui lòng chờ xác nhận từ nhân viên. Yêu cầu có thể bị từ chối nếu không đáp ứng đủ điều kiện hoặc thời gian không phù hợp. Mỗi khách hàng 
            chỉ có thể có tối đa 10 yêu cầu trong 1 tháng vui lòng có trách nhiệm trong việc sử dụng dịch vụ của nghĩa trang.
          </div>
        </div>


        <form onSubmit={handleSubmit} className="request-form">
          <div className="form-group-relative">
            <label htmlFor="martyrId">Chọn Mộ Người Thân:</label>
            <select
              id="martyrId"
              name="martyrId"
              value={formData.martyrId}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn mộ --</option>
              {relatives.map(relative => (
                <option key={relative.martyrId} value={relative.martyrId}>
                  {`${relative.matyrGraveInformations[0]?.name || 'Không rõ tên'} - Mã mộ: ${relative.martyrCode}`}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group-relative">
            <label htmlFor="typeId">Loại Yêu Cầu:</label>
            <select
              id="typeId"
              name="typeId"
              value={formData.typeId}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn loại yêu cầu --</option>
              {requestTypes.map(type => (
                <option key={type.typeId} value={type.typeId}>
                  {type.typeName}
                </option>
              ))}
            </select>
          </div>

          {formData.typeId === '3' && (
            <div className="form-group-relative">
              <label htmlFor="serviceId">Dịch Vụ:</label>
              <select
                id="serviceId"
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                required
              >
                <option value="">-- Chọn dịch vụ --</option>
                {services.map(service => (
                  <option key={service.serviceId} value={service.serviceId}>
                    {`${service.serviceName} - ${service.categoryName} (${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)})`}
                  </option>
                ))}
              </select>
              {formData.serviceId && services.find(s => s.serviceId.toString() === formData.serviceId) && (
                <div className="service-details">
                  <div className="request-service-image-container">
                    <img 
                      src={services.find(s => s.serviceId.toString() === formData.serviceId).imagePath} 
                      alt={services.find(s => s.serviceId.toString() === formData.serviceId).serviceName}
                      className="request-service-image-display"
                    />
                  </div>
                  <p className="request-service-description">
                    {services.find(s => s.serviceId.toString() === formData.serviceId).description}
                  </p>
                </div>
              )}
            </div>
          )}

          {(formData.typeId === '1' || formData.typeId === '2') && (
            <div className="form-group-relative">
              <label htmlFor="completeDate">Ngày Hoàn Thành Dự Kiến:</label>
              <input
                type="date"
                id="completeDate"
                name="completeDate"
                value={formData.completeDate}
                onChange={handleChange}
                min={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                required
              />
            </div>
          )}

          <div className="form-group-relative">
            <label htmlFor="note">Ghi Chú: <span className="required">*</span></label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows="4"
              required
              placeholder="Vui lòng nhập ghi chú cho yêu cầu của bạn"
              style={{ fontFamily: 'inherit' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="request-submit-btn"
          >
            {loading ? 'Đang xử lý...' : 'Gửi Yêu Cầu'}
          </button>
        </form>
      </div>
      <Footer />
      {showConfirmModal && (
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmSubmit}
          requestData={pendingRequest}
          services={services}
          getRequestTypeName={getRequestTypeName}
        />
      )}
      <AlertMessage 
        open={alertOpen} 
        handleClose={handleAlertClose} 
        severity={alertSeverity} 
        message={alertMessage} 
      />
    </div>
  );
};

export default RequestCustomer; 