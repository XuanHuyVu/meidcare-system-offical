import React, { useEffect, useState } from "react";
import { getAppointments, deleteAppointment} from "../../../api/AppointmentApi";
import Header from "../../../components/Header";
import AppointmentForm from "./AppointmentForm";
import AppointmentDetail from "./AppointmentDetail";
import ConfirmModal from "../../../components/ConfirmModal";
import "../../../style/AppointmentList.css";
import dayjs from "dayjs";

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
      setError(err.response?.data?.message || "Không thể kết nối đến server. Vui lòng thử lại sau.");
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
    // Save the appointment ID to be deleted
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
                    <td>{dayjs(appointment.appointmentDate).format('YYYY-MM-DD')}</td>
                    <td>{dayjs(appointment.appointmentTime).format('HH:mm:ss')}</td>
                    <td>
                      <div className="actionbutton">
                        <button
                          key={`view-${appointment.appointmentId}`}
                          onClick={() => handleView(appointment)}
                          title="Xem chi tiết"
                        >
                          <i className="fas fa-info-circle"></i>
                        </button>
                        <button
                          key={`edit-${appointment.appointmentId}`}
                          onClick={() => handleEdit(appointment)}
                          title="Sửa"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          key={`delete-${appointment.appointmentId}`}
                          onClick={() => handleDeleteClick(appointment)}
                          className="delete-btn"
                          title="Xoá"
                        >
                          <i className="fas fa-trash icon-trash"></i>
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

      {/* Confirmation modal for deleting */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa lịch hẹn này?"
        onConfirm={confirmDeleteAppointment}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default AppointmentList;
