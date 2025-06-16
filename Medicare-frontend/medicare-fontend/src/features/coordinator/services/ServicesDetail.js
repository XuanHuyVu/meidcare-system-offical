import React, { useState, useEffect } from 'react';
import '../../../style/ServicesDetail.css';

const ServicesDetail = ({ service, onClose, doctors = [], specialties = [] }) => {
  const [creationDate, setCreationDate] = useState('');

  useEffect(() => {
    // Tính toán thời gian -3 tháng từ thời điểm hiện tại
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    const formattedDate = date.toLocaleDateString('vi-VN');
    setCreationDate(formattedDate);
  }, []);

  const getDoctorName = () => {
    if (service.doctor?.fullName) return service.doctor.fullName;
    const found = doctors.find(d => d.doctorId === service.doctorId);
    return found ? found.fullName : service.doctorId;
  };

  const getSpecialtyName = () => {
    if (service.specialty?.specialtyName) return service.specialty.specialtyName;
    const found = specialties.find(s => s.specialtyId === service.specialtyId);
    return found ? found.specialtyName : service.specialtyId;
  };

  if (!service) return null;

  return (
    <div className="services-detail-overlay" style={{background: 'rgba(0,0,0,0.4)', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1000}} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="services-detail-container">
        <div className="services-detail-header">
          <span>{(service.service_name || service.serviceName || '').toUpperCase()}</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="services-detail-status-date">
          <span className="status-badge status-active">Đang hoạt động</span>
          <span>Tạo ngày: {creationDate}</span>
        </div>
        <div className="services-detail-info-row">
          <div className="info-box">
            <span className="info-icon">💲</span>
            <div className="info-content">
              <span className="info-label">Chi phí dịch vụ</span>
              <span className="info-value">{service.cost?.toLocaleString('vi-VN')} VNĐ</span>
            </div>
          </div>
          <div className="info-box">
            <span className="info-icon">⏱️</span>
            <div className="info-content">
              <span className="info-label">Thời gian thực hiện</span>
              <span className="info-value">{service.duration} phút</span>
            </div>
          </div>
        </div>
        <div className="services-detail-info-row">
          <div className="info-box">
            <span className="info-icon">👨‍⚕️</span>
            <div className="info-content">
              <span className="info-label">Bác sĩ phụ trách</span>
              <span className="info-value">{getDoctorName()}</span>
            </div>
          </div>
          <div className="info-box">
            <span className="info-icon">🏥</span>
            <div className="info-content">
              <span className="info-label">Chuyên khoa</span>
              <span className="info-value">{getSpecialtyName()}</span>
            </div>
          </div>
        </div>
        <div className="services-detail-description">
          <div className="description-label">
            <span>📝</span>
            <span>Mô tả dịch vụ</span>
          </div>
          <div className="description-content">{service.description}</div>
        </div>
        <div className="services-detail-image">
          <div className="image-label">
            <span>🖼️</span>
            <span>Ảnh minh họa:</span>
          </div>
          <img className="service-image" src={service.image || "/api/placeholder/200/150"} alt="Ảnh minh họa dịch vụ" />
        </div>
        <div className="services-detail-footer">
          <button className="cancel-btn" onClick={onClose}>Hủy bỏ</button>
        </div>
      </div>
    </div>
  );
};

export default ServicesDetail;
