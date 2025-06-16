import React, { useState, useEffect } from 'react';
import ConfirmModal from '../../../components/ConfirmModal';
import '../../../style/DoctorForm.css';
import * as DoctorApi from '../../../api/DoctorApi';

const DoctorForm = ({ onClose, onSubmit, editingDoctor = null }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    doctorId: '',
    dateOfBirth: '',
    gender: 'Nam',
    phoneNumber: '',
    email: '',
    specialtyId: '',
    qualification: '',
    yearsOfExperience: '',
    avatar: '',
    bio: ''
  });

  const [errors, setErrors] = useState({});
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  // ...existing code...
  useEffect(() => {
    if (editingDoctor) {
      // Chuyển đổi ngày sinh về yyyy-MM-dd nếu có
      let dateOfBirth = editingDoctor.dateOfBirth || '';
      if (dateOfBirth && dateOfBirth.includes('T')) {
        dateOfBirth = dateOfBirth.split('T')[0];
      }
      setFormData({
        fullName: editingDoctor.fullName || '',
        doctorId: editingDoctor.doctorId || '',
        dateOfBirth: dateOfBirth,
        gender: editingDoctor.gender || 'Nam',
        phoneNumber: editingDoctor.phoneNumber || '',
        email: editingDoctor.email || '',
        specialtyId: editingDoctor.specialtyId !== undefined && editingDoctor.specialtyId !== null
          ? String(editingDoctor.specialtyId)
          : '',
        qualification: editingDoctor.qualification || '',
        yearsOfExperience: editingDoctor.yearsOfExperience || '',
        avatar: editingDoctor.avatar || '',
        bio: editingDoctor.bio || ''
      });
      setAvatarFile(null);
    } 
  }, [editingDoctor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setFormData((prev) => ({
        ...prev,
        avatar: URL.createObjectURL(file)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (editingDoctor && (!formData.doctorId || String(formData.doctorId).trim() === '')) {
      newErrors.doctorId = 'Mã bác sĩ là bắt buộc';
    }
    if (!formData.fullName || formData.fullName.trim() === '') {
      newErrors.fullName = 'Họ và tên là bắt buộc';
    }
    if (!formData.dateOfBirth || formData.dateOfBirth.trim() === '') {
      newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
    }
    if (!formData.specialtyId) {
      newErrors.specialtyId = 'Chuyên khoa là bắt buộc';
    }
    if (!formData.qualification) {
      newErrors.qualification = 'Trình độ chuyên môn là bắt buộc';
    }
    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.phoneNumber || formData.phoneNumber.trim() === '') {
      newErrors.phoneNumber = 'Số điện thoại là bắt buộc';
    }
    if (!formData.yearsOfExperience || String(formData.yearsOfExperience).trim() === '') {
      newErrors.yearsOfExperience = 'Số năm kinh nghiệm là bắt buộc';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) setShowConfirmCancel(true);
  };

  const handleCancel = () => {
    setShowConfirmCancel(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirmCancel(false);
    onClose();
  };

  const handleCancelConfirm = () => {
    setShowConfirmCancel(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const data = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        specialtyId: Number(formData.specialtyId),
        qualification: formData.qualification,
        yearsOfExperience: Number(formData.yearsOfExperience),
        avatar: formData.avatar || '',
        bio: formData.bio || ''
      };

      if (editingDoctor) {
        data.doctorId = Number(formData.doctorId);
        await DoctorApi.updateDoctor(editingDoctor.doctorId, data);
        if (typeof onSubmit === 'function') onSubmit('edit');
      } else {
        await DoctorApi.createDoctor(data);
        if (typeof onSubmit === 'function') onSubmit('add');
      }
      onClose();
    } catch (error) {
      setErrors({ api: error?.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu.' });
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2>{editingDoctor ? 'SỬA THÔNG TIN BÁC SĨ' : 'THÊM BÁC SĨ'}</h2>
          <button className="close-btn" onClick={handleCancel} aria-label="Đóng">x</button>
        </div>

        <form className="doctor-form" onSubmit={handleSubmit}>
          <div className="form-row-main">
            <div className="form-group image-group">
              <label>Ảnh bác sĩ <span className="required">*</span></label>
              <div className="image-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="image-upload-label">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="avatar" className="uploaded-image" />
                  ) : (
                    <div className="image-placeholder">
                      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                        <rect width="80" height="80" rx="8" fill="#f0f0f0" stroke="#ddd" />
                        <path d="M25 55L35 45L45 55L55 40L65 55" stroke="#ccc" strokeWidth="2" fill="none" />
                        <circle cx="35" cy="30" r="5" fill="#ccc" />
                      </svg>
                    </div>
                  )}
                </label>
              </div>
              {errors.avatar && <span className="error-message">{errors.avatar}</span>}
            </div>

            <div className="form-fields-right">
              <div className="form-row">
                {editingDoctor && (
                  <div className="form-group">
                    <label>Mã bác sĩ</label>
                    <input type="text" name="doctorId" value={formData.doctorId} disabled />
                    {errors.doctorId && <span className="error-message">{errors.doctorId}</span>}
                  </div>
                )}
                <div className="form-group">
                  <label>Họ và tên <span className="required">*</span></label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ngày sinh <span className="required">*</span></label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={errors.dateOfBirth ? 'error' : ''}
                  />
                  {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
                </div>
                <div className="form-group">
                  <label>Giới tính <span className="required">*</span></label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Nam"
                        checked={formData.gender === 'Nam'}
                        onChange={handleInputChange}
                      /> Nam
                    </label>
                    <label style={{ marginLeft: '20px' }}>
                      <input
                        type="radio"
                        name="gender"
                        value="Nữ"
                        checked={formData.gender === 'Nữ'}
                        onChange={handleInputChange}
                      /> Nữ
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Các trường còn lại */}
          <div className="form-row">
            <div className="form-group">
              <label>Chuyên khoa <span className="required">*</span></label>
              <select
                name="specialtyId"
                value={formData.specialtyId}
                onChange={handleInputChange}
                className={errors.specialtyId ? 'error' : ''}
              >
                <option value="">-- Chọn chuyên khoa --</option>
                <option value="1">Nội tổng quát</option>
                <option value="2">Da liễu 1</option>
                <option value="3">Sản phụ khoa</option>
                <option value="4">Nhi khoa 1</option>
              </select>
              {errors.specialtyId && <span className="error-message">{errors.specialtyId}</span>}
            </div>
            <div className="form-group">
              <label>Trình độ chuyên môn <span className="required">*</span></label>
              <select
                name="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                className={errors.qualification ? 'error' : ''}
              >
                <option value="">-- Chọn trình độ --</option>
                <option value="Tiến sĩ">Tiến sĩ</option>
                <option value="Thạc sĩ">Thạc sĩ</option>
                <option value="Bác sĩ CKII">Bác sĩ CKII</option>
                <option value="Bác sĩ CKI">Bác sĩ CKI</option>
              </select>
              {errors.qualification && <span className="error-message">{errors.qualification}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Số năm kinh nghiệm (năm) <span className="required">*</span></label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                placeholder="Ví dụ: 3.5"
                className={errors.yearsOfExperience ? 'error' : ''}
              />
              {errors.yearsOfExperience && <span className="error-message">{errors.yearsOfExperience}</span>}
            </div>
            <div className="form-group">
              <label>Số điện thoại <span className="required">*</span></label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Ví dụ: 0324567654"
                className={errors.phoneNumber ? 'error' : ''}
              />
              {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group form-group-full">
              <label>Email <span className="required">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Ví dụ: nguyenvana@medicare.vn"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group form-group-full">
              <label>Mô tả bác sĩ</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Nhập mô tả chi tiết về bác sĩ (tối đa 500 ký tự)"
                maxLength="500"
                rows="4"
                className="textarea-description"
              />
              <div className="character-count">{formData.bio?.length || 0}/500</div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Xác nhận</button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>Hủy bỏ</button>
          </div>

          {errors.api && <div className="error-message">{errors.api}</div>}
        </form>
      </div>

      <ConfirmModal
        isOpen={showConfirmCancel}
        title="Xác nhận hủy thao tác"
        message="Bạn có chắc muốn hủy thao tác?"
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelConfirm}
      />
    </div>
  );
};

export default DoctorForm;
