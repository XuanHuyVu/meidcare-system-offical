import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { CreateAsync, DeleteAsync, GetAllAsync, GetByIdAsync, UpdateAsync } from '../../../api/WorkSchedulesApi';
import '../../../style/WorkSchedules.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from '../../../components/ConfirmModal';
import ErrorModal from '../../../components/ErrorModal';
import { debounce } from 'lodash';
import WorkSchedulesForm from './WorkSchedulesForm';
import WorkScheduleDetail from './WorkScheduleDetail';

const WorkSchedulesList = () => {
  const [workSchedules, setWorkSchedules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailSchedule, setDetailSchedule] = useState(null);
  const [searchError, setSearchError] = useState('');

  const fetchWorkSchedules = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await GetAllAsync();
      const sortedSchedules = (response.data || []).sort((a, b) => new Date(b.workDate) - new Date(a.workDate));
      console.log('Fetched schedules:', sortedSchedules); // Debug: Log the fetched schedules
      setWorkSchedules(sortedSchedules);
    } catch (error) {
      setErrorMessage('Không thể tải danh sách lịch làm việc. Vui lòng thử lại sau.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkSchedules();
  }, [fetchWorkSchedules]);

  const handleAddWorkSchedule = async (scheduleData) => {
    try {
      const response = await CreateAsync(scheduleData);
      setWorkSchedules(prev => [response.data, ...prev]);
      setShowAddForm(false);
      setSuccessMessage('Tạo lịch làm việc thành công!');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2000);
      setEditingSchedule(null);
      setSearchTerm('');
      setCurrentPage(1);
      fetchWorkSchedules();
    } catch (error) {
      setErrorMessage('Tạo lịch làm việc thất bại. Vui lòng thử lại!');
      setShowErrorModal(true);
    }
  };

  const handleEditWorkSchedule = useCallback((schedule) => {
    console.log('Editing schedule:', schedule); // Debug: Log the schedule being edited
    setEditingSchedule({
      scheduleId: schedule.scheduleId,
      doctorId: schedule.doctorId || schedule.doctor?.doctorId || '',
      specialtyId: schedule.specialtyId || schedule.specialty?.specialtyId || '',
      clinicId: schedule.clinicId || schedule.clinic?.clinicId || '',
      serviceId: schedule.serviceId || schedule.service?.serviceId || '',
      workDate: schedule.workDate || '',
      workTime: schedule.workTime || '',
      status: schedule.status || 'Chưa có lịch', // Fallback to default if status is missing
      doctorName: schedule.doctorName || schedule.doctor?.fullName || '',
      specialtyName: schedule.specialtyName || schedule.specialty?.specialtyName || '',
      clinicName: schedule.clinicName || schedule.clinic?.clinicName || '',
      serviceName: schedule.serviceName || schedule.service?.serviceName || '',
    });
    setShowEditForm(true);
    fetchWorkSchedules(); // Refresh the list to ensure latest data
  }, []);

  const handleUpdateWorkSchedule = async (scheduleData) => {
    try {
      await UpdateAsync(scheduleData.scheduleId, scheduleData);
      setWorkSchedules(prev => prev.map(schedule => 
        schedule.scheduleId === scheduleData.scheduleId ? { ...schedule, ...scheduleData } : schedule
      ));
      setShowEditForm(false);
      setEditingSchedule(null);
      setSuccessMessage('Chỉnh sửa lịch làm việc thành công!');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2000);
    } catch (error) {
      setErrorMessage('Chỉnh sửa lịch làm việc thất bại. Vui lòng thử lại!');
      setShowErrorModal(true);
    }
  };

  const handleDeleteWorkSchedule = useCallback(async (id) => {
    try {
      await GetByIdAsync(id);
      setPendingDeleteId(id);
      setShowDeleteModal(true);
    } catch (error) {
      setErrorMessage('Không thể xóa lịch làm việc này. Vui lòng thử lại sau.');
      setShowErrorModal(true);
    }
  }, []);

  const handleConfirmDelete = async () => {
    try {
      await DeleteAsync(pendingDeleteId);
      setWorkSchedules(prev => prev.filter(schedule => schedule.scheduleId !== pendingDeleteId));
      setShowDeleteModal(false);
      setPendingDeleteId(null);
      setSuccessMessage('Xóa lịch làm việc thành công!');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2000);
    } catch (error) {
      setShowDeleteModal(false);
      setErrorMessage('Xóa lịch làm việc thất bại. Vui lòng thử lại!');
      setShowErrorModal(true);
    }
  };

  const handleViewSchedule = useCallback((id) => {
    const schedule = workSchedules.find(s => s.scheduleId === id);
    if (schedule) {
      setDetailSchedule(schedule);
      setShowDetailModal(true);
    } else {
      setErrorMessage('Không tìm thấy lịch làm việc.');
      setShowErrorModal(true);
    }
  }, [workSchedules]);

  const debouncedSearch = useMemo(() => 
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300)
  , []);

  const filteredSchedules = useMemo(() => {
    return workSchedules.filter(schedule =>
      Object.values(schedule).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [workSchedules, searchTerm]);

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

  const handleSearchClick = () => {
    if (!searchTerm.trim()) {
      setSearchError('Vui lòng nhập nội dung tìm kiếm');
    } else {
      setSearchError('');
    }
  };

  return (
    <div className="workschedules-list-container">
      {showSuccessMessage && (
        <div className="success-toast">
          <div className="success-icon-bg">
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <circle cx="19" cy="19" r="19" fill="#32D53B"/>
              <path d="M11 20.5L17 26.5L27 14.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span>{successMessage}</span>
        </div>
      )}

      <div className="workschedules-filter-card-full">
        <div className="status-filter-display">
          <div className="status-item scheduled">
            <span className="counted">{workSchedules.filter(s => s.status === 'Đã đặt lịch').length}</span>
            <span className="status-text">Đã đặt lịch</span>
          </div>
          <div className="status-item unscheduled">
            <span className="count">{workSchedules.filter(s => s.status === 'Chưa có lịch').length}</span>
            <span className="status-text">Chưa có lịch</span>
          </div>
        </div>
        <div className="workschedules-search-group-right-full">
          <input 
            type="text" 
            placeholder="Tìm kiếm" 
            onChange={(e) => debouncedSearch(e.target.value)} 
            className="workschedules-search-input"
          />
          <span className="workschedules-search-icon" onClick={handleSearchClick}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </span>
          {searchError && <span className="search-error">{searchError}</span>}
        </div>
      </div>

      <div className="add-work-schedule-btn-row-full">
        <button className="add-work-schedule-btn-small" onClick={() => setShowAddForm(true)}>
          Tạo lịch làm việc
        </button>
      </div>

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
                  <td className='index'>{startIndex + index + 1}</td>
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
                        onClick={() => handleEditWorkSchedule(schedule)}
                        title="Chỉnh sửa"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteWorkSchedule(schedule.scheduleId)}
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

      {showAddForm && (
        <WorkSchedulesForm 
          onClose={() => setShowAddForm(false)} 
          onSubmit={handleAddWorkSchedule} 
        />
      )}
      {showEditForm && (
        <WorkSchedulesForm 
          onClose={() => {
            setShowEditForm(false);
            setEditingSchedule(null);
          }} 
          editingSchedule={editingSchedule} 
          onSubmit={handleUpdateWorkSchedule} 
        />
      )}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="XÓA LỊCH LÀM VIỆC"
        message={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="50" height="50" viewBox="0 0 24 24" style={{ marginRight: '10px' }}>
              <path d="M12 2L22 20H2L12 2Z" fill="#FFB636" />
              <path d="M12 7V13M12 15.5H12.01" stroke="#2B3B47" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
            Bạn có chắc chắn muốn xóa lịch làm việc này không?
          </div>
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setPendingDeleteId(null);
        }}
      />
      <ErrorModal
        isOpen={showErrorModal}
        title="LỖI"
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
      <WorkScheduleDetail
        open={showDetailModal}
        schedule={detailSchedule}
        onClose={() => {
          setShowDetailModal(false);
          setDetailSchedule(null);
        }}
      />
    </div>
  );
};

export default WorkSchedulesList;