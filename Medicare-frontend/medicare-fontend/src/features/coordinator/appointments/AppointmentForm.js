import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../style/AppointmentForm.css";
import ConfirmModal from "../../../components/ConfirmModal";
import {
  GetSpecialtiesAsync,
  GetServicesAsync,
  GetDoctorsAsync,
  GetClinicsAsync,
  GetPatientsAsync,
} from "../../../api/AppointmentDropdown";

const AppointmentForm = ({ open, onClose, onSubmit, appointment }) => {
  const initialForm = {
    patientId: "",
    serviceId: "",
    specialtyId: "",
    doctorId: "",
    patientName: "",
    clinicId: "",
  };

  const [form, setForm] = useState(initialForm);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingClinics, setIsLoadingClinics] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errors, setErrors] = useState({});
  const [patientExists, setPatientExists] = useState(true);

  // Xử lý khi chọn bệnh nhân và cập nhật thông tin bệnh nhân vào form
  const handlePatientChange = (e) => {
    const { value } = e.target;
    const selectedPatient = patients.find(
      (patient) => String(patient.patientId) === value
    );

    // Cập nhật patientId và patientName trong form
    setForm((prev) => ({
      ...prev,
      patientId: value, // Lưu ID của bệnh nhân
      patientName: selectedPatient ? selectedPatient.fullName : "", // Lấy tên bệnh nhân từ danh sách
    }));

    // Kiểm tra sự tồn tại của bệnh nhân
    if (selectedPatient) {
      setPatientExists(true); // Bệnh nhân tồn tại
    } else {
      setPatientExists(false); // Bệnh nhân không tồn tại
    }
  };

  // Hàm kiểm tra tính hợp lệ của form
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!form.patientId || !form.patientName) {
      formErrors.patientName = "Bệnh nhân là bắt buộc.";
      isValid = false;
    }

    if (!patientExists) {
      formErrors.patientName = "Bệnh nhân không tồn tại.";
      isValid = false;
    }

    if (!appointmentDate) {
      formErrors.appointmentDate = "Ngày khám là bắt buộc.";
      isValid = false;
    }

    if (!appointmentTime) {
      formErrors.appointmentTime = "Giờ khám là bắt buộc.";
      isValid = false;
    }

    if (!form.clinicId) {
      formErrors.clinicId = "Phòng khám là bắt buộc.";
      isValid = false;
    }

    if (!form.serviceId) {
      formErrors.serviceId = "Dịch vụ khám là bắt buộc.";
      isValid = false;
    }
    if (!form.specialtyId) {
      formErrors.specialtyId = "Chuyên khoa là bắt buộc.";
      isValid = false;
    }
    if (!form.doctorId) {
      formErrors.doctorId = "Bác sĩ phụ trách là bắt buộc.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // Load dữ liệu khi mở form
  // useEffect để tải dữ liệu khi mở modal
  useEffect(() => {
    if (!open) return;

    const fetchDropdowns = async () => {
      setIsLoadingForm(true);
      setIsLoadingClinics(true);
      try {
        const [
          specialtiesRes,
          servicesRes,
          doctorsRes,
          clinicsRes,
          patientsRes,
        ] = await Promise.all([
          GetSpecialtiesAsync(),
          GetServicesAsync(),
          GetDoctorsAsync(),
          GetClinicsAsync(),
          GetPatientsAsync(),
        ]);
        setSpecialties(specialtiesRes.data || []);
        setServices(servicesRes.data || []);
        setAllDoctors(doctorsRes.data || []);
        setDoctors(doctorsRes.data || []);
        setClinics(clinicsRes.data || []);
        setPatients(patientsRes.data || []);
      } catch (error) {
        setSpecialties([]);
        setServices([]);
        setAllDoctors([]);
        setDoctors([]);
        setClinics([]);
        setPatients([]);
        alert("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại!");
      } finally {
        setIsLoadingForm(false);
        setIsLoadingClinics(false);
      }
    };

    fetchDropdowns();
  }, [open]);

  // useEffect để điền dữ liệu khi sửa lịch
  // useEffect để điền dữ liệu khi sửa lịch - ĐÃ SỬA
  useEffect(() => {
    if (
      appointment &&
      services.length &&
      specialties.length &&
      allDoctors.length &&
      clinics.length &&
      patients.length
    ) {
      const fullDate = new Date(appointment.appointmentDate);

      // Nếu backend trả về appointmentTime là "HH:mm:ss"
      if (appointment.appointmentTime) {
        const [h, m, s] = appointment.appointmentTime.split(":");
        fullDate.setHours(Number(h));
        fullDate.setMinutes(Number(m));
        fullDate.setSeconds(Number(s) || 0);
      }

      // Cập nhật ngày và giờ khám
      setAppointmentDate(new Date(appointment.appointmentDate));
      setAppointmentTime(new Date(fullDate));

      // TÌM ID THAY VÌ DÙNG TÊN để điền vào combobox

      // Tìm serviceId từ serviceName
      const selectedService = services.find(
        (service) => service.serviceName === appointment.serviceName
      );

      // Tìm specialtyId từ specialtyName
      const selectedSpecialty = specialties.find(
        (specialty) => specialty.specialtyName === appointment.specialtyName
      );

      // Tìm doctorId từ doctorName
      const selectedDoctor = allDoctors.find(
        (doctor) => doctor.fullName === appointment.doctorName
      );

      // Tìm clinicId từ clinicName
      const selectedClinic = clinics.find(
        (clinic) => clinic.clinicName === appointment.clinicName
      );

      // Tìm patientId từ patientName
      const selectedPatient = patients.find(
        (patient) => patient.fullName === appointment.patientName
      );

      // Điền dữ liệu vào form với ID thay vì name
      setForm({
        serviceId: selectedService ? String(selectedService.serviceId) : "",
        specialtyId: selectedSpecialty
          ? String(selectedSpecialty.specialtyId)
          : "",
        doctorId: selectedDoctor ? String(selectedDoctor.doctorId) : "",
        patientId: selectedPatient ? String(selectedPatient.patientId) : "",
        patientName: appointment.patientName || "",
        clinicId: selectedClinic ? String(selectedClinic.clinicId) : "",
      });

      // Cập nhật trạng thái patientExists
      setPatientExists(!!selectedPatient);
    } else if (!appointment) {
      // Nếu không có appointment, reset form về giá trị mặc định
      setForm(initialForm);
      setAppointmentDate(null);
      setAppointmentTime(null);
      setDoctors([]); // Clear doctors if no appointment
      setPatientExists(true);
    }
  }, [appointment, services, specialties, allDoctors, clinics, patients]); // Thêm patients vào dependencies // Chạy lại useEffect khi dữ liệu thay đổi

  // Lọc bác sĩ theo chuyên khoa
  useEffect(() => {
    if (form.specialtyId) {
      const selectedSpecialty = specialties.find(
        (s) => String(s.specialtyId) === String(form.specialtyId)
      );
      const specialtyName = selectedSpecialty
        ? selectedSpecialty.specialtyName
        : "";
      const filtered = allDoctors.filter((doctor) => {
        if (doctor.specialtyName) {
          return (doctor.specialtyName || "") === (specialtyName || "");
        }
        if (doctor.specialty && doctor.specialty.specialtyName) {
          return (
            (doctor.specialty.specialtyName || "") === (specialtyName || "")
          );
        }
        if (doctor.specialtyId) {
          return String(doctor.specialtyId) === String(form.specialtyId);
        }
        return false;
      });
      setDoctors(filtered);
    } else {
      setDoctors(allDoctors);
    }
  }, [form.specialtyId, allDoctors, specialties]);

  // Xử lý thay đổi các trường trong form
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "serviceId") {
      setIsLoadingServices(true);
      const selectedService = services.find(
        (s) => String(s.serviceId) === String(value)
      );
      const matchedSpecialty = specialties.find(
        (sp) => String(sp.specialtyId) === String(selectedService?.specialtyId)
      );
      setForm((prev) => ({
        ...prev,
        serviceId: selectedService?.serviceId || "",
        specialtyId: matchedSpecialty?.specialtyId || "",
        doctorId: "",
      }));
      setIsLoadingServices(false);
    } else if (name === "specialtyId") {
      setForm((prev) => ({
        ...prev,
        specialtyId: value,
        doctorId: "",
      }));
    } else if (name === "doctorId" || name === "clinicId") {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const selectedService = services.find(
        (s) => String(s.serviceId) === String(form.serviceId)
      );
      const selectedDoctor = doctors.find(
        (d) => String(d.doctorId) === String(form.doctorId)
      );
      const selectedClinic = clinics.find(
        (c) => String(c.clinicId) === String(form.clinicId) // Lấy clinicId từ form
      );
      const selectedSpecialty = specialties.find(
        (s) => String(s.specialtyId) === String(form.specialtyId)
      );

      const submissionData = {
        appointmentId: appointment?.appointmentId || 0,
        patientName: form.patientName,
        dateOfBirth:
          patients.find((p) => String(p.patientId) === form.patientId)
            ?.dateOfBirth || "",
        doctorName: selectedDoctor?.fullName || "",
        serviceName: selectedService?.serviceName || "",
        specialtyName: selectedSpecialty?.specialtyName || "",
        clinicName: selectedClinic?.clinicName || "", // Nếu cần, vẫn có thể lấy tên phòng khám
        appointmentDate: appointmentDate ? appointmentDate.toISOString() : "",
        appointmentTime: appointmentTime
          ? appointmentTime.toISOString().split("T")[1].split(".")[0]
          : "",
        clinicId: selectedClinic?.clinicId || "", // Lưu clinicId thay vì clinicName
      };

      console.log("Dữ liệu gửi đi:", submissionData);
      onSubmit(submissionData);

      // Reset form sau khi submit thành công
      setForm(initialForm);
      setAppointmentDate(null);
      setAppointmentTime(null);
      setErrors({});
      setPatientExists(true);

      onClose();

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2000);
    } else {
      console.log("Form validate lỗi:", errors, form);
    }
  };

  // Xử lý hủy form - SỬA LẠI LOGIC
  const handleCancel = () => {
    // Sửa lại logic kiểm tra dữ liệu để tránh lỗi
    const hasFormData = Object.values(form).some((value) => {
      return value != null && value !== "" && String(value).trim() !== "";
    });

    const hasDateTimeData =
      appointmentDate !== null || appointmentTime !== null;

    const hasData = hasFormData || hasDateTimeData;

    console.log("Kiểm tra dữ liệu:", {
      hasFormData,
      hasDateTimeData,
      hasData,
      form,
      appointmentDate,
      appointmentTime,
    });

    if (hasData) {
      setShowCancelModal(true);
    } else {
      // Reset form trước khi đóng
      setForm(initialForm);
      setAppointmentDate(null);
      setAppointmentTime(null);
      setErrors({});
      setPatientExists(true);
      onClose();
    }
  };

  return (
    <>
      {/* Modal xác nhận - luôn render */}
      <ConfirmModal
        isOpen={showCancelModal}
        title="Xác nhận thoát"
        message={
          appointment
            ? "Bạn có muốn thoát khỏi chức năng sửa lịch khám không?" // Thông báo khi đang sửa lịch
            : "Bạn có muốn thoát khỏi chức năng thêm lịch khám không?" // Thông báo khi đang thêm lịch
        }
        onConfirm={() => {
          setShowCancelModal(false); // Đóng modal sau khi xác nhận
          onClose(); // Đóng form
        }}
        onCancel={() => setShowCancelModal(false)} // Đóng modal nếu người dùng hủy bỏ
        iconType={undefined} // Có thể tùy chỉnh thêm nếu cần thiết
      />

      {/* Form chính - chỉ render khi open = true */}
      {open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{appointment ? "SỬA LỊCH KHÁM" : "ĐẶT LỊCH KHÁM"}</h2>
              <button className="close-btn" onClick={handleCancel}></button>
            </div>

            {isLoadingForm ? (
              <div className="loading-message">
                Đang tải dữ liệu, vui lòng chờ...
              </div>
            ) : (
              <form className="appointment-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  {/* Tên dịch vụ khám */}
                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label>
                      Tên dịch vụ khám <span className="required">*</span>
                    </label>
                    <select
                      name="serviceId"
                      value={form.serviceId}
                      onChange={handleChange}
                      required
                      disabled={isLoadingServices}
                    >
                      <option value="">
                        {isLoadingServices ? "Đang tải..." : "Chọn dịch vụ"}
                      </option>
                      {services.map((service) => (
                        <option
                          key={service.serviceId}
                          value={service.serviceId}
                        >
                          {service.serviceName} - {service.description}
                        </option>
                      ))}
                    </select>
                    {errors.serviceId && (
                      <p className="error">{errors.serviceId}</p>
                    )}
                  </div>

                  {/* Chuyên khoa */}
                  <div className="form-group">
                    <label>
                      Chuyên khoa <span className="required">*</span>
                    </label>
                    <select
                      name="specialtyId"
                      value={form.specialtyId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Chọn khoa</option>
                      {specialties.map((s) => (
                        <option key={s.specialtyId} value={s.specialtyId}>
                          {s.specialtyName}
                        </option>
                      ))}
                    </select>
                    {errors.specialtyId && (
                      <p className="error">{errors.specialtyId}</p>
                    )}
                  </div>

                  {/* Bác sĩ */}
                  <div className="form-group">
                    <label>
                      Bác sĩ phụ trách <span className="required">*</span>
                    </label>
                    <select
                      name="doctorId"
                      value={form.doctorId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Chọn bác sĩ</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.doctorId} value={doctor.doctorId}>
                          {doctor.fullName}
                        </option>
                      ))}
                    </select>
                    {errors.doctorId && (
                      <p className="error">{errors.doctorId}</p>
                    )}
                  </div>

                  {/* Tên bệnh nhân */}
                  <div className="form-group">
                    <label>
                      Bệnh nhân <span className="required">*</span>
                    </label>
                    <select
                      name="patientId"
                      value={form.patientId}
                      onChange={handlePatientChange}
                      required
                    >
                      <option value="">Chọn bệnh nhân</option>
                      {patients.map((patient) => (
                        <option
                          key={patient.patientId}
                          value={patient.patientId}
                        >
                          {patient.fullName}
                        </option>
                      ))}
                    </select>
                    {errors.patientName && (
                      <p className="error">{errors.patientName}</p>
                    )}
                  </div>

                  {/* Ngày khám */}
                  <div className="form-group">
                    <label>
                      Ngày khám <span className="required">*</span>
                    </label>
                    <DatePicker
                      selected={appointmentDate}
                      onChange={(date) => {
                        setAppointmentDate(date);
                      }}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Chọn ngày"
                      className="form-control"
                      required
                    />
                    {errors.appointmentDate && (
                      <p className="error">{errors.appointmentDate}</p>
                    )}
                  </div>

                  {/* Giờ khám */}
                  <div className="form-group">
                    <label>
                      Giờ khám <span className="required">*</span>
                    </label>
                    <DatePicker
                      selected={appointmentTime}
                      onChange={(time) => {
                        setAppointmentTime(time);
                      }}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Giờ"
                      dateFormat="HH:mm"
                      placeholderText="Chọn giờ"
                      className="form-control"
                      required
                    />
                    {errors.appointmentTime && (
                      <p className="error">{errors.appointmentTime}</p>
                    )}
                  </div>

                  {/* Phòng khám */}
                  <div className="form-group">
                    <label>
                      Phòng khám <span className="required">*</span>
                    </label>
                    <select
                      name="clinicId"
                      value={form.clinicId}
                      onChange={handleChange}
                      required
                      disabled={isLoadingClinics}
                    >
                      <option value="">
                        {isLoadingClinics ? "Đang tải..." : "Chọn phòng khám"}
                      </option>
                      {clinics.map((clinic) => (
                        <option key={clinic.clinicId} value={clinic.clinicId}>
                          {clinic.clinicName}
                        </option>
                      ))}
                    </select>
                    {errors.clinicId && (
                      <p className="error">{errors.clinicId}</p>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    Xác nhận
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    Hủy bỏ
                  </button>
                </div>

                {showSuccessMessage && (
                  <div className="success-message">
                    <p>Lịch hẹn đã được lưu thành công!</p>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentForm;
