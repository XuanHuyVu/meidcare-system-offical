import React, { useEffect, useState } from "react";
import {
  getAppointments,
  deleteAppointment,
} from "../../../api/AppointmentApi";
import {
  GetPatientsAsync,
  GetDoctorsAsync,
  GetServicesAsync,
  GetClinicsAsync,
  GetSpecialtiesAsync,
} from "../../../api/AppointmentDropdown";
import Header from "../../../components/Header";
import AppointmentForm from "./AppointmentForm";
import AppointmentDetail from "./AppointmentDetail";
import ConfirmModal from "../../../components/ConfirmModal";
import "../../../style/AppointmentList.css";
import dayjs from "dayjs";
import { FaInfoCircle, FaEdit, FaTrash } from "react-icons/fa";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState("");

  const [filterValue, setFilterValue] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const [openDetail, setOpenDetail] = useState(false);
  const [detailAppointment, setDetailAppointment] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchAppointments();
    fetchAdditionalData(); // Load additional data like patients, doctors, etc.
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

  // Fetch additional data
  const fetchAdditionalData = async () => {
    try {
      const [patientsRes, doctorsRes, servicesRes, clinicsRes, specialtiesRes] =
        await Promise.all([
          GetPatientsAsync(),
          GetDoctorsAsync(),
          GetServicesAsync(),
          GetClinicsAsync(),
          GetSpecialtiesAsync(),
        ]);
      setPatients(patientsRes.data || []);
      setDoctors(doctorsRes.data || []);
      setServices(servicesRes.data || []);
      setClinics(clinicsRes.data || []);
      setSpecialties(specialtiesRes.data || []);
    } catch (err) {
      console.error("Error fetching additional data:", err);
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
      appointment.patientId?.toString().includes(keyword) ||
      appointment.clinicId?.toString().includes(keyword) ||
      appointment.serviceId?.toString().includes(keyword) ||
      appointment.specialtyId?.toString().includes(keyword) ||
      appointment.doctorId?.toString().includes(keyword);

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
    const today = dayjs().startOf("day");
    const appointmentDate = dayjs(appointment.appointmentDate).startOf("day");

    if (appointmentDate.isSame(today)) {
      setSuccessMessageText("Không thể hủy lịch khám. Vui lòng thử lại sau!");
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessageText("");
      }, 3000);
      return;
    }

    setAppointmentToDelete(appointment.appointmentId);
    setShowConfirmModal(true);
  };

  const confirmDeleteAppointment = async () => {
    if (appointmentToDelete) {
      try {
        console.log("Deleting appointment with ID:", appointmentToDelete);

        // Call API to delete the appointment
        const response = await deleteAppointment(appointmentToDelete);

        if (response.status === 204 || response.status === 200) {
          console.log("Appointment deleted successfully!");
          setSuccessMessageText("Xóa lịch khám thành công!");
          setShowSuccessMessage(true);
          // Tự động ẩn thông báo sau 3 giây
          setTimeout(() => {
            setShowSuccessMessage(false);
            setSuccessMessageText("");
          }, 3000);
          await fetchAppointments();
        } else {
          console.error("Failed to delete appointment:", response);
          setSuccessMessageText("Xóa lịch khám không thành công!");
          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSuccessMessage(false);
            setSuccessMessageText("");
          }, 3000);
        }
      } catch (err) {
        console.error("Error deleting appointment:", err);
        setSuccessMessageText(
          "Đã xảy ra lỗi khi xóa lịch khám. Vui lòng thử lại!"
        );
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          setSuccessMessageText("");
        }, 3000);
      } finally {
        setShowConfirmModal(false);
        setAppointmentToDelete(null);
      }
    } else {
      setSuccessMessageText("Không có ID hợp lệ để xóa lịch khám!");
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessageText("");
      }, 3000);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setAppointmentToDelete(null);
  };

  const getPatientNameById = (id) => {
    const patient = patients.find((p) => p.patientId === id);
    return patient ? patient.fullName : "";
  };

  const getDoctorNameById = (id) => {
    const doctor = doctors.find((d) => d.doctorId === id);
    return doctor ? doctor.fullName : "";
  };

  const getServiceNameById = (id) => {
    const service = services.find((s) => s.serviceId === id);
    return service ? service.serviceName : "";
  };

  const getClinicNameById = (id) => {
    const clinic = clinics.find((c) => c.clinicId === id);
    return clinic ? clinic.clinicName : "";
  };

  const getSpecialtyNameByServiceId = (serviceId) => {
    const service = services.find((s) => s.serviceId === serviceId);
    if (!service) return "";
    const specialty = specialties.find(
      (sp) => sp.specialtyId === service.specialtyId
    );
    return specialty ? specialty.specialtyName : "";
  };

  const CustomWarningIcon = () => (
    <svg
      width="50"
      height="50"
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

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredAppointments.length);

  const pagedAppointments = filteredAppointments.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="appointment-list-container">
      <Header />

      {showSuccessMessage && (
        <div
          className={`success-toast ${
            successMessageText.includes("Không thể hủy lịch khám")
              ? "error"
              : ""
          }`}
        >
          {typeof successMessageText === "string" ? (
            <>
              <div className="success-icon-bg">
                {successMessageText.includes("Không thể hủy lịch khám") ? (
                  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                    <circle cx="19" cy="19" r="19" fill="#FF4D4F" />
                    <path
                      d="M24 14L14 24M14 14L24 24"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
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
                )}
              </div>
              <span>{successMessageText}</span>
            </>
          ) : (
            successMessageText
          )}
        </div>
      )}

      {/* Filter and Search */}
      <div className="appointment-list-filter-section">
        <div className="appointment-list-filter-checkbox-group">
          <label
            htmlFor="status-filter"
            className="appointment-list-filter-checkbox-label"
          >
            Trạng thái:&nbsp;
            <select
              id="status-filter"
              className="appointment-list-filter-select"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
            </select>
          </label>
        </div>

        <div className="appointment-list-search-box">
          <input
            type="text"
            placeholder="Tìm kiếm lịch khám"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Add appointment button */}
      <div className="appointment-list-add-button">
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
          setSuccessMessageText(
            editingAppointment
              ? "Sửa lịch khám thành công!"
              : "Thêm lịch khám thành công!"
          );
          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSuccessMessage(false);
            setSuccessMessageText("");
          }, 3000);
          fetchAppointments();
        }}
        appointment={editingAppointment}
      />

      {/* Appointment details view */}
      <AppointmentDetail
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        appointment={detailAppointment}
        patients={patients}
        doctors={doctors}
        specialties={specialties}
        clinics={clinics}
        services={services}
      />

      {/* Appointment table */}
      <div className="appointment-list-table-wrapper">
        {loading ? (
          <div className="appointment-list-loading">Đang tải...</div>
        ) : error ? (
          <div className="appointment-list-error-message">{error}</div>
        ) : (
          <table className="appointment-list-table">
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
              {pagedAppointments.length > 0 ? (
                pagedAppointments.map((appointment, index) => (
                  <tr key={appointment.appointmentId}>
                    <td>{index + 1}</td>
                    <td>{getPatientNameById(appointment.patientId)}</td>
                    <td>{getClinicNameById(appointment.clinicId)}</td>
                    <td>{getServiceNameById(appointment.serviceId)}</td>
                    <td>{getDoctorNameById(appointment.doctorId)}</td>
                    <td>
                      {appointment.serviceId &&
                      services?.length > 0 &&
                      specialties?.length > 0 ? (
                        <div>
                          {getSpecialtyNameByServiceId(appointment.serviceId)}
                        </div>
                      ) : (
                        <div>Không xác định</div>
                      )}
                    </td>
                    <td>
                      {dayjs(appointment.appointmentDate).format("YYYY-MM-DD")}
                    </td>
                    <td>
                      {appointment.appointmentTime
                        ? appointment.appointmentTime.substring(0, 5)
                        : ""}
                    </td>
                    <td>
                      <div className="appointment-list-action-button">
                        <button
                          key={`view-${appointment.appointmentId}`}
                          onClick={() => handleView(appointment)}
                          className="appointment-list-view-btn"
                          title="Xem chi tiết"
                        >
                          <FaInfoCircle />
                        </button>
                        <button
                          key={`edit-${appointment.appointmentId}`}
                          onClick={() => handleEdit(appointment)}
                          className="appointment-list-edit-btn"
                          title="Sửa"
                        >
                          <FaEdit />
                        </button>
                        <button
                          key={`delete-${appointment.appointmentId}`}
                          onClick={() => handleDeleteClick(appointment)}
                          className="appointment-list-delete-btn"
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
                  <td colSpan="8" className="appointment-list-empty-row">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="appointment-list-pagination-row">
        <div className="appointment-list-pagination-info">
          <span>
            Hiển thị <b>{pagedAppointments.length}</b> bản ghi
          </span>
        </div>

        <div className="appointment-list-pagination-controls">
          <div className="appointment-list-page-size-selector">
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
            className="appointment-list-pagination-btn"
          >
            Trước
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`appointment-list-pagination-btn ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="appointment-list-pagination-btn"
          >
            Sau
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title="XÓA LỊCH HẸN"
        message={
          <div style={{ display: "flex", alignItems: "center" }}>
            <CustomWarningIcon />
            Bạn có chắc chắn muốn xóa lịch hẹn này không?
          </div>
        }
        onConfirm={confirmDeleteAppointment}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default AppointmentList;
