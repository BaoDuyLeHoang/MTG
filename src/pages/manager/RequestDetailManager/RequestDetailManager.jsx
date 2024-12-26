import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRequestById, acceptManagerRequest, getAllMaterials } from '../../../APIcontroller/API';
import { jwtDecode } from 'jwt-decode';
import Sidebar from '../../../components/Sidebar/sideBar';
import AlertMessage from '../../../components/AlertMessage/AlertMessage';
import './RequestDetailManager.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const RequestDetailManager = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rejectNote, setRejectNote] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [tempRejectNote, setTempRejectNote] = useState('');
  const [materials, setMaterials] = useState([]);
  const [openMaterialDialog, setOpenMaterialDialog] = useState(false);

  const getManagerIdFromToken = () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      
      const decodedToken = jwtDecode(token);
      return decodedToken.AccountId; // Assuming AccountId is in the token payload
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const fetchRequestDetail = async () => {
    try {
      setLoading(true);
      const data = await getRequestById(requestId);
      if (!data) {
        throw new Error('Không tìm thấy yêu cầu');
      }
      setRequest(data);
    } catch (err) {
      setError(err.message);
      setAlertMessage(err.message);
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetail();
  }, [requestId]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const data = await getAllMaterials();
        setMaterials(data);
      } catch (error) {
        setAlertSeverity('error');
        setAlertMessage('Không thể tải danh sách vật liệu');
        setAlertOpen(true);
      }
    };

    if (request?.typeId === 2) {
      fetchMaterials();
    }
  }, [request?.typeId]);

  const getRequestTypeName = (typeId) => {
    switch (typeId) {
      case 1: return "Yêu cầu báo cáo tình trạng mộ";
      case 2: return "Đặt dịch vụ riêng";
      case 3: return "Đăng ký dịch vụ có sẵn";
      default: return "Không xác định";
    }
  };

  const getStatusLabel = (status, typeId) => {
    const statusNum = parseInt(status);
    const typeNum = parseInt(typeId);

    if (typeNum === 1) {
      switch (statusNum) {
        case 1: return { text: 'Chờ xác nhận', class: 'pending' };
        case 2: return { text: 'Đã xác nhận', class: 'confirmed' };
        case 3: return { text: 'Từ chối', class: 'rejected' };
        case 7: return { text: 'Hoàn thành', class: 'completed' };
        case 8: return { text: 'Thất bại', class: 'failed' };
        default: return { text: 'Không xác định', class: 'unknown' };
      }
    }
    
    if (typeNum === 2) {
      switch (statusNum) {
        case 1: return { text: 'Chờ xác nhận', class: 'pending' };
        case 3: return { text: 'Từ chối', class: 'rejected' };
        case 4: return { text: 'Chờ phản hồi', class: 'waiting-response' };
        case 5: return { text: 'Đã phản hồi', class: 'responded' };
        case 6: return { text: 'Đang thực hiện', class: 'in-progress' };
        case 7: return { text: 'Hoàn thành', class: 'completed' };
        case 8: return { text: 'Thất bại', class: 'failed' };
        default: return { text: 'Không xác định', class: 'unknown' };
      }
    }

    if (typeNum === 3) {
      switch (statusNum) {
        case 1: return { text: 'Chờ xác nhận', class: 'pending' };
        case 2: return { text: 'Đã xác nhận', class: 'confirmed' };
        case 3: return { text: 'Từ chối', class: 'rejected' };
        case 7: return { text: 'Hoàn thành', class: 'completed' };
        case 8: return { text: 'Thất bại', class: 'failed' };
        default: return { text: 'Không xác định', class: 'unknown' };
      }
    }

    return { text: 'Không xác định', class: 'unknown' };
  };

  const handleBack = () => {
    navigate('/request-manager');
  };

  const handleAcceptRequest = async (status) => {
    try {
      setIsProcessing(true);
      setErrorMessage('');
      
      // Kiểm tra note khi từ chối
      if (!status && !rejectNote.trim()) {
        setAlertSeverity('error');
        setAlertMessage('Vui lòng nhập lý do từ chối');
        setAlertOpen(true);
        return;
      }

      // Kiểm tra materials khi chấp nhận yêu cầu type 2
      if (status && request?.typeId === 2 && (!selectedMaterials || selectedMaterials.length === 0)) {
        setAlertSeverity('error');
        setAlertMessage('Vui lòng chọn ít nhất một vật liệu');
        setAlertOpen(true);
        return;
      }

      const requestData = {
        requestId: parseInt(requestId),
        note: status ? null : rejectNote.trim(),
        status: status,
        materialIds: status && request?.typeId === 2 ? selectedMaterials : []
      };

      const response = await acceptManagerRequest(requestData);

      if (response.message === "Requests created successfully.") {
        setAlertSeverity('success');
        setAlertMessage(response.response);
        setAlertOpen(true);

        await new Promise(resolve => setTimeout(resolve, 1000));
        window.location.href = window.location.href;
      } else {
        setAlertSeverity('error');
        setAlertMessage(response.response || 'Có lỗi xảy ra');
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertSeverity('error');
      setAlertMessage(error.message);
      setAlertOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenRejectDialog = () => {
    setTempRejectNote('');
    setOpenRejectDialog(true);
  };

  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
    setTempRejectNote('');
  };

  const handleSubmitReject = () => {
    if (tempRejectNote.trim()) {
      setRejectNote(tempRejectNote.trim());
      handleCloseRejectDialog();
      handleAcceptRequest(false);
    } else {
      setAlertSeverity('error');
      setAlertMessage('Vui lòng nhập lý do từ chối');
      setAlertOpen(true);
    }
  };

  const handleReject = () => {
    handleOpenRejectDialog();
  };

  const handleMaterialChange = (event) => {
    setSelectedMaterials(event.target.value);
  };

  const handleOpenMaterialDialog = () => {
    setOpenMaterialDialog(true);
  };

  const handleCloseMaterialDialog = () => {
    setOpenMaterialDialog(false);
  };

  const handleMaterialSelect = (materialId) => {
    if (selectedMaterials.includes(materialId)) {
      setSelectedMaterials(selectedMaterials.filter(id => id !== materialId));
    } else {
      setSelectedMaterials([...selectedMaterials, materialId]);
    }
  };

  if (loading) return <div className="rdm-loading">Đang tải...</div>;
  if (error) return <div className="rdm-error">{error}</div>;
  if (!request) return <div className="rdm-error">Không tìm thấy yêu cầu</div>;

  return (
    <>
      <AlertMessage
        open={alertOpen}
        handleClose={() => setAlertOpen(false)}
        severity={alertSeverity}
        message={alertMessage}
      />

      <div className="rdm-page-container">
        <Sidebar />
        <div className="rdm-container">
          <div className="rdm-content">
            <div className="rdm-header">
              <h2 className="rdm-title">Chi Tiết Yêu Cầu</h2>
            </div>

            <div className="rdm-detail-card">
              <div className="rdm-card-header">
                <div className="rdm-request-type">
                  <h3>{getRequestTypeName(request.typeId)}</h3>
                  <span className={`rdm-status-badge rdm-status-${getStatusLabel(request.status, request.typeId).class}`}>
                    {getStatusLabel(request.status, request.typeId).text}
                  </span>
                </div>
                <div className="rdm-request-id">#{request.requestId}</div>
              </div>

              <div className="rdm-info-grid">
                <div className="rdm-info-section">
                  <h4 className="rdm-section-title">Thông tin yêu cầu</h4>
                  <div className="rdm-info-content">
                    <div className="rdm-info-row">
                      <span className="rdm-label">Ngày tạo:</span>
                      <span className="rdm-value">{new Date(request.createAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="rdm-info-row">
                      <span className="rdm-label">Ngày cập nhật:</span>
                      <span className="rdm-value">{new Date(request.updateAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="rdm-info-row">
                      <span className="rdm-label">Ngày hoàn thành dự kiến:</span>
                      <span className="rdm-value">
                        {request.endDate ? new Date(request.endDate).toLocaleDateString('vi-VN') : "Chưa xác định"}
                      </span>
                    </div>
                    {request.serviceName && (
                      <div className="rdm-info-row">
                        <span className="rdm-label">Dịch vụ yêu cầu:</span>
                        <span className="rdm-value">{request.serviceName}</span>
                      </div>
                    )}
                    <div className="rdm-info-row">
                      <span className="rdm-label">Tổng chi phí yêu cầu:</span>
                      <span className="rdm-value rdm-price">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(request.price)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rdm-info-section">
                  <h4 className="rdm-section-title">Thông tin liệt sĩ</h4>
                  <div className="rdm-info-content">
                    <div className="rdm-info-row">
                      <span className="rdm-label">Mã liệt sĩ:</span>
                      <span className="rdm-value">{request.martyrCode}</span>
                    </div>
                    <div className="rdm-info-row">
                      <span className="rdm-label">Tên liệt sĩ:</span>
                      <span className="rdm-value">{request.martyrName}</span>
                    </div>
                  </div>
                </div>

                <div className="rdm-info-section">
                  <h4 className="rdm-section-title">Thông tin khách hàng</h4>
                  <div className="rdm-info-content">
                    <div className="rdm-info-row">
                      <span className="rdm-label">Mã khách hàng:</span>
                      <span className="rdm-value">#{request.customerId}</span>
                    </div>
                    <div className="rdm-info-row">
                      <span className="rdm-label">Tên khách hàng:</span>
                      <span className="rdm-value">{request.customerName}</span>
                    </div>
                    <div className="rdm-info-row">
                      <span className="rdm-label">Số điện thoại:</span>
                      <span className="rdm-value">{request.customerPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="rdm-info-section">
                  <h4 className="rdm-section-title">Ghi chú</h4>
                  <div className="rdm-note">{request.note || "Không có ghi chú"}</div>
                </div>

                {request.reasons && request.reasons.length > 0 && (
                  <div className="rdm-info-section">
                    <h4 className="rdm-section-title">Lịch sử từ chối</h4>
                    <div className="rdm-reject-history">
                      {request.reasons.map((reason, index) => (
                        <div key={index} className="rdm-reject-item">
                          <div className="rdm-reject-reason">
                            <span className="rdm-reject-label">Lý do:</span> {reason.rejectReason}
                          </div>
                          <div className="rdm-reject-date">
                            <span className="rdm-reject-label">Thời gian:</span>
                            {new Date(reason.rejectReason_CreateAt).toLocaleString('vi-VN')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {request.typeId === 2 && request.status === 1 && (
                  <div className="rdm-info-section">
                    <h4 className="rdm-section-title">Chọn vật liệu</h4>
                    <div className="rdm-materials-container">
                      <Button 
                        variant="outlined" 
                        onClick={handleOpenMaterialDialog}
                        startIcon={<AddIcon />}
                        className="rdm-material-button"
                      >
                        {selectedMaterials.length > 0 ? 'Thêm vật liệu' : 'Chọn vật liệu'}
                      </Button>
                      
                      {selectedMaterials.length > 0 && (
                        <div className="rdm-selected-materials">
                          {selectedMaterials.map((materialId) => {
                            const material = materials.find(m => m.materialId === materialId);
                            return (
                              <Chip
                                key={materialId}
                                label={`${material?.materialName} - ${material?.price.toLocaleString('vi-VN')}đ`}
                                onDelete={() => handleMaterialSelect(materialId)}
                                className="rdm-material-chip"
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Request Task Section */}
                {request.requestTask && (
                  <div className="rdm-info-section">
                    <h4 className="rdm-section-title">Thông tin công việc</h4>
                    <div className="rdm-info-content">
                      <div className="rdm-info-row">
                        <span className="rdm-label">Mô tả:</span>
                        <span className="rdm-value">{request.requestTask.description}</span>
                      </div>
                      {request.requestTask.taskImages && request.requestTask.taskImages.length > 0 && (
                        <div className="rdm-info-row">
                          <span className="rdm-label">Hình ảnh:</span>
                          <div className="rdm-image-grid">
                            {request.requestTask.taskImages.map((image, index) => (
                              <div key={index} className="rdm-image-item">
                                <img src={image.imageRequestTaskCustomer} alt={`Task image ${index + 1}`} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Report Task Section */}
                {request.reportTask && (
                  <div className="rdm-info-section">
                    <h4 className="rdm-section-title">Báo cáo công việc</h4>
                    <div className="rdm-info-content">
                      <div className="rdm-info-row">
                        <span className="rdm-label">Mô tả:</span>
                        <span className="rdm-value">{request.reportTask.description}</span>
                      </div>
                      {request.reportTask.reportImages && request.reportTask.reportImages.length > 0 && (
                        <div className="rdm-report-images">
                          <span className="rdm-label">Hình ảnh:</span>
                          <div className="rdm-image-grid">
                            {request.reportTask.reportImages.map((image, index) => (
                              <div key={index} className="rdm-image-item">
                                <img src={image.urlPath} alt={`Report image ${index + 1}`} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {request.reportTask.videoFile && (
                        <div className="rdm-video">
                          <span className="rdm-label">Video:</span>
                          <video controls src={request.reportTask.videoFile} />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Request Materials Section */}
                {request.requestMaterials && request.requestMaterials.length > 0 && (
                  <div className="rdm-info-section">
                    <h4 className="rdm-section-title">Vật liệu sử dụng</h4>
                    <div className="rdm-materials-list">
                      {request.requestMaterials.map((material) => (
                        <div key={material.requestMaterialId} className="rdm-material-card">
                          <div className="rdm-material-header">
                            <span className="rdm-material-name">{material.materialName}</span>
                            <span className="rdm-material-price">
                              {material.price.toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                          <p className="rdm-material-description">{material.description}</p>
                          {material.imagePath && (
                            <img 
                              src={material.imagePath} 
                              alt={material.materialName} 
                              className="rdm-material-image"
                            />
                          )}
                        </div>
                      ))}
                      <div className="rdm-materials-total">
                        <span className="rdm-label">Tổng tiền:</span>
                        <span className="rdm-value rdm-price">
                          {request.requestMaterials.reduce((total, material) => total + material.price, 0)
                            .toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {request.status === 1 && (
                <div className="rdm-actions">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAcceptRequest(true)}
                    disabled={isProcessing || (request.typeId === 2 && selectedMaterials.length === 0)}
                  >
                    {isProcessing ? 'Đang xử lý...' : 'Xác nhận'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleReject}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Đang xử lý...' : 'Từ chối'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog 
        open={openRejectDialog} 
        onClose={handleCloseRejectDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <div className="rdm-dialog-title">
            <span>Từ chối yêu cầu</span>
            <IconButton onClick={handleCloseRejectDialog} size="small">
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="rdm-reject-dialog-content">
            <TextField
              autoFocus
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              label="Lý do từ chối"
              placeholder="Vui lòng nhập lý do từ chối yêu cầu..."
              value={tempRejectNote}
              onChange={(e) => setTempRejectNote(e.target.value)}
              error={tempRejectNote.trim() === ''}
              helperText={tempRejectNote.trim() === '' ? 'Vui lòng nhập lý do từ chối' : ''}
            />
          </div>
        </DialogContent>
        <DialogActions className="rdm-dialog-actions">
          <Button 
            onClick={handleCloseRejectDialog} 
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmitReject}
            variant="contained"
            color="error"
            disabled={!tempRejectNote.trim()}
          >
            Xác nhận từ chối
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openMaterialDialog} 
        onClose={handleCloseMaterialDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chọn vật liệu</DialogTitle>
        <DialogContent>
          <div className="rdm-material-list">
            {materials.map((material) => (
              <div 
                key={material.materialId} 
                className={`rdm-material-item ${
                  selectedMaterials.includes(material.materialId) ? 'selected' : ''
                }`}
                onClick={() => handleMaterialSelect(material.materialId)}
              >
                <div className="rdm-material-info">
                  <span className="rdm-material-name">{material.materialName}</span>
                  <span className="rdm-material-price">
                    {material.price.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                {selectedMaterials.includes(material.materialId) && (
                  <span className="rdm-material-check">✓</span>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMaterialDialog} color="inherit">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RequestDetailManager; 