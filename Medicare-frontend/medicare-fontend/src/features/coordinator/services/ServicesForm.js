import React, { useState, useEffect } from 'react';
import '../../../style/ServicesForm.css';

const ConfirmModal = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <div className="confirm-modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="close-btn" onClick={onCancel} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="confirm-modal-body">
          <div className="confirm-modal-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D479A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12" y2="17" />
            </svg>
          </div>
          <p className="modal-message">{message}</p>
        </div>
        <div className="modal-actions">
          <button className="modal-btn confirm" onClick={onConfirm}>Xác nhận</button>
          <button className="modal-btn cancel" onClick={onCancel}>Hủy bỏ</button>
        </div>
      </div>
    </div>
  );
};

const ServicesForm = ({ onClose, onSubmit, editingService = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    doctor: '',
    price: '',
    duration: '',
    description: '',
    image: null,
    imageName: null
  });
  const [errors, setErrors] = useState({});
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (editingService) {
      setFormData({
        name: editingService.name || '',
        department: editingService.department || '',
        doctor: editingService.doctor || '',
        price: editingService.price ? editingService.price.replace(/\D/g, '') : '',
        duration: editingService.duration ? editingService.duration.replace(/\D/g, '') : '',
        description: editingService.description || '',
        image: editingService.image || null,
        imageName: editingService.imageName || null
      });
    }
  }, [editingService]);

  const formatPrice = (value) => {
    if (!value) return '';
    const number = value.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setFormData(prev => ({ ...prev, [name]: formatPrice(value) }));
    } else if (name === 'duration') {
      // Chỉ cho nhập số
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Chỉ chấp nhận file PNG, JPG, JPEG hoặc GIF' }));
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, image: 'Kích thước file không được vượt quá 5MB' }));
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, image: event.target.result, imageName: file.name }));
        if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null, imageName: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Tên dịch vụ khám là bắt buộc';
    if (!formData.department) newErrors.department = 'Chuyên khoa là bắt buộc';
    if (!formData.doctor) newErrors.doctor = 'Bác sĩ phụ trách là bắt buộc';
    if (!formData.price.trim()) newErrors.price = 'Chi phí dịch vụ là bắt buộc';
    else {
      const priceNumber = parseInt(formData.price.replace(/,/g, ''));
      if (isNaN(priceNumber) || priceNumber <= 0) newErrors.price = 'Chi phí phải là số dương hợp lệ';
    }
    if (!formData.duration.trim()) newErrors.duration = 'Thời gian thực hiện là bắt buộc';
    else {
      const durationNumber = parseInt(formData.duration);
      if (isNaN(durationNumber) || durationNumber < 15 || durationNumber > 120) newErrors.duration = 'Thời gian phải từ 15 đến 120 phút';
    }
    if (formData.description && formData.description.length > 500) newErrors.description = 'Mô tả không được vượt quá 500 ký tự';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, price: formData.price, duration: formData.duration });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setShowCancelModal(true);
  };

  return (
    <>
      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowCancelModal(true)}>
        <div className="modal-container">
          <div className="modal-header">
            <h2>{editingService ? 'SỬA DỊCH VỤ KHÁM' : 'THÊM DỊCH VỤ KHÁM'}</h2>
            <button className="close-btn" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <form className="services-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Tên dịch vụ khám: <span className="required">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                placeholder="Ví dụ: Khám da liễu"
                autoComplete="off"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="department">Chuyên khoa: <span className="required">*</span></label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={errors.department ? 'error' : ''}
                >
                  <option value="">-- Chọn chuyên khoa --</option>
                  <option value="Da liễu">Da liễu</option>
                  <option value="Hô Hấp">Hô Hấp</option>
                  <option value="Nội tổng quát">Nội tổng quát</option>
                  <option value="Tim mạch">Tim mạch</option>
                </select>
                {errors.department && <span className="error-message">{errors.department}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="doctor">Bác sĩ phụ trách: <span className="required">*</span></label>
                <select
                  id="doctor"
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleInputChange}
                  className={errors.doctor ? 'error' : ''}
                >
                  <option value="">-- Chọn bác sĩ --</option>
                  <option value="BS.Nguyễn Quang Hiếu">BS.Nguyễn Quang Hiếu</option>
                  <option value="BS.Đỗ Thị Hiền Lương">BS.Đỗ Thị Hiền Lương</option>
                  <option value="BS.Trần Văn A">BS.Trần Văn A</option>
                </select>
                {errors.doctor && <span className="error-message">{errors.doctor}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Chi phí dịch vụ (VND): <span className="required">*</span></label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={errors.price ? 'error' : ''}
                  placeholder="Ví dụ: 500,000"
                  autoComplete="off"
                  inputMode="numeric"
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="duration">Thời gian thực hiện (phút): <span className="required">*</span></label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className={errors.duration ? 'error' : ''}
                  placeholder="Ví dụ: 30"
                  autoComplete="off"
                  inputMode="numeric"
                />
                {errors.duration && <span className="error-message">{errors.duration}</span>}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="description">Mô tả dịch vụ:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={errors.description ? 'error' : ''}
                placeholder="Nhập mô tả chi tiết về dịch vụ khám (tối đa 500 ký tự)"
                maxLength={500}
              />
              <div className="character-count">{formData.description.length}/500</div>
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
            <div className="form-group image-upload-container">
              <label>Ảnh minh họa:</label>
              <div className="image-upload-area">
                {formData.image ? (
                  <div className="image-preview-section">
                    <img src={formData.image} alt="preview" className="preview-image" />
                    <div className="change-placeholder">Thay đổi ảnh minh họa<br/>PNG, JPG, GIF</div>
                  </div>
                ) : (
                  <label htmlFor="image-upload-input" className="upload-placeholder" style={{ cursor: 'pointer' }}>
                    <svg width="32" height="32" fill="none" stroke="#1D479A" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 16V4M8 8l4-4 4 4"/><rect x="4" y="16" width="16" height="4" rx="2"/></svg>
                    <p>Nhấp để chọn ảnh hoặc kéo thả tại đây</p>
                    <span>PNG, JPG, GIF</span>
                  </label>
                )}
                <input
                  type="file"
                  accept="image/png, image/jpg, image/jpeg, image/gif"
                  style={{ display: 'none' }}
                  id="image-upload-input"
                  onChange={handleImageUpload}
                />
              </div>
              {formData.imageName && (
                <div className="file-info success">
                  <svg width="18" height="18" fill="#38A169" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" /></svg>
                  {formData.imageName}
                  <button type="button" className="remove-file-btn" onClick={handleRemoveImage}>&times;</button>
                </div>
              )}
              {errors.image && <span className="error-message">{errors.image}</span>}
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">Xác nhận</button>
              <button type="button" className="cancel-btn" onClick={handleCancel}>Hủy bỏ</button>
            </div>
          </form>
        </div>
      </div>
      <ConfirmModal
        open={showCancelModal}
        title="XÁC NHẬN THOÁT"
        message={editingService ? "Bạn có muốn thoát khỏi chức năng sửa dịch vụ không?" : "Bạn có muốn thoát khỏi chức năng thêm dịch vụ không?"}
        onConfirm={onClose}
        onCancel={() => setShowCancelModal(false)}
      />
    </>
  );
};

export default ServicesForm;