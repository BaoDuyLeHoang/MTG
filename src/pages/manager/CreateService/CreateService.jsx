import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  MenuItem,
  Paper,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import AlertMessage from "../../../components/AlertMessage/AlertMessage";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import "./CreateService.css";
import Sidebar from "../../../components/Sidebar/sideBar";
import { storage } from "../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const MATERIAL_CATEGORIES = [
  "Bia mộ",
  "Đế bia",
  "Bảng khắc",
  "Bình hoa",
  "Phụ kiện trang trí",
];

const DUMMY_MATERIALS = [
  {
    id: 1,
    materialName: "Granite Headstone",
    description: "High-quality granite headstone",
    category: "Headstones",
    code: "GH-001",
  },
  {
    id: 2,
    materialName: "Marble Base",
    description: "Solid marble base",
    category: "Bases",
    code: "MB-002",
  },
  {
    id: 3,
    materialName: "Bronze Plaque",
    description: "Custom bronze memorial plaque",
    category: "Plaques",
    code: "BP-003",
  },
  // Add more materials as needed
];

const CreateService = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [formData, setFormData] = useState({
    categoryId: "",
    serviceName: "",
    description: "",
    imagePath: "",
    materials: [],
  });

  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const [materialFilter, setMaterialFilter] = useState({
    search: "",
    category: null,
  });

  const handleAlertClose = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addMaterial = () => {
    if (selectedMaterial) {
      const materialToAdd = DUMMY_MATERIALS.find(
        (m) => m.id === selectedMaterial.id
      );
      if (materialToAdd) {
        setFormData((prev) => ({
          ...prev,
          materials: [
            ...prev.materials,
            {
              materialName: materialToAdd.materialName,
              description: materialToAdd.description,
              quantity: selectedQuantity,
            },
          ],
        }));
        setSelectedMaterial(null);
        setSelectedQuantity(1);
      }
    }
  };

  const removeMaterial = (index) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, `services/${Date.now()}_${file.name}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update form data with the image URL
      setFormData(prev => ({
        ...prev,
        imagePath: downloadURL
      }));

      setAlert({
        open: true,
        severity: "success",
        message: "Image uploaded successfully"
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      setAlert({
        open: true,
        severity: "error",
        message: "Failed to upload image"
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Replace with your API endpoint
      await axios.post("/api/services", formData);
      setAlert({
        open: true,
        severity: "success",
        message: "Service created successfully",
      });
      setFormData({
        categoryId: "",
        serviceName: "",
        description: "",
        imagePath: "",
        materials: [],
      });
    } catch (error) {
      setAlert({
        open: true,
        severity: "error",
        message: "Failed to create service",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter materials based on search and category
  const filteredMaterials = DUMMY_MATERIALS.filter((material) => {
    const searchTerm = materialFilter.search.toLowerCase();
    const matchesSearch =
      material.materialName.toLowerCase().includes(searchTerm) ||
      material.code.toLowerCase().includes(searchTerm) ||
      material.description.toLowerCase().includes(searchTerm);
    const matchesCategory =
      !materialFilter.category || material.category === materialFilter.category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Container maxWidth="md" sx={{ flex: 1, padding: "20px" }}>
        <AlertMessage
          open={alert.open}
          handleClose={handleAlertClose}
          severity={alert.severity}
          message={alert.message}
        />

        <Box className="create-service-container">
          <div className="create-dervice-title">
            <h1>Tạo Dịch Vụ Mới</h1>
          </div>

          <Paper className="form-container">
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Typography variant="h6" className="section-title">
                Thông Tin Cơ Bản
              </Typography>

              <TextField
                select
                margin="normal"
                required
                fullWidth
                id="categoryId"
                label="Danh Mục"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
              >
                <MenuItem value="1">Dịch vụ khắc bia mộ</MenuItem>
                <MenuItem value="2">Dịch vụ chạm khắc</MenuItem>
                <MenuItem value="3">Dịch vụ sửa chữa</MenuItem>
                <MenuItem value="4">Dịch vụ vệ sinh</MenuItem>
                <MenuItem value="5">Dịch vụ bảo dưỡng</MenuItem>
              </TextField>

              <TextField
                margin="normal"
                required
                fullWidth
                id="serviceName"
                label="Tên Dịch Vụ"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleChange}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="description"
                label="Mô Tả"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />

              <Button
                variant="outlined"
                component="label"
                fullWidth
                className="upload-button"
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  Tải Lên Hình Ảnh Dịch Vụ
                </Box>
              </Button>

              <div className="materials-section">
                <Typography variant="h6" className="section-title">
                  Vật Liệu
                </Typography>

                <div className="materials-input-group">
                  <Autocomplete
                    fullWidth
                    value={selectedMaterial}
                    onChange={(_, newValue) => setSelectedMaterial(newValue)}
                    options={filteredMaterials}
                    getOptionLabel={(option) =>
                      `${option.materialName} (${option.code})`
                    }
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Box>
                          <Typography variant="subtitle1">
                            {option.materialName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Mã: {option.code} | Danh mục: {option.category}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chọn Vật Liệu"
                        placeholder="Nhập để tìm kiếm vật liệu..."
                      />
                    )}
                  />

                  <TextField
                    type="number"
                    label="Số Lượng"
                    value={selectedQuantity}
                    onChange={(e) =>
                      setSelectedQuantity(parseInt(e.target.value) || 1)
                    }
                    InputProps={{ inputProps: { min: 1 } }}
                    className="quantity-input"
                  />

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addMaterial}
                    disabled={!selectedMaterial}
                    className="add-material-button"
                  >
                    Thêm
                  </Button>
                </div>

                <Paper variant="outlined" className="materials-list-container">
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Vật Liệu Đã Chọn:
                  </Typography>
                  <List>
                    {formData.materials.map((material, index) => (
                      <ListItem
                        key={index}
                        divider={index < formData.materials.length - 1}
                        className="material-list-item"
                      >
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2">
                              {material.materialName}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {material.description}
                              </Typography>
                              <Typography variant="body2" color="primary">
                                Số Lượng: {material.quantity}
                              </Typography>
                            </>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => removeMaterial(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                  {formData.materials.length === 0 && (
                    <Typography className="empty-materials">
                      Chưa có vật liệu nào được thêm
                    </Typography>
                  )}
                </Paper>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Tạo Dịch Vụ"
                  )}
                </Button>
              </div>
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default CreateService;
