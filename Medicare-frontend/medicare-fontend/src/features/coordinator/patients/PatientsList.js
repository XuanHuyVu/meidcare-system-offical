import React, { useState, useEffect } from "react";
import PatientsForm from "./PatientsForm";
import PatientsDetail from "./PatientsDetail";
import ConfirmModal from "../../../components/ConfirmModal";
import ErrorModal from "../../../components/ErrorModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faEdit,
  faTrash,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import "../../../style/Patients.css";
import * as PatientApi from "../../../api/PatientApi";

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);

  // Thông báo thành công
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // States for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination calculations
  const totalRecords = filteredPatients.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedPatients = filteredPatients.slice(
    startIndex,
    startIndex + pageSize
  );

  // Icon cảnh báo dùng cho ConfirmModal
  const CustomWarningIcon = () => (
    <svg
      width="38"
      height="38"
      viewBox="0 0 24 24"
      style={{ marginRight: "10px" }}
    >
      <path d="M12 2L22 20H2L12 2Z" fill="#FFB636" />
      <path
        d="M12 7V13M12 15.5H12.01"
        stroke="#2B3B47"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await PatientApi.getAllPatients();
      setPatients(res.data || []);
    } catch (err) {
      setError("Không thể tải danh sách bệnh nhân");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    let filtered = patients;
    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phoneNumber?.includes(searchTerm) ||
          patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((patient) => {
        if (statusFilter === "active") return patient.isActive === true;
        if (statusFilter === "inactive") return patient.isActive === false;
        return true;
      });
    }
    setFilteredPatients(filtered);
  }, [patients, searchTerm, statusFilter]);

  const handleAdd = () => {
    setEditingPatient(null);
    setShowForm(true);
  };

  const handleEdit = async (patient) => {
    try {
      const fullPatient = await PatientApi.getPatientById(patient.id);
      setEditingPatient(fullPatient.data || patient);
      setShowForm(true);
    } catch (err) {
      setEditingPatient(patient);
      setShowForm(true);
    }
  };

  const handleView = async (patient) => {
    try {
      const fullPatient = await PatientApi.getPatientById(patient.id);
      setSelectedPatient(fullPatient.data || patient);
    } catch (err) {
      setSelectedPatient(patient);
    }
  };

  const handleDelete = (patientId) => {
    if (!patientId) {
      setError("Không thể xác định bệnh nhân để xóa");
      return;
    }
    setDeleteId(patientId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await PatientApi.deletePatient(deleteId);
      await fetchPatients();
      setShowDeleteModal(false);
      setDeleteId(null);
      setSuccessMessageText("Xóa bệnh nhân thành công!");
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2500);
    } catch (err) {
      if (
        err?.response?.data?.message &&
        err.response.data.message.toLowerCase().includes("đang được sử dụng")
      ) {
        setShowDeleteModal(false);
        setShowErrorModal(true);
      } else {
        setError("Không thể xóa bệnh nhân");
      }
    }
  };

  // Khi bấm "Hủy bỏ" trong ConfirmModal xóa
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setShowCancelConfirmModal(true);
  };

  // Khi xác nhận hủy thao tác xóa
  const confirmCancelDelete = () => {
    setShowCancelConfirmModal(false);
    setDeleteId(null);
  };

  // Khi bấm "Hủy bỏ" trong pop-up xác nhận hủy thao tác xóa
  const continueDelete = () => {
    setShowCancelConfirmModal(false);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      Object.entries(data).forEach(([key, value]) => {
        console.log(`Trường: ${key}, Giá trị:`, value, ", Kiểu:", typeof value);
      });

      if (editingPatient) {
        await PatientApi.updatePatient(editingPatient.id, {
          ...data,
          inUse: editingPatient.inUse,
          isActive: editingPatient.isActive,
        });
        setSuccessMessageText("Cập nhật bệnh nhân thành công!");
      } else {
        await PatientApi.createPatient({
          ...data,
          isActive: true,
          inUse: false,
        });
        setSuccessMessageText("Thêm thông tin thành công!");
      }
      
      await fetchPatients();
      setShowForm(false);
      setEditingPatient(null);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2500);
    } catch (err) {
      setError("Không thể lưu thông tin bệnh nhân");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleStatusFilterChange = (e) => setStatusFilter(e.target.value);

  const getStatusBadge = (isActive) => (
    <span className={`status-badge ${isActive ? "active" : "inactive"}`}>
      {isActive ? "Hoạt động" : "Ngừng hoạt động"}
    </span>
  );

  return (
    <div className="patients-list-container">
      {/* Success message */}
      {showSuccessMessage && (
        <div className="success-toast">
          <div className="success-icon-bg">
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <circle cx="19" cy="19" r="19" fill="#32D53B" />
              <path
                d="M11 20.5L17 26.5L27 14.5"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span>{successMessageText}</span>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="patients-filter-card-full">
        <div className="filter-box">
          <label htmlFor="status-filter">Trạng thái:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="status-filter"
          >
            <option value="all">Tất cả</option>
            <option value="active">Đang Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm bệnh nhân"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
      </div>
      <div className="header-row">
        <button className="add-btn" onClick={handleAdd} disabled={loading}>
          Thêm bệnh nhân
        </button>
      </div>
      {/* Error Display */}
      {error && <div className="error-message">{error}</div>}
      {/* Loading State */}
      {loading && <div className="loading">Đang tải...</div>}
      {/* Patients Table */}
      <div className="patients-table-container">
        <table className="patients-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ tên</th>
              <th>Ngày sinh</th>
              <th>Số điện thoại</th>
              <th>Giới tính</th>
              <th>Địa chỉ</th>
              <th>Email</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  {loading ? "Đang tải..." : "Không tìm thấy bệnh nhân nào"}
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient, index) => (
                <tr key={patient.patientId || index}>
                  <td>{index + 1}</td>
                  <td>{patient.fullName || "N/A"}</td>
                  <td>
                    {patient.dateOfBirth
                      ? patient.dateOfBirth.slice(0, 10)
                      : "N/A"}
                  </td>
                  <td>{patient.phoneNumber || "N/A"}</td>
                  <td>{patient.gender || "N/A"}</td>
                  <td>{patient.address || "N/A"}</td>
                  <td>{patient.email || "N/A"}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="icon-btn view-btn"
                        onClick={() => handleView(patient)}
                        title="Xem chi tiết"
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                      </button>
                      <button
                        className="icon-btn edit-btn"
                        onClick={() => handleEdit(patient)}
                        title="Chỉnh sửa"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="icon-btn delete-btn"
                        onClick={() => handleDelete(patient.patientId)}
                        title={
                          patient.inUse ? "Không thể xóa - đang sử dụng" : "Xóa"
                        }
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-row">
        <div className="pagination-info">
          <span>
            Hiển thị{" "}
            <b>{Math.min(startIndex + pagedPatients.length, totalRecords)}</b>{" "}
            bản ghi
          </span>
        </div>
        <div className="pagination-controls">
          <div className="page-size-selector">
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="page-size-select"
            >
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
              className={`pagination-btn ${
                currentPage === index + 1 ? "active" : ""
              }`}
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
        <PatientsForm
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingPatient(null);
          }}
          editingPatient={editingPatient}
        />
      )}
      {selectedPatient && (
        <PatientsDetail
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Xác nhận xóa"
        message={
          <div style={{ display: "flex", alignItems: "center" }}>
            <CustomWarningIcon />
            Bạn có chắc muốn xóa bệnh nhân này không?
          </div>
        }
        onConfirm={confirmDelete}
        onCancel={handleCancelDelete}
      />

      <ErrorModal
        open={showErrorModal}
        message="Không thể xóa bệnh nhân đang được sử dụng!"
        onClose={() => setShowErrorModal(false)}
      />
    </div>
  );
};

export default PatientsList;