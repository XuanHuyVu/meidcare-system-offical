import React, { useEffect, useState } from "react";
import {
  getAppointments,
  deleteAppointment,
} from "../../../api/AppointmentApi";
import Header from "../../../components/Header";
import AppointmentForm from "./AppointmentForm";
import AppointmentDetail from "./AppointmentDetail";
import ConfirmModal from "../../../components/ConfirmModal";
import "../../../style/AppointmentList.css";
import dayjs from "dayjs";
import { FaInfoCircle, FaEdit, FaTrash } from "react-icons/fa";


const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterValue, setFilterValue] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const [openDetail, setOpenDetail] = useState(false);
  const [detailAppointment, setDetailAppointment] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

// Pagination state
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [pageSize, setPageSize] = useState(10); // Số lượng bản ghi mỗi trang
  const [totalRecords, setTotalRecords] = useState(0); // Tổng số bản ghi
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await getAppointments();
      if (response && response.data) {
        setAppointments(response.data);
        setError(null);
      } else {
        setAppointments([]);
        setError("Không có dữ liệu lịch hẹn");
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(
        err.response?.data?.message ||
          "Không thể kết nối đến server. Vui lòng thử lại sau."
      );
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAppointments = appointments.filter((appointment) => {
    let matchFilter = true;

    if (filterValue === "confirmed") {
      matchFilter = appointment.status === "confirmed";
    } else if (filterValue === "pending") {
      matchFilter = appointment.status === "pending";
    }

    const keyword = searchTerm.toLowerCase();
    const matchSearch =
      appointment.patientName?.toLowerCase().includes(keyword) ||
      appointment.roomName?.toLowerCase().includes(keyword) ||
      appointment.serviceName?.toLowerCase().includes(keyword) ||
      appointment.doctorName?.toLowerCase().includes(keyword) ||
      appointment.specialty?.toLowerCase().includes(keyword);

    return matchFilter && matchSearch;
  });

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setOpenForm(true);
  };

  const handleView = (appointment) => {
    setDetailAppointment(appointment);
    setOpenDetail(true);
  };

const handleDeleteClick = (appointment) => {
    setAppointmentToDelete(appointment.appointmentId);
    setShowConfirmModal(true); // Show confirmation modal
};

  const confirmDeleteAppointment = async () => {
    if (appointmentToDelete) {
      try {
        console.log("Deleting appointment with ID:", appointmentToDelete); // Check ID of the appointment

        // Call API to delete the appointment
        const response = await deleteAppointment(appointmentToDelete);

        if (response.status === 204 || response.status === 200) {
          console.log("Appointment deleted successfully!");
          alert("Xóa lịch hẹn thành công!"); // Success message
          await fetchAppointments(); // Reload the appointments list after deletion
        } else {
          console.error("Failed to delete appointment:", response);
          alert("Xóa lịch hẹn không thành công!"); // Failure message
        }
      } catch (err) {
        console.error("Error deleting appointment:", err);
        alert("Đã xảy ra lỗi khi xóa lịch hẹn. Vui lòng thử lại!"); // Error message
      } finally {
        setShowConfirmModal(false); // Close confirmation modal
        setAppointmentToDelete(null); // Reset appointment ID
      }
    } else {
      alert("Không có ID hợp lệ để xóa lịch hẹn!");
    }
};

const handleCancelDelete = () => {
  setShowConfirmModal(false); // Close confirmation modal without deleting
  setAppointmentToDelete(null); // Reset appointment ID
};

    const CustomWarningIcon = () => (
    <svg width="50" height="50" viewBox="0 0 24 24" style={{ marginRight: '10px' }}>
      {/* Tam giác vàng không viền */}
      <path 
        d="M12 2L22 20H2L12 2Z" 
        fill="#FFB636"
      />
      {/* Dấu chấm than đen */}
      <path 
        d="M12 7V13M12 15.5H12.01" 
        stroke="#2B3B47" 
        strokeWidth="1.5" 
        strokeLinecap="round"
        fill="none"
      />
    </svg>
);

