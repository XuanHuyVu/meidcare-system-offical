import React from "react";
import "../../../style/PatientsDetail.css";

const PatientsDetail = ({ patient, onClose }) => {
  if (!patient) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal-container">
      <div className="modal-header">
        <h2>CHI TIẾT THÔNG TIN BỆNH NHÂN</h2>
        <button className="close-btn" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div className="patients-detail-form">
        <div className="form-row">
          <div className="form-col-left">
            {/* Avatar */}
            <div className="form-group">
              <label>Ảnh đại diện:</label>
              <div className="avatar-upload-box">
                {patient.avatar ? (
                  <div className="avatar-preview">
                    <img src={patient.avatar} alt="avatar" />
                  </div>
                ) : (
                  <div className="avatar-placeholder">
                    <span>Chưa có ảnh</span>
                  </div>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Tên người liên hệ:</label>
              <div className="detail-value">{patient.emergencyContactName || "N/A"}</div>
            </div>
            <div className="form-group">
              <label>Liên hệ khẩn cấp:</label>
              <div className="detail-value">{patient.emergencyContactPhone || "N/A"}</div>
            </div>
            <div className="form-group">
              <label>Email:</label>
              <div className="detail-value">{patient.email || "N/A"}</div>
            </div>
          </div>
          <div className="form-col-right">
            <div className="form-group">
              <label>Họ tên:</label>
              <div className="detail-value">{patient.fullName || "N/A"}</div>
            </div>
            <div className="form-group">
              <label>Địa chỉ:</label>
              <div className="detail-value">{patient.address || "N/A"}</div>
            </div>
            <div className="form-group">
              <label>Ngày sinh:</label>
              <div className="detail-value">{patient.dateOfBirth ? patient.dateOfBirth.slice(0, 10) : "N/A"}</div>
            </div>
            <div className="form-group">
              <label>Số điện thoại:</label>
              <div className="detail-value">{patient.phoneNumber || "N/A"}</div>
            </div>
            <div className="form-group">
              <label>Giới tính:</label>
              <div className="detail-value">{patient.gender || "N/A"}</div>
            </div>
          </div>
        </div>
        <div className="form-actions" style={{ textAlign: "right" }}>
          <button type="button" className="close-btn" onClick={onClose}>Hủy bỏ</button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default PatientsDetail;