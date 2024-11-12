import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import './ServiceList.css';
import Sidebar from '../../../components/Sidebar/sideBar';


const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // TODO: Replace this with actual API call
  useEffect(() => {
    // Dummy data matching your service structure
    const dummyServices = [
      {
        serviceId: 8,
        categoryId: 4,
        categoryName: "Cắm hoa lễ tưởng niệm",
        serviceName: "Cắm hoa thường ngày",
        description: "Dịch vụ cắm hoa thường ngày cho các mộ liệt sĩ",
        price: 189000,
        imagePath: "https://firebasestorage.googleapis.com/...",
        status: true
      },
    ];
    setServices(dummyServices);
  }, []);

  // Format price to VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Filter services based on search and filters
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.categoryName === categoryFilter;
    const matchesStatus = statusFilter === 'all' || service.status === (statusFilter === 'active');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories for filter
  const categories = ['all', ...new Set(services.map(service => service.categoryName))];

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <div className="service-list-container">
          <div className="service-list-header">
            <h1>Danh sách dịch vụ</h1>
            
            {/* Filters Section */}
            <Box className="filters-container">
              <TextField
                variant="outlined"
                size="small"
                placeholder="Tìm kiếm theo tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              
              <FormControl size="small" className="filter-select">
                <InputLabel>Danh mục</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Danh mục"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  {categories.filter(cat => cat !== 'all').map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" className="filter-select">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Trạng thái"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>

          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Hình ảnh</TableCell>
                  <TableCell>Tên dịch vụ</TableCell>
                  <TableCell>Danh mục</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.serviceId}>
                    <TableCell>
                      <img 
                        src={service.imagePath} 
                        alt={service.serviceName} 
                        className="service-image"
                      />
                    </TableCell>
                    <TableCell>{service.serviceName}</TableCell>
                    <TableCell>{service.categoryName}</TableCell>
                    <TableCell>{service.description}</TableCell>
                    <TableCell>{formatPrice(service.price)}</TableCell>
                    <TableCell>
                      <span className={`status-badge ${service.status ? 'active' : 'inactive'}`}>
                        {service.status ? 'Hoạt động' : 'Ngừng hoạt động'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default ServiceList;