// Số bản ghi hiển thị
const startIndex = (currentPage - 1) * pageSize; // Bắt đầu từ bản ghi nào
const endIndex = Math.min(startIndex + pageSize, filteredAppointments.length); // Đảm bảo không vượt quá tổng số bản ghi

const pagedAppointments = filteredAppointments.slice(startIndex, endIndex); // Cắt ra các bản ghi cho trang hiện tại


  const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber); // Cập nhật trang khi người dùng chọn trang
};

const handlePageSizeChange = (e) => {
  setPageSize(Number(e.target.value)); // Thay đổi số lượng bản ghi trên mỗi trang
  setCurrentPage(1); // Reset về trang đầu khi thay đổi kích thước trang
};



  return (
    <div className="appointment-list-container">
      <Header />

      {/* Filter and Search */}
      <div className="filter-section">
        <div className="filter-checkbox-group">
          <label htmlFor="status-filter" className="filter-checkbox-label">
            Trạng thái:&nbsp;
            <select
              id="status-filter"
              className="filter-select"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
            </select>
          </label>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm lịch khám..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Add appointment button */}
      <div className="add-appointment-button">
        <button onClick={() => setOpenForm(true)}>Đặt lịch khám</button>
      </div>

      {/* Appointment form for add/edit */}
      <AppointmentForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingAppointment(null);
        }}
        onSubmit={() => {
          setOpenForm(false);
          setEditingAppointment(null);
          fetchAppointments(); // Refresh the appointments list after submit
        }}
        appointment={editingAppointment}
      />

      {/* Appointment details view */}
      <AppointmentDetail
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        appointment={detailAppointment}
      />

      {/* Appointment table */}
      <div className="appointment-table-wrapper">
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <table className="appointment-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên bệnh nhân</th>
                <th>Phòng khám</th>
                <th>Tên dịch vụ khám</th>
                <th>Bác sĩ phụ trách</th>
                <th>Chuyên khoa</th>
                <th>Ngày khám</th>
                <th>Giờ khám</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment, index) => (
                  <tr key={appointment.appointmentId}>
                    <td>{index + 1}</td>
                    <td>{appointment.patientName}</td>
                    <td>{appointment.clinicName}</td>
                    <td>{appointment.serviceName}</td>
                    <td>{appointment.doctorName}</td>
                    <td>{appointment.specialtyName}</td>
                    <td>
                      {dayjs(appointment.appointmentDate).format("YYYY-MM-DD")}
                    </td>
                    <td>
                      {dayjs(appointment.appointmentTime).format("HH:mm:ss")}
                    </td>
                    <td>
                      <div className="actionbutton">
                        <button
                          key={`view-${appointment.appointmentId}`}
                          onClick={() => handleView(appointment)}
                          className="view-btn"
                          title="Xem chi tiết"
                        >
                          <FaInfoCircle />
                        </button>
                        <button
                          key={`edit-${appointment.appointmentId}`}
                          onClick={() => handleEdit(appointment)}
                          className="edit-btn"
                          title="Sửa"
                        >
                          <FaEdit />
                        </button>
                        <button
                          key={`delete-${appointment.appointmentId}`}
                          onClick={() => handleDeleteClick(appointment)}
                          className="delete-btn"
                          title="Xoá"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr key="no-data">
                  <td colSpan="8" className="empty-row">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

          {/* Pagination */}
    <div className="pagination-row">
        <div className="pagination-info">
        <span>Hiển thị <b>{filteredAppointments.length}</b> bản ghi</span>
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



          <ConfirmModal 
            isOpen={showConfirmModal}
            title="XÓA LỊCH HẸN"
            message={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CustomWarningIcon />
                Bạn có chắc chắn muốn xóa lịch hẹn này không?
              </div>
            }
            onConfirm={confirmDeleteAppointment} // Thực hiện xóa
            onCancel={handleCancelDelete} // Hủy bỏ xóa
          />
    </div>
  );
};

export default AppointmentList;
