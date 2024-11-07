// BlogEditor.js
import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./BlogCreate.css";
import Sidebar from "../../../components/Sidebar/sideBar";
import { getAllHistoricalEvents } from '../../../services/historical';
import { createBlog } from '../../../services/blog';
import AlertMessage from '../../../components/AlertMessage/AlertMessage';

const BlogCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const quillRef = useRef();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const events = await getAllHistoricalEvents();
        const mappedCategories = events.map(event => ({
          value: event.historyId,
          label: event.historyEventName
        }));
        setCategories(mappedCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ color: [] }, { background: [] }],
      ["link", "image"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "color",
    "background",
    "link",
    "image",
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        // Insert image into Quill editor
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, "image", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handlePublish = async () => {
    try {
      setError(null);
      setIsSubmitting(true);

      if (!title || !content || !category) {
        throw new Error('Vui lòng điền đầy đủ tiêu đề, nội dung và danh mục');
      }

      const blogData = {
        historyId: parseInt(category),
        blogName: title,
        blogDescription: description,
        blogContent: content,
        historicalImageUrls: imagePreview ? [imagePreview] : [],
        relatedMartyrIds: []
      };

      await createBlog(blogData);
      // Show success message using AlertMessage
      setAlertSeverity('success');
      setAlertMessage('Bài viết đã được đăng thành công!');
      setAlertOpen(true);
      
      // Optional: Clear form or redirect
      // window.location.href = '/staff/blogs';
      
    } catch (error) {
      setError(error.message);
      // Show error message using AlertMessage
      setAlertSeverity('error');
      setAlertMessage(error.message);
      setAlertOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="blog-create-layout">
      <Sidebar />
      <AlertMessage
        open={alertOpen}
        handleClose={handleAlertClose}
        severity={alertSeverity}
        message={alertMessage}
      />
      
      <div className="blog-create-container">
        <div className="blog-create-header">
          <h1 className="blog-create-title">Tạo Bài Viết Mới</h1>
          <input
            type="text"
            className="blog-create-title-input"
            placeholder="Nhập tiêu đề bài viết..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="blog-create-description">
          <textarea
            className="blog-create-description-input"
            placeholder="Nhập mô tả ngắn cho bài viết..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="blog-create-toolbar">
          <div className="blog-create-categories">
            <select
              className="blog-create-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="blog-create-image-upload">
            <button className="blog-create-image-button">
              Tải lên hình ảnh
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </button>
          </div>
        </div>

        <div className="blog-create-body">
          <div className={`blog-create-main ${isPreview ? "hidden" : ""}`}>
            <ReactQuill
              ref={quillRef}
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="Bắt đầu viết bài..."
              className="blog-create-quill"
            />
          </div>

          {isPreview && (
            <div className="blog-create-preview">
              <h2>Xem trước bài viết</h2>
              <div
                className="blog-create-preview-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          )}
        </div>

        <div className="blog-create-actions">
          {error && <div className="blog-create-error">{error}</div>}
          
          <button
            className="blog-create-preview-btn"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? "Chỉnh sửa" : "Xem trước"}
          </button>
          
          <div className="blog-create-publish-group">
            <button 
              className="blog-create-draft-btn"
              disabled={isSubmitting}
            >
              Lưu nháp
            </button>
            <button
              className="blog-create-publish-btn"
              onClick={handlePublish}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang đăng..." : "Đăng bài"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCreate;
