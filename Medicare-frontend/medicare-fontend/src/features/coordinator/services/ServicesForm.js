import React, { useState, useEffect } from 'react';
import '../../../style/ServicesForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { GetSpecialtiesAsync, GetDoctorsAsync } from '../../../api/ServicesDropdownApi';

const ConfirmModal = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="w-confirm-modal-overlay">
      <div className="w-confirm-modal">
        <div className="w-confirm-modal-header">
          <h3 className="w-modal-title">{title}</h3>
          <button className="close-button" onClick={onCancel} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="w-confirm-modal-body">
          <FontAwesomeIcon icon={faCircleQuestion} style={{ color: '#1D479A', marginRight: '8px' }} />
          <p className="w-modal-message">{message}</p>
        </div>
        <div className="w-modal-actions">
          <button className="w-modal-button confirm" onClick={onConfirm}>Xác nhận</button>
          <button className="w-modal-button cancel" onClick={onCancel}>Hủy bỏ</button>
        </div>
      </div>
    </div>
  );
};

const ServicesForm = ({ onClose, onSubmit, editingService = null }) => {
  const [formData, setFormData] = useState({
    serviceName: '',
    specialtyId: '',
    doctorId: '',
    cost: '',
    duration: '',
    description: '',
    image: null,
    imageName: null
  });
  const [errors, setErrors] = useState({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allDoctors, setAllDoctors] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Lấy dữ liệu chuyên khoa và bác sĩ khi component được tạo
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const specialtiesResponse = await GetSpecialtiesAsync();
        setSpecialties(specialtiesResponse.data || []);
        console.log('Từng chuyên khoa:', specialtiesResponse.data);
      } catch (error) {
        console.error('Error fetching specialties:', error);
        setSpecialties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Thiết lập dữ liệu khi chỉnh sửa dịch vụ
  useEffect(() => {
    if (editingService) {
      setFormData({
        serviceName: editingService.serviceName || editingService.name || '',
        name: editingService.name || editingService.serviceName || '',
        specialtyId: editingService.specialtyId || '',
        doctorId: editingService.doctorId || '',
        cost: editingService.cost ? editingService.cost.toString().replace(/\D/g, '') : '',
        duration: editingService.duration ? editingService.duration.toString() : '',
        description: editingService.description || '',
        image: editingService.image || null,
        imageName: editingService.imageName || null
      });
    }
  }, [editingService]);

  // Định dạng giá tiền
  const formatPrice = (value) => {
    if (!value) return '';
    const number = value.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cost') {
      // Chỉ cho phép nhập số, loại bỏ ký tự không phải số
      const numericValue = value.replace(/[^0-9]/g, '');
      // Format lại dấu phẩy phần nghìn
      const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'duration') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Xử lý upload ảnh
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Chỉ chấp nhận file PNG, JPG, JPEG hoặc GIF' }));
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
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

  // Xử lý xóa ảnh
  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null, imageName: null }));
  };

  // Kiểm tra tính hợp lệ của form
  const validateForm = () => {
    const newErrors = {};

    // Tên dịch vụ khám
    if (!((formData.serviceName || formData.name || '').toString().trim())) {
      newErrors.name = 'Tên dịch vụ khám là bắt buộc';
    }

    // Chuyên khoa (specialtyId là số hoặc chuỗi số)
    if (formData.specialtyId === undefined || formData.specialtyId === null || formData.specialtyId === '' || isNaN(Number(formData.specialtyId))) {
      newErrors.specialtyId = 'Chuyên khoa là bắt buộc';
    }

    // Bác sĩ (doctorId là số hoặc chuỗi số)
    if (formData.doctorId === undefined || formData.doctorId === null || formData.doctorId === '' || isNaN(Number(formData.doctorId))) {
      newErrors.doctorId = 'Bác sĩ là bắt buộc';
    }

    // Chi phí
    if (!((formData.cost || '').toString().trim())) {
      newErrors.cost = 'Chi phí dịch vụ là bắt buộc';
    } else {
      const costNumber = parseInt((formData.cost || '').toString().replace(/,/g, ''));
      if (isNaN(costNumber) || costNumber <= 0) {
        newErrors.cost = 'Chi phí phải là số dương hợp lệ';
      }
    }

    // Thời gian thực hiện
    if (!((formData.duration || '').toString().trim())) {
      newErrors.duration = 'Thời gian thực hiện là bắt buộc';
    } else {
      const durationNumber = parseInt(formData.duration);
      if (isNaN(durationNumber) || durationNumber < 15 || durationNumber > 120) {
        newErrors.duration = 'Thời gian phải từ 15 đến 120 phút';
      }
    }

    // Mô tả
    if ((formData.description || '').length > 500) {
      newErrors.description = 'Mô tả không được vượt quá 500 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form trước khi gửi
      if (!validateForm()) {
        console.log('Form validation failed:', errors);
        return;
      }

      // Tạo object dữ liệu gửi lên server
      const submissionData = {
        serviceId: editingService?.serviceId,
        serviceName: formData.serviceName || formData.name || '',
        description: formData.description || '',
        cost: parseInt(formData.cost.replace(/,/g, '')),
        duration: parseInt(formData.duration),
        doctorId: parseInt(formData.doctorId),
        specialtyId: parseInt(formData.specialtyId),
        image: formData.image || null
      };

      console.log('Dữ liệu gửi đi:', submissionData);

      // Sử dụng prop onSubmit đã được truyền vào
      await onSubmit(submissionData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        console.error("Validation errors:", validationErrors);
      }
    }
  };

  // Xử lý hủy form
  const handleCancel = (e) => {
    e.preventDefault();
    setShowCancelModal(true);
  };

  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        const doctorsResponse = await GetDoctorsAsync();
        console.log('Từng bác sĩ:', doctorsResponse.data);
        setAllDoctors(doctorsResponse.data || []);
        if (allDoctors.length > 0) {
          console.log('Bác sĩ mẫu:', allDoctors[0]);
        }
      } catch (error) {
        setAllDoctors([]);
      }
    };
    fetchAllDoctors();
  }, []);

  useEffect(() => {
    if (formData.specialtyId) {
      const selectedSpecialty = specialties.find(
        (s) => String(s.specialtyId) === String(formData.specialtyId)
      );
      const specialtyName = selectedSpecialty ? selectedSpecialty.specialtyName : "";
      console.log('specialtyName được chọn:', specialtyName);
      const filtered = allDoctors.filter((doctor) => {
        if (doctor.specialtyName) {
          return (doctor.specialtyName || "") === (specialtyName || "");
        }
        if (doctor.specialty && doctor.specialty.specialtyName) {
          return (doctor.specialty.specialtyName || "") === (specialtyName || "");
        }
        if (doctor.specialtyId) {
          return String(doctor.specialtyId) === String(formData.specialtyId);
        }
        return false;
      });
      console.log('Bác sĩ theo chuyên khoa:', filtered);
      setDoctors(filtered);
    } else {
      setDoctors(allDoctors);
    }
  }, [formData.specialtyId, allDoctors, specialties]);

  useEffect(() => {
    if (editingService && specialties.length > 0) {
      setFormData(prev => ({
        ...prev,
        specialtyId: String(editingService.specialtyId),
      }));
    }
  }, [specialties, editingService]);

  useEffect(() => {
    if (editingService && doctors.length > 0) {
      setFormData(prev => ({
        ...prev,
        doctorId: String(editingService.doctorId),
      }));
    }
  }, [doctors, editingService]);

  return (
    <>
      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowCancelModal(true)}>
        <div className="modal-container">
          <div className="modal-header">
            <h2>{editingService ? 'SỬA DỊCH VỤ KHÁM' : 'THÊM DỊCH VỤ KHÁM'}</h2>
            <button className="close-btn" onClick={() => setShowCancelModal(true)}>×</button>
          </div>

          <form className="services-form" onSubmit={handleSubmit}>
            {loading && (
              <div className="loading-indicator">
                <div className="loading-spinner"></div>
                <p>Đang tải dữ liệu...</p>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="serviceName">Tên dịch vụ khám: <span className="required">*</span></label>
              <input
                type="text"
                id="serviceName"
                name="serviceName"
                value={formData.serviceName || formData.name || ""}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                placeholder="Ví dụ: Khám da liễu"
                autoComplete="off"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="specialtyId">Chuyên khoa: <span className="required">*</span></label>
                <select
                  id="specialtyId"
                  name="specialtyId"
                  value={formData.specialtyId}
                  onChange={handleInputChange}
                  className={errors.specialtyId ? 'error' : ''}
                  disabled={loading}
                >
                  <option value="">-- Chọn chuyên khoa --</option>
                  {specialties.map((spec) => (
                    <option key={spec.specialtyId || spec.id} value={spec.specialtyId || spec.id}>
                      {spec.specialtyName || spec.name}
                    </option>
                  ))}
                </select>
                {errors.specialtyId && <span className="error-message">{errors.specialtyId}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="doctorId">Bác sĩ phụ trách: <span className="required">*</span></label>
                <select
                  id="doctorId"
                  name="doctorId"
                  value={formData.doctorId || ""}
                  onChange={handleInputChange}
                  className={errors.doctorId ? 'error' : ''}
                >
                  <option key="default" value="">Chọn bác sĩ</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.doctorId} value={doctor.doctorId}>
                      {doctor.fullName}
                    </option>
                  ))}
                </select>
                {errors.doctorId && <span className="error-message">{errors.doctorId}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cost">Chi phí dịch vụ (VND): <span className="required">*</span></label>
                <input
                  type="text"
                  id="cost"
                  name="cost"
                  value={formData.cost || ""}
                  onChange={handleInputChange}
                  className={errors.cost ? 'error' : ''}
                  placeholder="Ví dụ: 200,000"
                  autoComplete="off"
                  inputMode="numeric"
                />
                {errors.cost && <span className="error-message">{errors.cost}</span>}
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
                    <label htmlFor="image-upload-input" className="change-image-btn" style={{ cursor: 'pointer', color: '#1D479A', textDecoration: 'underline', marginTop: 8, display: 'inline-block' }}>
                      Chọn lại ảnh
                    </label>
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
                <div className="file-info success" style={{background: '#e6f9f0', color: '#222', display: 'flex', alignItems: 'center', borderRadius: 8, padding: '8px 12px', marginTop: 8, boxShadow: '0 0 4px #0db52022'}}>
                  <i className="fa-regular fa-image" style={{color: '#0db520', fontSize: 20, marginRight: 8}}></i>
                  <span style={{flex: 1}}>{formData.imageName}</span>
                  <button type="button" className="remove-file-btn" style={{color: '#e74c3c', fontSize: 22, background: 'none', border: 'none', cursor: 'pointer'}} onClick={handleRemoveImage}>&times;</button>
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
        message={editingService ? 'Bạn có muốn thoát khỏi chức năng sửa dịch vụ không?' : 'Bạn có muốn thoát khỏi chức năng thêm dịch vụ không?'}
        onConfirm={onClose}
        onCancel={() => setShowCancelModal(false)}
      />
      {showSuccessMessage && (
        <div className="success-toast">
          <div className="success-icon">✔</div>
          <div>Sửa dịch vụ khám thành công</div>
        </div>
      )}
    </>
  );
};

export default ServicesForm;
