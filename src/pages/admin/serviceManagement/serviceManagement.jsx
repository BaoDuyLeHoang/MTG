import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  TablePagination,
  TextField,
  FormControlLabel,
  Switch,
  DialogContentText,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  InputLabel,
  FormControl,
  Chip,
  FormHelperText,
  Grid,
  InputAdornment
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import axios from 'axios';
import Sidebar from '../../../components/Sidebar/sideBar';
import { getAdminServices } from '../../../services/service';
import { getMaterialAdmin, getMaterialByServiceId } from '../../../services/material';
import { createService, updateService ,getServiceCategory, updateServiceStatus} from '../../../services/service';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from "../../../firebase"; // Adjust the import path based on your Firebase config location

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newService, setNewService] = useState({
    serviceName: '',
    description: '',
    price: '',
    status: true,
    imagePath: ''
  });
  const [materials, setMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [imageUpload, setImageUpload] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [categories, setCategories] = useState([]);
  const [statusConfirmDialog, setStatusConfirmDialog] = useState({
    open: false,
    serviceId: null,
    currentStatus: null
  });
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await getAdminServices(
        page, 
        pageSize, 
        undefined,
        categoryFilter === 'all' ? undefined : categoryFilter
      );
      
      setServices(response?.services || []);
      setTotalPages(response?.totalPage || 0);
    } catch (error) {
      showSnackbar('Failed to fetch services', 'error');
      console.error('Error fetching services:', error);
      setServices([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page, pageSize, categoryFilter]);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1); // API uses 1-based indexing
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(1); // Reset to first page when changing page size
  };

  // Vietnamese translations for TablePagination
  const paginationLabels = {
    labelRowsPerPage: "Số hàng mỗi trang:",
    labelDisplayedRows: ({ from, to, count }) =>
      `${from}–${to} trong ${count !== -1 ? count : `hơn ${to}`}`,
  };

  const fetchMaterials = async () => {
    try {
      const response = await getMaterialAdmin();
      setMaterials(response || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      showSnackbar('Không thể tải danh sách vật liệu', 'error');
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageUpload(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getServiceCategory();
      setCategories(response || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showSnackbar('Không thể tải danh sách danh mục', 'error');
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddService = async () => {
    try {
      if (!newService.categoryId) {
        showSnackbar('Vui lòng chọn danh mục cho dịch vụ', 'error');
        return;
      }

      if (!newService.serviceName || !newService.description || !newService.price) {
        showSnackbar('Vui lòng điền đầy đủ thông tin dịch vụ', 'error');
        return;
      }

      setIsSubmitting(true);
      setUploadProgress(true);
      let imageUrl = '';
      
      if (imageUpload) {
        const imageRef = ref(storage, `services/${Date.now()}_${imageUpload.name}`);
        const snapshot = await uploadBytes(imageRef, imageUpload);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const serviceData = {
        categoryId: newService.categoryId,
        serviceName: newService.serviceName,
        description: newService.description,
        price: parseFloat(newService.price),
        status: newService.status,
        imagePath: imageUrl,
        materialIds: selectedMaterials
      };
      
      const response = await createService(serviceData);
      
      if (response.status === 201 || response.status === 200) {
        showSnackbar('Thêm dịch vụ thành công', 'success');
        setAddDialogOpen(false);
        fetchServices();
        
        setNewService({
          serviceName: '',
          description: '',
          price: '',
          status: true,
          imagePath: ''
        });
        setSelectedMaterials([]);
        setImageUpload(null);
        setImagePreview('');
      } else {
        throw new Error('Failed to create service');
      }
    } catch (error) {
      showSnackbar(error.message || 'Không thể thêm dịch vụ', 'error');
      console.error('Error adding service:', error);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, checked } = event.target;
    setNewService(prev => ({
      ...prev,
      [name]: name === 'status' ? checked : value
    }));
  };

  const handleMaterialChange = (event) => {
    const {
      target: { value },
    } = event;
    const selectedValues = typeof value === 'string' ? value.split(',') : value;
    
    setSelectedMaterials(selectedValues);
    setEditingService(prev => ({
      ...prev,
      materialIds: selectedValues
    }));
  };

  const handleOpenEditDialog = async (service) => {
    try {
      const serviceMaterials = await getMaterialByServiceId(service.serviceId);
      setEditingService({
        ...service,
        materialIds: serviceMaterials?.map(m => m.materialId) || []
      });
      setSelectedMaterials(serviceMaterials?.map(m => m.materialId) || []);
      setImagePreview(service.imagePath || '');
      setEditDialogOpen(true);
    } catch (error) {
      console.error('Error fetching service materials:', error);
      showSnackbar('Không thể tải thông tin vật liệu', 'error');
    }
  };

  const handleUpdateService = async () => {
    try {
      if (!editingService.categoryId) {
        showSnackbar('Vui lòng chọn danh mục cho dịch vụ', 'error');
        return;
      }

      setIsSubmitting(true);
      setUploadProgress(true);
      let imageUrl = editingService.imagePath;
      
      if (imageUpload) {
        const imageRef = ref(storage, `services/${Date.now()}_${imageUpload.name}`);
        const snapshot = await uploadBytes(imageRef, imageUpload);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const serviceData = {
        categoryId: editingService.categoryId,
        serviceName: editingService.serviceName,
        description: editingService.description,
        price: parseFloat(editingService.price),
        status: editingService.status,
        imagePath: imageUrl,
        materialIds: selectedMaterials
      };
      
      if (!serviceData.serviceName || !serviceData.description || !serviceData.price) {
        showSnackbar('Vui lòng điền đầy đủ thông tin dịch vụ', 'error');
        return;
      }

      await updateService(editingService.serviceId, serviceData);
      showSnackbar('Cập nhật dịch vụ thành công', 'success');
      setEditDialogOpen(false);
      fetchServices();
      
      setEditingService(null);
      setSelectedMaterials([]);
      setImageUpload(null);
      setImagePreview('');
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Không thể cập nhật dịch vụ', 'error');
      console.error('Error updating service:', error);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(false);
    }
  };

  // Thêm styles cho các buttons
  const buttonStyles = {
    editButton: {
      mr: 1,
      '&:hover': {
        backgroundColor: 'rgba(25, 118, 210, 0.04)',
      },
    },
    deleteButton: {
      '&:hover': {
        backgroundColor: 'rgba(211, 47, 47, 0.04)',
      },
    },
    dialogButton: {
      minWidth: 100,
    },
  };

  // Thêm styles cho dialog
  const dialogStyles = {
    paper: {
      borderRadius: 2,
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    },
    title: {
      borderBottom: '1px solid rgba(0,0,0,0.12)',
      px: 3,
      py: 2,
      bgcolor: '#f8f9fa'
    },
    content: {
      p: 3
    },
    actions: {
      borderTop: '1px solid rgba(0,0,0,0.12)',
      px: 3,
      py: 2
    }
  };

  // Thêm hàm format giá
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Thêm hàm clear form
  const clearNewServiceForm = () => {
    setNewService({
      serviceName: '',
      description: '',
      price: '',
      status: true,
      imagePath: '',
      categoryId: ''
    });
    setSelectedMaterials([]);
    setImageUpload(null);
    setImagePreview('');
  };

  // Cập nhật hàm mở dialog thêm mi
  const handleOpenAddDialog = () => {
    clearNewServiceForm();
    setAddDialogOpen(true);
  };

  // Thêm hàm xử lý cập nhật trạng thái
  const handleStatusChange = async () => {
    try {
      const { serviceId } = statusConfirmDialog;
      await updateServiceStatus(serviceId);
      showSnackbar('Cập nhật trạng thái thành công', 'success');
      setStatusConfirmDialog({ open: false, serviceId: null, currentStatus: null });
      fetchServices();
    } catch (error) {
      showSnackbar('Không thể cập nhật trạng thái', 'error');
      console.error('Error updating status:', error);
    }
  };

  // Thêm hàm mở dialog xác nhận
  const handleStatusChangeClick = (serviceId, currentStatus) => {
    setStatusConfirmDialog({
      open: true,
      serviceId,
      currentStatus
    });
  };

  // Add handler for filter changes
  const handleFilterChange = (filterType, value) => {
    setPage(1); // Reset to first page when changing filters
    if (filterType === 'category') {
      setCategoryFilter(value);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <Box sx={{ p: 4, maxWidth: '1400px', margin: '0 auto' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4 
          }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
              Quản Lý Dịch Vụ
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddDialog}
              sx={{
                backgroundColor: '#1a237e',
                '&:hover': { backgroundColor: '#0d47a1' }
              }}
            >
              Thêm Dịch Vụ Mới
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tên Dịch Vụ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                          value={categoryFilter}
                          onChange={(e) => handleFilterChange('category', e.target.value)}
                          variant="outlined"
                          sx={{ 
                            height: '32px',
                            backgroundColor: 'white',
                            '& .MuiSelect-select': {
                              py: 0.5,
                            }
                          }}
                        >
                          <MenuItem value="all">Danh mục</MenuItem>
                          {categories.map((category) => (
                            <MenuItem key={category.categoryId} value={category.categoryId}>
                              {category.categoryName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Mô Tả</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Giá</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Trạng Thái</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Hình Ảnh</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Thao Tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : !Array.isArray(services) || services.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Không có dịch vụ nào
                    </TableCell>
                  </TableRow>
                ) : (
                  services.map((service) => (
                    <TableRow key={service.serviceId}>
                      <TableCell>{service.serviceName}</TableCell>
                      <TableCell>{service.categoryName}</TableCell>
                      <TableCell>{service.description}</TableCell>
                      <TableCell>
                        {formatPrice(service.price)}
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={service.status}
                              onChange={() => handleStatusChangeClick(service.serviceId, service.status)}
                              color="primary"
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: '#4caf50',
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: '#4caf50',
                                },
                              }}
                            />
                          }
                          label={
                            <Box
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                bgcolor: service.status ? '#e8f5e9' : '#ffebee',
                                color: service.status ? '#2e7d32' : '#c62828',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: '0.875rem',
                                minWidth: 100,
                                justifyContent: 'center'
                              }}
                            >
                              {service.status ? 'Hoạt động' : 'Không hoạt động'}
                            </Box>
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {service.imagePath && (
                          <img 
                            src={service.imagePath} 
                            alt={service.serviceName}
                            style={{ 
                              width: '50px', 
                              height: '50px', 
                              objectFit: 'cover',
                              borderRadius: '4px'
                            }} 
                          />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => handleOpenEditDialog(service)}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            <TablePagination
              component="div"
              count={totalPages * pageSize}
              page={page - 1}
              rowsPerPage={pageSize}
              rowsPerPageOptions={[5, 10, 25]}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage={paginationLabels.labelRowsPerPage}
              labelDisplayedRows={paginationLabels.labelDisplayedRows}
              sx={{
                borderTop: '1px solid rgba(224, 224, 224, 1)',
                backgroundColor: '#fff'
              }}
            />
          </TableContainer>

          <Dialog 
            open={addDialogOpen} 
            onClose={() => !isSubmitting && setAddDialogOpen(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              }
            }}
          >
            <DialogTitle 
              sx={{ 
                borderBottom: '1px solid rgba(0,0,0,0.12)',
                px: 3,
                py: 2,
                bgcolor: '#f8f9fa'
              }}
            >
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                Thêm Dịch Vụ Mới
              </Typography>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Tên Dịch Vụ"
                    name="serviceName"
                    value={newService.serviceName}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Danh Mục</InputLabel>
                    <Select
                      value={newService.categoryId || ''}
                      onChange={(e) => setNewService({
                        ...newService,
                        categoryId: e.target.value
                      })}
                      label="Danh Mục"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.categoryId} value={category.categoryId}>
                          {category.categoryName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Giá Dịch Vụ"
                    name="price"
                    type="number"
                    value={newService.price}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                      inputProps: { min: 0 }
                    }}
                    helperText="Nhập giá không có dấu phẩy hoặc dấu chấm"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={newService.status}
                        onChange={handleInputChange}
                        name="status"
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        {newService.status ? 'Đang hoạt động' : 'Không hoạt động'}
                      </Typography>
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={4}
                    label="Mô Tả"
                    name="description"
                    value={newService.description}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      border: '1px dashed rgba(0,0,0,0.2)',
                      borderRadius: 1,
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.02)'
                      }
                    }}
                  >
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="image-upload"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="image-upload">
                      <Box sx={{ mb: 2 }}>
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ 
                              maxWidth: '100%',
                              maxHeight: '200px',
                              borderRadius: '8px'
                            }}
                          />
                        ) : (
                          <Box sx={{ color: 'text.secondary' }}>
                            <CloudUploadIcon sx={{ fontSize: 48, mb: 1 }} />
                            <Typography>
                              Kéo thả hoặc click để tải ảnh lên
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </label>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Vật Liệu</InputLabel>
                    <Select
                      multiple
                      value={selectedMaterials}
                      onChange={handleMaterialChange}
                      input={<OutlinedInput label="Vật Liệu" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((materialId) => {
                            const material = materials.find(m => m.materialId === materialId);
                            return (
                              <Chip
                                key={materialId}
                                label={material?.materialName}
                                sx={{
                                  bgcolor: 'primary.light',
                                  color: 'primary.contrastText'
                                }}
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {materials.map((material) => (
                        <MenuItem key={material.materialId} value={material.materialId}>
                          <Checkbox checked={selectedMaterials.indexOf(material.materialId) > -1} />
                          <ListItemText primary={material.materialName} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions 
              sx={{ 
                borderTop: '1px solid rgba(0,0,0,0.12)',
                px: 3,
                py: 2
              }}
            >
              <Button
                onClick={() => setAddDialogOpen(false)}
                variant="outlined"
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                onClick={handleAddService}
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Thêm Dịch Vụ'}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog 
            open={editDialogOpen} 
            onClose={() => !isSubmitting && setEditDialogOpen(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: dialogStyles.paper
            }}
          >
            <DialogTitle sx={dialogStyles.title}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                Chỉnh Sửa Dịch Vụ
              </Typography>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Tên Dịch Vụ"
                    name="serviceName"
                    value={editingService?.serviceName || ''}
                    onChange={(e) => setEditingService({
                      ...editingService,
                      serviceName: e.target.value
                    })}
                    error={!editingService?.serviceName}
                    helperText={!editingService?.serviceName ? "Tên dịch vụ là bắt buộc" : ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required error={!editingService?.categoryId}>
                    <InputLabel>Danh Mục</InputLabel>
                    <Select
                      value={editingService?.categoryId || ''}
                      onChange={(e) => setEditingService({
                        ...editingService,
                        categoryId: e.target.value
                      })}
                      label="Danh Mục"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.categoryId} value={category.categoryId}>
                          {category.categoryName}
                        </MenuItem>
                      ))}
                    </Select>
                    {!editingService?.categoryId && (
                      <FormHelperText>Vui lòng chọn danh mục</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Giá Dịch Vụ"
                    type="number"
                    value={editingService?.price || ''}
                    onChange={(e) => setEditingService({
                      ...editingService,
                      price: e.target.value
                    })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                      inputProps: { min: 0 }
                    }}
                    error={!editingService?.price}
                    helperText={!editingService?.price ? "Giá dịch vụ là bắt buộc" : "Nhập giá không có dấu phẩy hoặc dấu chấm"}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editingService?.status || false}
                        onChange={(e) => setEditingService({
                          ...editingService,
                          status: e.target.checked
                        })}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        {editingService?.status ? 'Đang hoạt động' : 'Không hoạt động'}
                      </Typography>
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={4}
                    label="Mô Tả"
                    value={editingService?.description || ''}
                    onChange={(e) => setEditingService({
                      ...editingService,
                      description: e.target.value
                    })}
                    error={!editingService?.description}
                    helperText={!editingService?.description ? "Mô tả là bắt buộc" : ""}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      border: '1px dashed rgba(0,0,0,0.2)',
                      borderRadius: 1,
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.02)'
                      }
                    }}
                  >
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="edit-image-upload"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="edit-image-upload">
                      <Box sx={{ mb: 2 }}>
                        {imagePreview || editingService?.imagePath ? (
                          <img
                            src={imagePreview || editingService?.imagePath}
                            alt="Preview"
                            style={{ 
                              maxWidth: '100%',
                              maxHeight: '200px',
                              borderRadius: '8px'
                            }}
                          />
                        ) : (
                          <Box sx={{ color: 'text.secondary' }}>
                            <CloudUploadIcon sx={{ fontSize: 48, mb: 1 }} />
                            <Typography>
                              Kéo thả hoặc click để tải ảnh lên
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </label>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth required error={selectedMaterials.length === 0}>
                    <InputLabel>Vật Liệu</InputLabel>
                    <Select
                      multiple
                      value={selectedMaterials}
                      onChange={handleMaterialChange}
                      input={<OutlinedInput label="Vật Liệu" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((materialId) => {
                            const material = materials.find(m => m.materialId === materialId);
                            return (
                              <Chip
                                key={materialId}
                                label={material?.materialName}
                                sx={{
                                  bgcolor: 'primary.light',
                                  color: 'primary.contrastText'
                                }}
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {materials.map((material) => (
                        <MenuItem 
                          key={material.materialId} 
                          value={material.materialId}
                          sx={{
                            borderRadius: 1,
                            m: 0.5,
                            '&:hover': {
                              backgroundColor: '#f5f5f5',
                            },
                            '&.Mui-selected': {
                              backgroundColor: '#e3f2fd',
                              '&:hover': {
                                backgroundColor: '#e3f2fd',
                              },
                            },
                          }}
                        >
                          <Checkbox checked={selectedMaterials.indexOf(material.materialId) > -1} />
                          <ListItemText primary={material.materialName} />
                        </MenuItem>
                      ))}
                    </Select>
                    {selectedMaterials.length === 0 && (
                      <FormHelperText>Vui lòng chọn ít nhất một vật liệu</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={dialogStyles.actions}>
              <Button
                onClick={() => setEditDialogOpen(false)}
                variant="outlined"
                disabled={isSubmitting}
                sx={buttonStyles.outlined}
              >
                Hủy
              </Button>
              <Button
                onClick={handleUpdateService}
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                sx={buttonStyles.contained}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Cập Nhật'}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={statusConfirmDialog.open}
            onClose={() => setStatusConfirmDialog({ open: false, serviceId: null, currentStatus: null })}
            PaperProps={{
              sx: {
                borderRadius: 2,
                width: '400px'
              }
            }}
          >
            <DialogTitle sx={{ 
              pb: 1,
              borderBottom: '1px solid rgba(0,0,0,0.12)'
            }}>
              Xác nhận thay đổi trạng thái
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <DialogContentText>
                Bạn có chắc chắn muốn {statusConfirmDialog.currentStatus ? 'tắt' : 'bật'} dịch vụ này?
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ 
              px: 3,
              py: 2,
              borderTop: '1px solid rgba(0,0,0,0.12)'
            }}>
              <Button
                onClick={() => setStatusConfirmDialog({ open: false, serviceId: null, currentStatus: null })}
                variant="outlined"
                sx={buttonStyles.outlined}
              >
                Hủy
              </Button>
              <Button
                onClick={handleStatusChange}
                variant="contained"
                color={statusConfirmDialog.currentStatus ? "error" : "success"}
                sx={buttonStyles.contained}
              >
                Xác nhận
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </div>
    </div>
  );
};

export default ServiceManagement;
