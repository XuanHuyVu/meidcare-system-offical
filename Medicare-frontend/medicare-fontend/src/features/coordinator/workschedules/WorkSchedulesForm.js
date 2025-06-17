import React, { useState, useEffect, useCallback } from 'react';
import '../../../style/WorkScheduleForm.css';
import { GetClinicsAsync, GetDoctorsAsync, GetServicesAsync, GetSpecialtiesAsync } from '../../../api/WorkScheduleDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

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

const WorkScheduleForm = ({ onClose, onSubmit, editingSchedule = null }) => {
  const [formData, setFormData] = useState({
    doctorId: '',
    specialtyId: '',
    workDate: '',
    workTime: '',
    clinicId: '',
    serviceId: '',
    status: editingSchedule ? '' : undefined, // Only include status in edit mode
  });
  const [errors, setErrors] = useState({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Define status options for edit mode
  const statusOptions = [
    { value: 'Đã đặt lịch', label: 'Đã đặt lịch' },
    { value: 'Chưa có lịch', label: 'Chưa có lịch' },
  ];

  const fetchDropdownData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [doctorRes, specialtyRes, clinicRes, serviceRes] = await Promise.all([
        GetDoctorsAsync(),
        GetSpecialtiesAsync(),
        GetClinicsAsync(),
        GetServicesAsync(),
      ]);
      setDoctors(doctorRes.data || []);
      setSpecialties(specialtyRes.data || []);
      setClinics(clinicRes.data || []);
      setServices(serviceRes.data || []);
    } catch (error) {
      setErrorMessage('Không thể tải dữ liệu dropdown. Vui lòng thử lại.');
      setShowErrorMessage(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  useEffect(() => {
    console.log('Received editingSchedule:', editingSchedule); // Debug: Log the editingSchedule
    if (editingSchedule) {
      setFormData({
        doctorId: editingSchedule.doctorId?.toString() || editingSchedule.doctor?.doctorId?.toString() || '',
        specialtyId: editingSchedule.specialtyId?.toString() || editingSchedule.specialty?.specialtyId?.toString() || '',
        workDate: editingSchedule.workDate ? new Date(editingSchedule.workDate).toISOString().split('T')[0] : '',
        workTime: editingSchedule.workTime || '',
        clinicId: editingSchedule.clinicId?.toString() || editingSchedule.clinic?.clinicId?.toString() || '',
        serviceId: editingSchedule.serviceId?.toString() || editingSchedule.service?.serviceId?.toString() || '',
        status: editingSchedule.status || '',
      });
    } else {
      setFormData({
        doctorId: '',
        specialtyId: '',
        workDate: '',
        workTime: '',
        clinicId: '',
        serviceId: '',
        status: undefined, // No status in create mode
      });
    }
  }, [editingSchedule]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.doctorId) newErrors.doctorId = 'Vui lòng chọn bác sĩ';
    if (!formData.specialtyId) newErrors.specialtyId = 'Vui lòng chọn chuyên khoa';
    if (!formData.workDate) newErrors.workDate = 'Vui lòng chọn ngày làm việc';
    if (!formData.workTime) newErrors.workTime = 'Vui lòng nhập ca làm việc';
    else if (!/^\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}$/.test(formData.workTime)) 
      newErrors.workTime = 'Định dạng ca làm việc không hợp lệ (VD: 08:00-12:00)';
    if (!formData.clinicId) newErrors.clinicId = 'Vui lòng chọn phòng khám';
    if (!formData.serviceId) newErrors.serviceId = 'Vui lòng chọn dịch vụ khám';
    if (editingSchedule && !formData.status) newErrors.status = 'Vui lòng chọn trạng thái'; // Validate status only in edit mode

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, editingSchedule]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      scheduleId: editingSchedule?.scheduleId,
      doctorId: parseInt(formData.doctorId, 10),
      specialtyId: parseInt(formData.specialtyId, 10),
      clinicId: parseInt(formData.clinicId, 10),
      serviceId: parseInt(formData.serviceId, 10),
      workDate: formData.workDate ? new Date(formData.workDate).toISOString() : null,
      workTime: formData.workTime,
      ...(editingSchedule && { status: formData.status }), // Include status only in edit mode
    };

    if (
      isNaN(payload.doctorId) ||
      isNaN(payload.specialtyId) ||
      isNaN(payload.clinicId) ||
      isNaN(payload.serviceId)
    ) {
      setErrorMessage('Các trường ID phải là số hợp lệ.');
      setShowErrorMessage(true);
      return;
    }

    onSubmit(payload);
    setShowCancelModal(false);
    if (!editingSchedule) {
      setFormData({
        doctorId: '',
        specialtyId: '',
        workDate: '',
        workTime: '',
        clinicId: '',
        serviceId: '',
        status: undefined,
      });
    }
  }, [formData, editingSchedule, onSubmit, validateForm]);

  const handleCancel = useCallback((e) => {
    e.preventDefault();
    setShowCancelModal(true);
  }, []);

  const handleCloseError = useCallback(() => {
    setShowErrorMessage(false);
    setErrorMessage('');
  }, []);

  return (
    <>
      <div className="w-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowCancelModal(true)}>
        <div className="w-modal-container">
          <div className="w-modal-header">
            <h4>{editingSchedule ? 'CHỈNH SỬA LỊCH LÀM VIỆC' : 'TẠO LỊCH LÀM VIỆC MỚI'}</h4>
            <button className="close-button" onClick={handleCancel}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          {isLoading ? (
            <div className="loading">Đang tải dữ liệu...</div>
          ) : (
            <form className="work-schedule-form" onSubmit={handleSubmit}>
              <div className="w-form-group full-width">
                <label htmlFor="doctorId">Tên bác sĩ: <span className="required">*</span></label>
                <select 
                  id="doctorId" 
                  name="doctorId" 
                  value={formData.doctorId} 
                  onChange={handleInputChange} 
                  className={errors.doctorId ? 'error' : ''}
                >
                  <option value="">-- Chọn bác sĩ --</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.doctorId} value={doctor.doctorId}>
                      {doctor.fullName || 'Không rõ tên'}
                    </option>
                  ))}
                </select>
                {errors.doctorId && <span className="error-message">{errors.doctorId}</span>}
              </div>
              <div className="w-form-row">
                <div className="w-form-group">
                  <label htmlFor="specialtyId">Chuyên khoa: <span className="required">*</span></label>
                  <select 
                    id="specialtyId" 
                    name="specialtyId" 
                    value={formData.specialtyId} 
                    onChange={handleInputChange} 
                    className={errors.specialtyId ? 'error' : ''}
                  >
                    <option value="">-- Chọn chuyên khoa --</option>
                    {specialties.map((specialty) => (
                      <option key={specialty.specialtyId} value={specialty.specialtyId}>
                        {specialty.specialtyName}
                      </option>
                    ))}
                  </select>
                  {errors.specialtyId && <span className="error-message">{errors.specialtyId}</span>}
                </div>
                <div className="w-form-group">
                  <label htmlFor="workDate">Ngày làm việc: <span className="required">*</span></label>
                  <input
                    type="date"
                    id="workDate"
                    name="workDate"
                    value={formData.workDate}
                    onChange={handleInputChange}
                    className={errors.workDate ? 'error' : ''}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.workDate && <span className="error-message">{errors.workDate}</span>}
                </div>
              </div>
              <div className="w-form-row">
                <div className="w-form-group">
                  <label htmlFor="workTime">Thời gian ca làm việc: <span className="required">*</span></label>
                  <input
                    type="text"
                    id="workTime"
                    name="workTime"
                    value={formData.workTime}
                    onChange={handleInputChange}
                    placeholder="VD: 08:00-12:00"
                    className={errors.workTime ? 'error' : ''}
                  />
                  {errors.workTime && <span className="error-message">{errors.workTime}</span>}
                </div>
                <div className="w-form-group">
                  <label htmlFor="clinicId">Phòng khám: <span className="required">*</span></label>
                  <select 
                    id="clinicId" 
                    name="clinicId" 
                    value={formData.clinicId} 
                    onChange={handleInputChange} 
                    className={errors.clinicId ? 'error' : ''}
                  >
                    <option value="">-- Chọn phòng khám --</option>
                    {clinics.map((clinic) => (
                      <option key={clinic.clinicId} value={clinic.clinicId}>
                        {clinic.clinicName}
                      </option>
                    ))}
                  </select>
                  {errors.clinicId && <span className="error-message">{errors.clinicId}</span>}
                </div>
              </div>
              <div className="w-form-row">
                <div className="w-form-group">
                  <label htmlFor="serviceId">Dịch vụ khám: <span className="required">*</span></label>
                  <select 
                    id="serviceId" 
                    name="serviceId" 
                    value={formData.serviceId} 
                    onChange={handleInputChange} 
                    className={errors.serviceId ? 'error' : ''}
                  >
                    <option value="">-- Chọn dịch vụ --</option>
                    {services.map((service) => (
                      <option key={service.serviceId} value={service.serviceId}>
                        {service.serviceName}
                      </option>
                    ))}
                  </select>
                  {errors.serviceId && <span className="error-message">{errors.serviceId}</span>}
                </div>
                {editingSchedule && (
                  <div className="w-form-group">
                    <label htmlFor="status">Trạng thái: <span className="required">*</span></label>
                    <select 
                      id="status" 
                      name="status" 
                      value={formData.status} 
                      onChange={handleInputChange} 
                      className={errors.status ? 'error' : ''}
                    >
                      <option value="">-- Chọn trạng thái --</option>
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.status && <span className="error-message">{errors.status}</span>}
                  </div>
                )}
              </div>
              <hr />
              <div className="w-form-actions">
                <button type="submit" className="submit-button" disabled={isLoading}>
                  {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
                <button type="button" className="cancel-button" onClick={handleCancel} disabled={isLoading}>
                  Hủy bỏ
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <ConfirmModal
        open={showCancelModal}
        title="XÁC NHẬN THOÁT"
        message={editingSchedule ? 'Bạn có muốn thoát khỏi chức năng chỉnh sửa lịch làm việc không?' : 'Bạn có muốn thoát khỏi chức năng tạo lịch làm việc không?'}
        onConfirm={() => {
          setShowCancelModal(false);
          onClose();
        }}
        onCancel={() => setShowCancelModal(false)}
      />
      {showErrorMessage && (
        <div className="error-toast">
          <div className="error-icon">⚠</div>
          <div>{errorMessage}</div>
          <button className="close-error" onClick={handleCloseError}>×</button>
        </div>
      )}
    </>
  );
};

export default WorkScheduleForm;