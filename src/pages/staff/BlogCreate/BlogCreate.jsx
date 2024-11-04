// BlogEditor.js
import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./BlogCreate.css";
import Sidebar from "../../../components/Sidebar/sideBar";

const BlogCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const quillRef = useRef();

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

  return (
    <div className="blog-create-layout">
      <Sidebar />
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

        <div className="blog-create-toolbar">
          <div className="blog-create-categories">
            <select
              className="blog-create-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">-- Chọn danh mục --</option>
              <option value="tin-tuc">Tin tức</option>
              <option value="thong-bao">Thông báo</option>
              <option value="dich-vu">Dịch vụ</option>
              <option value="huong-dan">Hướng dẫn</option>
              <option value="ky-niem">Kỷ niệm</option>
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
          <button
            className="blog-create-preview-btn"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? "Chỉnh sửa" : "Xem trước"}
          </button>
          <div className="blog-create-publish-group">
            <button className="blog-create-draft-btn">Lưu nháp</button>
            <button className="blog-create-publish-btn">Đăng bài</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCreate;
