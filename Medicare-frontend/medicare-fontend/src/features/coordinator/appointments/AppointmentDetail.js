import React, { useEffect, useState } from "react";
import "../../../style/AppointmentDetail.css";

const AppointmentDetail = ({ open, onClose, appointment, patients, doctors, specialties, clinics, services }) => {
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [specialtyName, setSpecialtyName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Dùng useEffect để tìm kiếm thông tin liên quan từ các ID
  useEffect(() => {
    if (!open || !appointment) return;
    
    setIsLoading(true);
    
    try {
      console.log("Appointment data:", appointment);
      console.log("Patients data:", patients);
      console.log("Doctors data:", doctors);
      console.log("Specialties data:", specialties);
      console.log("Clinics data:", clinics);
      console.log("Services data:", services);

      // Tìm thông tin bệnh nhân
      if (appointment.patientId && patients?.length > 0) {
        const patient = patients.find(p => String(p.patientId) === String(appointment.patientId));
        console.log("Found patient:", patient);
        setPatientName(patient?.fullName || "Không xác định");
      } else {
        setPatientName("Không xác định");
      }

      // Tìm thông tin bác sĩ
      if (appointment.doctorId && doctors?.length > 0) {
        const doctor = doctors.find(d => String(d.doctorId) === String(appointment.doctorId));
        console.log("Found doctor:", doctor);
        setDoctorName(doctor?.fullName || "Không xác định");
      } else {
        setDoctorName("Không xác định");
      }

      // Tìm thông tin chuyên khoa qua serviceId
      if (appointment.serviceId && services?.length > 0 && specialties?.length > 0) {
        const service = services.find(s => String(s.serviceId) === String(appointment.serviceId));
        if (service) {
          const specialty = specialties.find(sp => String(sp.specialtyId) === String(service.specialtyId));
          setSpecialtyName(specialty?.specialtyName || "Không xác định");
        } else {
          setSpecialtyName("Không xác định");
        }
      } else {
        setSpecialtyName("Không xác định");
      }

      // Tìm thông tin phòng khám
      if (appointment.clinicId && clinics?.length > 0) {
        const clinic = clinics.find(c => String(c.clinicId) === String(appointment.clinicId));
        console.log("Found clinic:", clinic);
        setClinicName(clinic?.clinicName || "Không xác định");
      } else {
        setClinicName("Không xác định");
      }

      // Tìm thông tin dịch vụ
      if (appointment.serviceId && services?.length > 0) {
        const service = services.find(s => String(s.serviceId) === String(appointment.serviceId));
        console.log("Found service:", service);
        setServiceName(service?.serviceName || "Không xác định");
      } else {
        setServiceName("Không xác định");
      }
    } catch (error) {
      console.error("Error loading appointment details:", error);
      // Set default values in case of error
      setPatientName("Không xác định");
      setDoctorName("Không xác định");
      setSpecialtyName("Không xác định");
      setClinicName("Không xác định");
      setServiceName("Không xác định");
    } finally {
      setIsLoading(false);
    }
  }, [appointment, patients, doctors, specialties, clinics, services, open]);

  // Kiểm tra nếu không mở modal hoặc không có lịch hẹn
  if (!open || !appointment) return null;

  return (
    <div className="modal-overlay1">
      <div className="modal-content1" style={{ maxWidth: 500 }}>
        <div className="modal-header1">
          <h2>CHI TIẾT LỊCH HẸN KHÁM</h2>
          <button className="close-btn" onClick={onClose} aria-label="Đóng">&times;</button>
        </div>
<<<<<<< Updated upstream
        <div style={{ padding: 24, border: "1px solid #ccc", borderRadius: 8, background: "#fff" }}>
          <div><b>Khoa khám:</b> {appointment.specialtyName}</div>
          <div><b>Bác sĩ:</b> {appointment.doctorName}</div>
          <div><b>Thời gian:</b> {new Date(appointment.appointmentDate).toLocaleString()}</div>
          <div><b>Phòng khám:</b> {appointment.clinicName}</div>
          <div><b>Dịch vụ:</b> {appointment.serviceName}</div>
=======
        <div
          style={{
            padding: 24,
            border: "1px solid #ccc",
            borderRadius: 8,
            background: "#fff",
          }}
        >
          <div>
            <b>Tên bệnh nhân:</b> {isLoading ? "Đang tải..." : patientName}
          </div>
          <div>
            <b>Ngày sinh:</b> {dayjs(appointment.dateOfBirth).format("DD-MM-YYYY")}
          </div>
          <div>
            <b>Khoa khám:</b> {isLoading ? "Đang tải..." : specialtyName}
          </div>
          <div>
            <b>Bác sĩ:</b> {isLoading ? "Đang tải..." : doctorName}
          </div>
          <div>
            <b>Thời gian:</b> {fullDateTime}
          </div>
          <div>
            <b>Phòng khám:</b> {isLoading ? "Đang tải..." : clinicName}
          </div>
          <div>
            <b>Dịch vụ:</b> {isLoading ? "Đang tải..." : serviceName}
          </div>
>>>>>>> Stashed changes
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