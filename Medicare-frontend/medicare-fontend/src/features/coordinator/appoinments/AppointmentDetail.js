import React from "react";
import "../../../style/AppointmentDetail.css";

const AppointmentDetail = ({ open, onClose, appointment }) => {
  if (!open || !appointment) return null;

  return (
    <div className="modal-overlay1">
      <div className="modal-content1" style={{ maxWidth: 500 }}>
        <div className="modal-header1">
          <h2>CHI TIẾT LỊCH HẸN KHÁM</h2>
          <button className="close-btn" onClick={onClose} aria-label="Đóng">&times;</button>
        </div>
        <div style={{ padding: 24, border: "1px solid #ccc", borderRadius: 8, background: "#fff" }}>
          <div><b>Khoa khám:</b> {appointment.specialtyName}</div>
          <div><b>Bác sĩ:</b> {appointment.doctorName}</div>
          <div><b>Thời gian:</b> {new Date(appointment.appointmentDate).toLocaleString()}</div>
          <div><b>Phòng khám:</b> {appointment.clinicName}</div>
          <div><b>Dịch vụ:</b> {appointment.serviceName}</div>
          <div>
            <b>Trạng thái:</b>{" "}
            <span className={appointment.status === 'confirmed' ? 'status-confirmed' : 'status-pending'}>
              {appointment.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
            </span>
          </div>
          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <button className="button cancel" onClick={onClose}>Thoát</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetail;