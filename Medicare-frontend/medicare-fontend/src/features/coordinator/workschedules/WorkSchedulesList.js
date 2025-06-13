import React, { useEffect, useState, useMemo } from 'react';
import { GetAllAsync } from '../../../api/WorkSchedulesApi';
import '../../../style/WorkSchedules.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from '../../../components/ConfirmModal';
import ErrorModal from '../../../components/ErrorModal';
import { debounce } from 'lodash';
import WorkSchedulesForm from './WorkSchedulesForm';
import WorkScheduleDetail from './WorkScheduleDetail';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:7130';

const WorkSchedulesList = () => {
  const [schedules, setSchedules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  
  // Modal states
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailSchedule, setDetailSchedule] = useState(null);

  const fetchSchedules = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await GetAllAsync();
      setSchedules(response.data || []);
    } catch (error) {
      showError('Không thể tải danh sách lịch làm việc. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  // API operations
  const apiRequest = async (url, method, data = null) => {
    const token = localStorage.getItem('authToken');
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };
    
    if (data) config.body = JSON.stringify(data);
    
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorMessages = {
        401: 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.',
        403: 'Bạn không có quyền thực hiện thao tác này.',
        404: 'Dữ liệu không tồn tại.'
      };
      throw new Error(errorMessages[response.status] || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
    
    return method !== 'DELETE' ? response.json() : null;
  };

  // Form handlers
  const handleAddSchedule = () => {
    setEditingSchedule(null);
    setShowForm(true);
  };

  const handleEditSchedule = (id) => {
    const scheduleToEdit = schedules.find(s => s.scheduleId === id);
    setEditingSchedule(scheduleToEdit);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSchedule(null);
  };

  const handleSubmitForm = async (formData) => {
    try {
      if (editingSchedule) {
        // Update
        await apiRequest(
          `${API_BASE_URL}/api/coordinator/workschedules/${editingSchedule.scheduleId}`,
          'PUT',
          formData
        );
        setSchedules(prev => 
          prev.map(schedule => 
            schedule.scheduleId === editingSchedule.scheduleId 
              ? { ...schedule, ...formData } 
              : schedule
          )
        );
      } else {
        // Create
        const newSchedule = await apiRequest(
          `${API_BASE_URL}/api/coordinator/workschedules`,
          'POST',
          formData
        );
        setSchedules(prev => [...prev, newSchedule]);
      }
      handleCloseForm();
    } catch (error) {
      showError(error.message);
    }
  };

  // View detail
  const handleViewSchedule = (id) => {
    const scheduleToView = schedules.find(s => s.scheduleId === id);
    if (scheduleToView) {
      setDetailSchedule(scheduleToView);
      setShowDetailModal(true);
    } else {
      showError('Không tìm thấy lịch làm việc.');
    }
  };

  // Delete
  const handleDeleteSchedule = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    const schedule = schedules.find(s => s.scheduleId === deleteId);
    if (schedule?.inUse) {
      setShowDeleteModal(false);
      showError('Không thể xóa lịch làm việc vì đã có bệnh nhân đặt lịch.');
      return;
    }

    try {
      await apiRequest(`${API_BASE_URL}/api/coordinator/workschedules/${deleteId}`, 'DELETE');
      await fetchSchedules();
      setShowDeleteModal(false);
      alert('Xóa lịch làm việc thành công!');
    } catch (error) {
      showError(error.message);
    }
  };

  // Search with debounce
  const handleSearchChange = 
  debounce((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, 300);

  // Filtered and paginated data
  const filteredSchedules = useMemo(() => {
    return schedules.filter(schedule =>
      Object.values(schedule).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [schedules, searchTerm]);

  const totalRecords = filteredSchedules.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentSchedules = filteredSchedules.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="workschedules-list-container">
      {/* Filter and Status */}
      <div className="workschedules-filter-card-full">
        <div className="status-filter-display">
          <div className="status-item scheduled">
            <span className="counted">{schedules.filter(s => s.status === 'Đã đặt lịch').length}</span>
            <span className="status-text">Đã đặt lịch</span>
          </div>
          <div className="status-item unscheduled">
            <span className="count">{schedules.filter(s => s.status === 'Chưa có lịch').length}</span>
            <span className="status-text">Chưa có lịch</span>
          </div>
        </div>
        <div className="workschedules-search-group-right">
          <input
            type="text"
            placeholder="Tìm kiếm"
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </span>
        </div>
      </div>

      {/* Add Button */}
      <div className="add-work-schedule-btn-row-full">
        <button className="add-work-schedule-btn-small" onClick={handleAddSchedule}>
          Tạo lịch làm việc
        </button>
      </div>

      {/* Table */}
      <div className="workschedules-table-container workschedules-table-container-light">
        <table className="workschedules-table workschedules-table-no-col-border">
          <thead>
            <tr>
              <th>STT</th>
              <th>Bác sĩ</th>
              <th>Chuyên khoa</th>
              <th>Ngày làm việc</th>
              <th>Ca làm việc</th>
              <th>Phòng khám</th>
              <th>Dịch vụ khám</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="9" className="no-data">Đang tải...</td></tr>
            ) : currentSchedules.length > 0 ? (
              currentSchedules.map((schedule, index) => (
                <tr key={schedule.scheduleId}>
                  <td>{startIndex + index + 1}</td>
                  <td>{schedule.doctorName}</td>
                  <td>{schedule.specialtyName}</td>
                  <td>{new Date(schedule.workDate).toLocaleDateString('vi-VN')}</td>
                  <td>{schedule.workTime}</td>
                  <td>{schedule.clinicName}</td>
                  <td>{schedule.serviceName}</td>
                  <td>{schedule.status}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn info-btn"
                        onClick={() => handleViewSchedule(schedule.scheduleId)}
                        title="Xem chi tiết"
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                      </button>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditSchedule(schedule.scheduleId)}
                        title="Chỉnh sửa"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteSchedule(schedule.scheduleId)}
                        title="Xóa"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="9" className="no-data">Không có dữ liệu</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-row">
        <div className="pagination-info">
          <span>Hiển thị <b>{Math.min(startIndex + pageSize, totalRecords)}</b> bản ghi</span>
        </div>
        <div className="pagination-controls">
          <div className="page-size-selector">
            <select value={pageSize} onChange={handlePageSizeChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <button 
            disabled={currentPage === 1} 
            onClick={() => handlePageChange(currentPage - 1)} 
            className="pagination-btn"
          >
            Trước
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button 
              key={index + 1} 
              onClick={() => handlePageChange(index + 1)} 
              className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => handlePageChange(currentPage + 1)} 
            className="pagination-btn"
          >
            Sau
          </button>
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <WorkSchedulesForm 
          onClose={handleCloseForm} 
          onSubmit={handleSubmitForm} 
          editingSchedule={editingSchedule}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa lịch làm việc này?"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      <ErrorModal
        open={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />

      <WorkScheduleDetail
        open={showDetailModal}
        schedule={detailSchedule}
        onClose={() => setShowDetailModal(false)}
      />
    </div>
  );
};

export default WorkSchedulesList;