import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useHistory
import { getBlogById, updateBlogStatus } from '../../../services/blog'; // Import the new function
import './BlogDetailManager.css'; // Import the CSS file for styling
import Sidebar from '../../../components/Sidebar/sideBar';

const BlogDetail = () => {
    const { blogId } = useParams(); // Get the blogId from the URL parameters
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const blogData = await getBlogById(blogId); // Use the service function
                setBlog(blogData); // Set the blog data
            } catch (err) {
                setError(err.message || 'Có lỗi xảy ra khi tải thông tin bài viết');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogDetails();
    }, [blogId]);

    const handleUpdateStatus = async () => {
        if (!blog) return; // Ensure blog data is available
        const newStatus = !blog.status; // Toggle the status
        try {
            await updateBlogStatus(blogId, newStatus); // Call the updateBlogStatus function
            setBlog({ ...blog, status: newStatus }); // Update the local state with the new status
            setError(null); // Clear any previous error
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi cập nhật trạng thái bài viết');
        }
    };

    if (loading) {
        return <div className="loading">Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    // Determine the status text and color
    const statusText = blog.status ? "Đã duyệt" : "Chờ duyệt";
    const statusClass = blog.status ? "green" : "yellow";

    return (
        <div className="blog-detail-manager-layout-wrapper">
            <Sidebar />
            <div className="blog-detail-manager-container">
                {/* Back Arrow Button */}
                <button className="back-button" onClick={() => window.history.back()}>
                    &#8592; Quay lại
                </button>
                <h1 className="blog-title">{blog.blogName}</h1>
                {/* Display current status */}
                <div className="status-display-container"> {/* New container for centering */}
                    <div className={`status-display ${statusClass}`}>
                        <strong>{statusText}</strong>
                    </div>
                </div>
                <p className="blog-author"><strong>Tác giả:</strong> {blog.fullName}</p>
                <p className="blog-category"><strong>Sự kiện:</strong> {blog.blogCategoryName}</p>
                <p className="blog-description"><strong>Mô tả:</strong> {blog.blogDescription}</p>
                <div className="blog-content">
                    <h2>Nội dung chi tiết:</h2>
                    <p>{blog.blogContent}</p>
                </div>
                <div className="historical-images">
                    <h3>Hình ảnh lịch sử:</h3>
                    {blog.historicalImages && blog.historicalImages.map((image, index) => (
                        <img key={index} src={image} alt={`Historical Image ${index + 1}`} className="historical-image" />
                    ))}
                </div>
                <div className="related-martyrs">
                    <h3>Các liệt sĩ liên quan:</h3>
                    <div className="related-martyrs-list">
                        {blog.relatedMartyrDetails && blog.relatedMartyrDetails.map((martyr) => (
                            <div key={martyr.martyrGraveId} className="martyr-detail">
                                <h4>{martyr.name}</h4>
                                {martyr.images && martyr.images.length > 0 && ( // Kiểm tra nếu có hình ảnh
                                    <img src={martyr.images[0]} alt={`Martyr Image 1`} className="martyr-image" /> // Chỉ lấy hình đầu tiên
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Status Update Button */}
                <div className="status-button-container">
                    <button className="status-button" onClick={handleUpdateStatus}>
                        {blog.status ? 'Vô hiệu hóa' : 'Kích hoạt'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default BlogDetail;