import React, { useState, useEffect } from 'react';
import '../../../style/WorkScheduleForm.css';
import {GetClinicsAsync, GetDoctorsAsync, GetServicesAsync, GetSpecialtiesAsync} from '../../../api/WorkScheduleDropdown';
import PropTypes from 'prop-types';
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
    status: 'Chưa có lịch',
  });

  const [errors, setErrors] = useState({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorRes, specialtyRes, clinicRes, serviceRes] = await Promise.all([
          GetDoctorsAsync(),
          GetSpecialtiesAsync(),
          GetClinicsAsync(),
          GetServicesAsync(),
        ]);
        setDoctors(doctorRes.data);
        setSpecialties(specialtyRes.data);
        setClinics(clinicRes.data);
        setServices(serviceRes.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dropdown:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (editingSchedule) {
      setFormData({
        doctorId: editingSchedule.doctorId || '',
        specialtyId: editingSchedule.specialtyId || '',
        workDate: editingSchedule.workDate ? new Date(editingSchedule.workDate).toISOString().split('T')[0] : '',
        workTime: editingSchedule.workTime || '',
        clinicId: editingSchedule.clinicId || '',
        serviceId: editingSchedule.serviceId || '',
        status: editingSchedule.status || 'Chưa có lịch',
      });
    }
  }, [editingSchedule]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.doctorId) newErrors.doctorId = 'Bác sĩ là bắt buộc';
    if (!formData.specialtyId) newErrors.specialtyId = 'Chuyên khoa là bắt buộc';
    if (!formData.workDate) newErrors.workDate = 'Ngày làm việc là bắt buộc';
    if (!formData.workTime) newErrors.workTime = 'Ca làm việc là bắt buộc';
    if (!formData.clinicId) newErrors.clinicId = 'Phòng khám là bắt buộc';
    if (!formData.serviceId) newErrors.serviceId = 'Dịch vụ khám là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const payload = {
        doctorId: parseInt(formData.doctorId,10),
        specialtyId: parseInt(formData.specialtyId,10),
        clinicId: parseInt(formData.clinicId,10),
        serviceId: parseInt(formData.serviceId,10),
        workDate: formData.workDate ? new Date(formData.workDate).toISOString() : null,
        workTime: formData.workTime,
      };
      console.log('Payload gửi lên:', payload);
      if (
        isNaN(parseInt(formData.doctorId)) ||
        isNaN(parseInt(formData.specialtyId)) ||
        isNaN(parseInt(formData.clinicId)) ||
        isNaN(parseInt(formData.serviceId))
      ) {
        alert("Các trường ID phải là số hợp lệ.");
        return;
      }
      onSubmit(payload);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setShowCancelModal(true);
  };

  return (
    <>
      <div className="w-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowCancelModal(true)}>
        <div className="w-modal-container">
          <div className="w-modal-header">
            <h4>{editingSchedule ? 'CHỈNH SỬA LỊCH LÀM VIỆC' : 'TẠO LỊCH LÀM VIỆC MỚI'}</h4>
            <button className="close-button" onClick={() => setShowCancelModal(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <form className="work-schedule-form" onSubmit={handleSubmit}>
            <div className="w-form-group full-width">
              <label htmlFor="doctorId">Tên bác sĩ: <span className="required">*</span></label>
              <select id="doctorId" name="doctorId" value={formData.doctorId} onChange={handleInputChange} className={errors.doctorId ? 'error' : ''}>
                <option value="">-- Chọn bác sĩ --</option>
                {doctors.filter(Boolean).map((doctor, index) => (
                  <option key={doctor.doctorId || `doctor-${index}`} value={doctor.doctorId?.toString()}>
                    {doctor.fullName || "Không rõ tên" }
                  </option>
                ))}
              </select>
              {errors.doctorId && <span className="error-message">{errors.doctorId}</span>}
            </div>
            <div className="w-form-row">
              <div className="w-form-group">
                <label htmlFor="specialtyId">Chuyên khoa: <span className="required">*</span></label>
                <select id="specialtyId" name="specialtyId" value={formData.specialtyId} onChange={handleInputChange} className={errors.specialtyId ? 'error' : ''}>
                  <option value="">-- Chọn chuyên khoa --</option>
                  {specialties.filter(Boolean).map((specialty, index) => (
                    <option key={specialty.specialtyId || `specialty-${index}`} value={specialty.specialtyId?.toString()}>
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
                  placeholder="Ví dụ: 8:00-12:00"
                  className={errors.workTime ? 'error' : ''}
                />
                {errors.workTime && <span className="error-message">{errors.workTime}</span>}
              </div>
              <div className="w-form-group">
                <label htmlFor="clinicId">Phòng khám: <span className="required">*</span></label>
                <select id="clinicId" name="clinicId" value={formData.clinicId} onChange={handleInputChange} className={errors.clinicId ? 'error' : ''}>
                  <option value="">-- Chọn phòng khám --</option>
                  {clinics.filter(Boolean).map((clinic, index) => (
                    <option key={clinic.clinicId || `clinic-${index}`} value={clinic.clinicId?.toString()}>
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
                <select id="serviceId" name="serviceId" value={formData.serviceId} onChange={handleInputChange} className={errors.serviceId ? 'error' : ''}>
                  <option value="">-- Chọn dịch vụ --</option>
                  {services.filter(Boolean).map((service, index) => (
                    <option key={service.serviceId || `service-${index}`} value={service.serviceId}>
                      {service.serviceName}
                    </option>
                  ))}
                </select>
                {errors.serviceId && <span className="error-message">{errors.serviceId}</span>}
              </div>
            </div>
            <hr></hr>
            <div className="w-form-actions">
              <button type="submit" className="submit-button">Xác nhận</button>
              <button type="button" className="cancel-button" onClick={handleCancel}>Hủy bỏ</button>
            </div>
          </form>
        </div>
      </div>
      <ConfirmModal
        open={showCancelModal}
        title="XÁC NHẬN THOÁT"
        message={editingSchedule ? 'Bạn có muốn thoát khỏi chức năng chỉnh sửa lịch làm việc không?' : 'Bạn có muốn thoát khỏi chức năng tạo lịch làm việc không?'}
        onConfirm={onClose}
        onCancel={() => setShowCancelModal(false)}
      />
    </>
  );
};

WorkScheduleForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editingSchedule: PropTypes.shape({
    doctorId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    specialtyId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    workDate: PropTypes.string,
    workTime: PropTypes.string,
    clinicId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    serviceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    status: PropTypes.string,
  }),
};

export default WorkScheduleForm;