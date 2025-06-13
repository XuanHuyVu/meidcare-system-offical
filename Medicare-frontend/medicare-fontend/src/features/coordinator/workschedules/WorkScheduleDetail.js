import React from 'react';
import PropTypes from 'prop-types';
import '../../../style/WorkScheduleDetail.css';

const WorkScheduleDetail = ({ open, schedule, onClose }) => {
  if (!open || !schedule) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return 'N/A';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      'Đã đặt lịch': 'scheduled',
      'Chưa có lịch': 'unscheduled',
    };
    return statusClasses[status] || 'default';
  };

  return (
    <div className="workschedule-detail-overlay" onClick={onClose}>
      <div className="workschedule-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="workschedule-detail-header">
          <h3 className="workschedule-detail-title">THÔNG TIN LỊCH LÀM VIỆC</h3>
          <button className="workschedule-detail-close" onClick={onClose}>
            <span>&times;</span>
          </button>
        </div>
        
        <div className="workschedule-detail-body">
          <div className="workschedule-detail-section">
            <div className="workschedule-detail-grid">
              <div className="workschedule-detail-row">
                <label className="workschedule-detail-label">Bác sĩ:</label>
                <span className={`workschedule-detail-value ${!schedule.doctorName ? 'empty' : ''}`}>
                  {schedule.doctorName || 'Chưa phân công'}
                </span>
              </div>
              
              <div className="workschedule-detail-row">
                <label className="workschedule-detail-label">Chuyên khoa:</label>
                <span className={`workschedule-detail-value ${!schedule.specialtyName ? 'empty' : ''}`}>
                  {schedule.specialtyName || 'Chưa xác định'}
                </span>
              </div>
              
              <div className="workschedule-detail-row">
                <label className="workschedule-detail-label">Ngày làm việc:</label>
                <span className="workschedule-detail-value date">{formatDate(schedule.workDate)}</span>
              </div>
              
              <div className="workschedule-detail-row">
                <label className="workschedule-detail-label">Ca làm việc:</label>
                <span className="workschedule-detail-value time">{formatTime(schedule.workTime)}</span>
              </div>
              
              <div className="workschedule-detail-row">
                <label className="workschedule-detail-label">Phòng khám:</label>
                <span className={`workschedule-detail-value ${!schedule.clinicName ? 'empty' : ''}`}>
                  {schedule.clinicName || 'Chưa phân phòng'}
                </span>
              </div>
              
              <div className="workschedule-detail-row">
                <label className="workschedule-detail-label">Dịch vụ khám:</label>
                <span className={`workschedule-detail-value ${!schedule.serviceName ? 'empty' : ''}`}>
                  {schedule.serviceName || 'Chưa xác định'}
                </span>
              </div>
              
              <div className="workschedule-detail-row">
                <label className="workschedule-detail-label">Trạng thái:</label>
                <span className={`workschedule-status-badge ${getStatusClass(schedule.status)}`}>
                  {schedule.status || 'Không xác định'}
                </span>
              </div>

              {schedule.maxPatients && (
                <div className="workschedule-detail-row">
                  <label className="workschedule-detail-label">Số BN tối đa:</label>
                  <span className="workschedule-detail-value count">{schedule.maxPatients}</span>
                </div>
              )}

              {schedule.currentPatients !== undefined && (
                <div className="workschedule-detail-row">
                  <label className="workschedule-detail-label">Số BN hiện tại:</label>
                  <span className="workschedule-detail-value count">{schedule.currentPatients}</span>
                </div>
              )}

              {schedule.createdAt && (
                <div className="workschedule-detail-row">
                  <label className="workschedule-detail-label">Ngày tạo:</label>
                  <span className="workschedule-detail-value date">{formatDate(schedule.createdAt)}</span>
                </div>
              )}

              {schedule.updatedAt && (
                <div className="workschedule-detail-row">
                  <label className="workschedule-detail-label">Cập nhật cuối:</label>
                  <span className="workschedule-detail-value date">{formatDate(schedule.updatedAt)}</span>
                </div>
              )}

              {schedule.notes && (
                <div className="workschedule-detail-row">
                  <label className="workschedule-detail-label">Ghi chú:</label>
                  <div className="workschedule-detail-notes">
                    <span className="workschedule-detail-value">{schedule.notes}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="workschedule-detail-footer">
          <button className="workschedule-detail-btn secondary" onClick={onClose}>
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

WorkScheduleDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  schedule: PropTypes.shape({
    scheduleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    doctorName: PropTypes.string,
    specialtyName: PropTypes.string,
    workDate: PropTypes.string,
    workTime: PropTypes.string,
    clinicName: PropTypes.string,
    serviceName: PropTypes.string,
    status: PropTypes.string,
    maxPatients: PropTypes.number,
    currentPatients: PropTypes.number,
    notes: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    inUse: PropTypes.bool
  }),
  onClose: PropTypes.func.isRequired
};

WorkScheduleDetail.defaultProps = {
  schedule: null
};

export default WorkScheduleDetail;