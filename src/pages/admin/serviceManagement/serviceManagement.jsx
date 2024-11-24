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
  Grid
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Sidebar from '../../../components/Sidebar/sideBar';
import { getAdminServices } from '../../../services/service';
import { getMaterialAdmin } from '../../../services/material';
import { createService } from '../../../services/service';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from "../../../firebase"; // Adjust the import path based on your Firebase config location
const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
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

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await getAdminServices(page, pageSize);
      setServices(response?.services || []);
      setTotalPages(response?.totalPage || 0);
      console.log('API Response:', response);
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
  }, [page, pageSize]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/services/${id}`);
      showSnackbar('Service deleted successfully', 'success');
      fetchServices();
    } catch (error) {
      showSnackbar('Failed to delete service', 'error');
      console.error(error);
    }
  };

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

  const handleAddService = async () => {
    try {
      setIsSubmitting(true);
      setUploadProgress(true);
      let imageUrl = '';
      
      if (imageUpload) {
        const imageRef = ref(storage, `services/${Date.now()}_${imageUpload.name}`);
        const snapshot = await uploadBytes(imageRef, imageUpload);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const serviceData = {
        categoryId: 1,
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
        
        // Reset form
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
    setSelectedMaterials(
      typeof value === 'string' ? value.split(',') : value,
    );
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
              onClick={() => setAddDialogOpen(true)}
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
                      <TableCell>{service.description}</TableCell>
                      <TableCell>${service.price}</TableCell>
                      <TableCell>
                        <Box sx={{
                          backgroundColor: service.status ? '#e8f5e9' : '#ffebee',
                          color: service.status ? '#2e7d32' : '#c62828',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          display: 'inline-block'
                        }}>
                          {service.status ? 'Hoạt Động' : 'Không Hoạt Động'}
                        </Box>
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
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => {
                            setSelectedService(service);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <DeleteIcon />
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
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Xóa Dịch Vụ</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Bạn có chắc chắn muốn xóa dịch vụ này? Hành động này không thể hoàn tác.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                Hủy
              </Button>
              <Button onClick={() => handleDelete(selectedService.id)} color="error" autoFocus>
                Xóa
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog 
            open={addDialogOpen} 
            onClose={() => !isSubmitting && setAddDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Thêm Dịch Vụ Mới</DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ mb: 2 }}>
                Vui lòng điền đầy đủ thông tin dịch vụ mới
              </DialogContentText>
              
              <TextField
                autoFocus
                margin="dense"
                name="serviceName"
                label="Tên Dịch Vụ"
                type="text"
                fullWidth
                value={newService.serviceName}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              
              <TextField
                margin="dense"
                name="description"
                label="Mô Tả"
                type="text"
                fullWidth
                multiline
                rows={3}
                value={newService.description}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              
              <TextField
                margin="dense"
                name="price"
                label="Giá"
                type="number"
                fullWidth
                value={newService.price}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Typography variant="body1">
                    Chọn hình ảnh cho dịch vụ
                  </Typography>
                </label>
              </Box>
              
              {imagePreview && (
                <Box sx={{ mb: 2 }}>
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    style={{ maxWidth: '100%', borderRadius: '4px' }}
                  />
                </Box>
              )}
              
              <FormControlLabel
                control={
                  <Switch
                    checked={newService.status}
                    onChange={handleInputChange}
                    name="status"
                  />
                }
                label="Trạng Thái Hoạt Động"
              />
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="materials-label">Vật Liệu</InputLabel>
                <Select
                  labelId="materials-label"
                  id="materials"
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
                              backgroundColor: '#e3f2fd',
                              '& .MuiChip-label': { color: '#1976d2' }
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 250,
                        width: 250,
                      },
                    },
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                      Chọn vật liệu cần thiết cho dịch vụ
                    </Typography>
                  </Box>
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
                      <Checkbox 
                        checked={selectedMaterials.indexOf(material.materialId) > -1}
                        sx={{
                          color: '#1976d2',
                          '&.Mui-checked': {
                            color: '#1976d2',
                          },
                        }}
                      />
                      <Box sx={{ ml: 1 }}>
                        <Typography variant="body1">
                          {material.materialName}
                        </Typography>
                       
                      </Box>
                    </MenuItem>
                  ))}
                  {materials.length === 0 && (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography color="text.secondary">
                        Không có vật liệu nào
                      </Typography>
                    </Box>
                  )}
                </Select>
                <FormHelperText>
                  Có thể chọn nhiều vật liệu cho một dịch vụ
                </FormHelperText>
              </FormControl>

              {selectedMaterials.length > 0 && (
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    mb: 2,
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Vật liệu đã chọn:
                  </Typography>
                  <Grid container spacing={1}>
                    {selectedMaterials.map((materialId) => {
                      const material = materials.find(m => m.materialId === materialId);
                      return (
                        <Grid item key={materialId} xs={12} sm={6} md={4} lg={3}>
                          <Chip
                            label={material?.materialName}
                            sx={{
                              backgroundColor: '#e3f2fd',
                              '& .MuiChip-label': { color: '#1976d2' }
                            }}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Paper>
              )}
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setAddDialogOpen(false)}
                color="inherit"
              >
                Hủy
              </Button>
              <Button 
                onClick={handleAddService}
                variant="contained"
                color="primary"
              >
                Thêm Dịch Vụ
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
