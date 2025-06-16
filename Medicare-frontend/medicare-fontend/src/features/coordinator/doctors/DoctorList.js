import React, { useState, useEffect } from 'react';
import DoctorForm from './DoctorForm';
import DoctorDetail from './DoctorDetail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import '../../../style/DoctorList.css';
import ConfirmModal from '../../../components/ConfirmModal';
import ErrorModal from '../../../components/ErrorModal';
import * as DoctorApi from '../../../api/DoctorApi';

const DoctorList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await DoctorApi.getAllDoctors();
      const data = response?.data;
      if (Array.isArray(data)) {
        setDoctors(data);
      } else {
        setDoctors([]);
        setError('Dữ liệu trả về không hợp lệ');
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (type) => {
    await fetchDoctors();
    handleCloseForm();
    if (type === 'add') setSuccessMsg('Thêm Bác Sĩ Thành Công!');
    else if (type === 'edit') setSuccessMsg('Cập Nhật Bác Sĩ Thành Công!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditingDoctor(null);
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setShowEditForm(true);
  };

  const handleShowDetail = (doctorId) => {
    setSelectedDoctor(doctorId);
    setShowDetail(true);
  };

  const handleDeleteDoctor = (doctor) => {
    setDoctorToDelete(doctor);
    setShowConfirmModal(true);
  };

  const confirmDeleteDoctor = async () => {
    try {
      await DoctorApi.deleteDoctor(doctorToDelete.doctorId);
      await fetchDoctors();
      setShowConfirmModal(false);
      setDoctorToDelete(null);
    } catch {
      setShowConfirmModal(false); // Đóng popup xác nhận xóa
      setDoctorToDelete(null);
      setError('Đã gặp lỗi, không thể xóa!');
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredDoctors.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredDoctors.length / recordsPerPage);

  return (
    <div className="doctors-list-container">
      <div className="doctors-filter-card-full">
        <div className="search-input-wrapper">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm bác sĩ..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <button className="add-doctor-btn-small" onClick={() => setShowAddForm(true)}>
        Thêm bác sĩ
      </button>

      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <table className="doctors-table doctors-table-no-col-border">
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>STT</th>
              <th style={{ textAlign: 'center' }}>Họ và tên</th>
              <th style={{ textAlign: 'center' }}>Chuyên khoa</th>
              <th style={{ textAlign: 'center' }}>Trình độ</th>
              <th style={{ textAlign: 'center' }}>Email</th>
              <th style={{ textAlign: 'center' }}>SĐT</th>
              <th style={{ textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((doctor, index) => (
                <tr key={doctor.doctorId}>
                  <td style={{ textAlign: 'right' }}>{indexOfFirstRecord + index + 1}</td>
                  <td style={{ textAlign: 'left' }}>{doctor.fullName}</td>
                  <td style={{ textAlign: 'right' }}>{doctor.specialtyId}</td>
                  <td style={{ textAlign: 'left' }}>{doctor.qualification}</td>
                  <td style={{ textAlign: 'left' }}>{doctor.email}</td>
                  <td style={{ textAlign: 'center' }}>{doctor.phoneNumber}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn info-btn" onClick={() => handleShowDetail(doctor.doctorId)} title="Xem chi tiết">
                        <FontAwesomeIcon icon={faInfoCircle} />
                      </button>
                      <button className="action-btn edit-btn" onClick={() => handleEditDoctor(doctor)} title="Chỉnh sửa">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDeleteDoctor(doctor)} title="Xóa">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-row">
                  Không có bác sĩ nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="pagination-container">
        <div className="pagination-left">
          <span>
            Hiển thị <strong>{currentRecords.length}</strong> bản ghi
          </span>
        </div>
        <div className="pagination-right">
          <select
            value={recordsPerPage}
            onChange={(e) => {
              setRecordsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Trước</button>
          <span className="page-number">{currentPage}</span>
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Sau</button>
        </div>
      </div>

      {(showAddForm || showEditForm) && (
        <DoctorForm
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          editingDoctor={editingDoctor}
        />
      )}

      {showDetail && selectedDoctor && (
        <DoctorDetail
          doctorId={selectedDoctor}
          onClose={() => setShowDetail(false)}
        />
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Xác nhận xóa"
        message="Bạn có chắc muốn xóa bác sĩ này?"
        onConfirm={confirmDeleteDoctor}
        onCancel={() => {
          setShowCancelConfirmModal(true);
          setDoctorToDelete(null);
        }}
        onRequestClose={() => setShowCancelConfirmModal(true)}
      />

      <ConfirmModal
        isOpen={showCancelConfirmModal}
        title="Xác nhận hủy thao tác"
        message="Bạn có chắc chắn muốn hủy thao tác này?"
        onConfirm={() => {
          setShowCancelConfirmModal(false);
          setShowConfirmModal(false);
          setDoctorToDelete(null);
        }}
        onCancel={() => setShowCancelConfirmModal(false)}
      />

      <ErrorModal
        isOpen={!!error}
        message={error}
        onClose={() => setError('')}
      />

      {/* Success Toast */}
      {successMsg && (
        <div className="success-toast">
          <div className="success-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#36D375" />
              <path d="M15 25L22 32L33 19" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>{successMsg}</div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
