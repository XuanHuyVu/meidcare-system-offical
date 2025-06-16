import React, { useState, useEffect } from 'react';
import '../../../style/DoctorDetail.css';
import ConfirmModal from '../../../components/ConfirmModal';
import { getDoctorById } from '../../../api/DoctorApi';

// Map specialtyId sang tên chuyên khoa
const SPECIALTY_MAP = {
  1: 'Hô Hấp',
  2: 'Tim Mạch',
  3: 'Da Liễu',
  4: 'Nội Khoa',
  5: 'Ngoại Khoa',
  6: 'Sản Phụ Khoa',
  7: 'Nhi Khoa'
};

const DoctorDetail = ({ doctorId, onClose }) => {
  const [doctor, setDoctor] = useState(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!doctorId) return;
    const fetchDoctor = async () => {
      try {
        const response = await getDoctorById(doctorId);
        console.log('Doctor detail:', response.data); 
        setDoctor(response.data);
        setError(null);
      } catch (error) {
        setError('Không thể tải thông tin bác sĩ.');
        console.error(error);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  if (error) return <div>{error}</div>;
  if (!doctor) return <div>Đang tải dữ liệu bác sĩ...</div>;

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

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>THÔNG TIN BÁC SĨ</h2>
          <button className="close-btn" onClick={handleCancel}>x</button>
        </div>
        <div className="services-form">
          <div className="form-row form-row-main">
            <div className="form-group image-group">
              <label>Ảnh bác sĩ:</label>
              {doctor.avatar ? (
                <img
                  src={doctor.avatar}
                  alt="avatar"
                  style={{ width: 160, height: 160, borderRadius: 8, objectFit: 'cover', border: '1px solid #eee', marginTop: 8 }}
                />
              ) : (
                <div className="image-placeholder">
                  <svg width="120" height="120" fill="#ccc"><rect width="100%" height="100%" rx="8"/><text x="50%" y="50%" textAnchor="middle" dy=".3em" fill="#aaa" fontSize="16">No Image</text></svg>
                </div>
              )}
            </div>
            <div className="form-group-group">
              <div className="form-row">
                <div className="form-group">
                  <label>Mã bác sĩ:</label>
                  <div>{doctor.doctorId}</div>
                </div>
                <div className="form-group">
                  <label>Họ và tên:</label>
                  <div>{doctor.fullName}</div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ngày sinh:</label>
                  <div>
                    {doctor.dateOfBirth
                      ? new Date(doctor.dateOfBirth).toLocaleDateString('vi-VN')
                      : ''}
                  </div>
                </div>
                <div className="form-group">
                  <label>Giới tính:</label>
                  <div>{doctor.gender}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Chuyên khoa:</label>
              <div>{SPECIALTY_MAP[doctor.specialtyId] || doctor.specialtyId}</div>
            </div>
            <div className="form-group">
              <label>Trình độ chuyên môn:</label>
              <div>{doctor.qualification}</div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Số năm kinh nghiệm (Năm):</label>
              <div>{doctor.yearsOfExperience}</div>
            </div>
            <div className="form-group">
              <label>Email:</label>
              <div>{doctor.email}</div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Số điện thoại:</label>
              <div>{doctor.phoneNumber}</div>
            </div>
          </div>
          <div className="form-group">
            <label>Mô tả:</label>
            <div>{doctor.bio || <span style={{ color: "#aaa" }}>(Không có)</span>}</div>
          </div>
          <div className="form-actions">
            <button className="cancel-btn" onClick={handleCancel}>Đóng</button>
          </div>
        </div>
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

export default DoctorDetail;