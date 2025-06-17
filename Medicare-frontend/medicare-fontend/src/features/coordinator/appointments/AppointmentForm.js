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
import { CreateAsync, updateAppointment } from "../../../api/AppointmentApi";
import dayjs from "dayjs";

const AppointmentForm = ({ open, onClose, onSubmit, appointment }) => {
  const initialForm = {
    patientId: "",
    serviceId: "",
    specialtyId: "",
    doctorId: "",
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
  const [successMessageText, setSuccessMessageText] = useState("");
  const [errors, setErrors] = useState({});
  const [patientExists, setPatientExists] = useState(true);

  // Load dữ liệu khi mở form
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
        alert("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại!");
      } finally {
        setIsLoadingForm(false);
        setIsLoadingClinics(false);
      }
    };

    fetchDropdowns();
  }, [open]);

  // Load dữ liệu khi sửa lịch hẹn
  useEffect(() => {
    if (
      appointment &&
      services.length &&
      specialties.length &&
      allDoctors.length &&
      clinics.length
    ) {
      const fullDate = new Date(appointment.appointmentDate);

      if (appointment.appointmentTime && appointment.appointmentTime.match(/^(\d{2}):(\d{2}):(\d{2})$/)) {
        const [h, m, s] = appointment.appointmentTime.split(":");
        fullDate.setHours(Number(h));
        fullDate.setMinutes(Number(m));
        fullDate.setSeconds(Number(s) || 0);
      } else {
        console.log("Invalid appointmentTime format:", appointment.appointmentTime);
        fullDate.setHours(0);
        fullDate.setMinutes(0);
        fullDate.setSeconds(0);
      }

      setAppointmentDate(new Date(appointment.appointmentDate));
      setAppointmentTime(new Date(fullDate));

      const selectedService = services.find(
        (s) => String(s.serviceId) === String(appointment.serviceId)
      );

      // Tìm thông tin bệnh nhân
      const selectedPatient = patients.find(
        (p) => String(p.patientId) === String(appointment.patientId)
      );

      setForm({
        patientId: appointment.patientId !== 0 ? String(appointment.patientId) : "",
        patientName: selectedPatient ? selectedPatient.fullName : "",
        serviceId: appointment.serviceId !== 0 ? String(appointment.serviceId) : "",
        specialtyId: selectedService?.specialtyId ? String(selectedService.specialtyId) : "",
        doctorId: appointment.doctorId !== 0 ? String(appointment.doctorId) : "",
        clinicId: appointment.clinicId !== 0 ? String(appointment.clinicId) : "",
      });

      console.log("Updated form:", form); // Kiểm tra giá trị form sau khi set
    } else if (!appointment) {
      setForm(initialForm);
      setAppointmentDate(null);
      setAppointmentTime(null);
      setDoctors([]);
    }
  }, [appointment, services, specialties, allDoctors, clinics, patients]);

  // Lọc bác sĩ theo chuyên khoa
  useEffect(() => {
    if (form.specialtyId) {
      const selectedSpecialty = specialties.find(
        (s) => String(s.specialtyId) === String(form.specialtyId)
      );
      const specialtyName = selectedSpecialty ? selectedSpecialty.specialtyName : "";
      const filtered = allDoctors.filter((doctor) => {
        if (doctor.specialtyName) {
          return doctor.specialtyName === specialtyName;
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

  // Xử lý khi chọn bệnh nhân và cập nhật thông tin bệnh nhân vào form
  const handlePatientChange = (e) => {
    const { value } = e.target;
    const selectedPatient = patients.find(
      (patient) => String(patient.patientId) === value
    );

    // Cập nhật patientId và patientName trong form
    setForm((prev) => ({
      ...prev,
      patientId: value,
      patientName: selectedPatient ? selectedPatient.fullName : "",
    }));

    // Kiểm tra sự tồn tại của bệnh nhân
    setPatientExists(!!selectedPatient);
  };

  // Hàm kiểm tra tính hợp lệ của form
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!form.patientId || !form.patientName) {
      formErrors.patientName = "Vui lòng chọn bệnh nhân.";
      isValid = false;
    }

    if (!patientExists) {
      formErrors.patientName = "Bệnh nhân không tồn tại trong hệ thống.";
      isValid = false;
    }

    if (!appointmentDate) {
      formErrors.appointmentDate = "Vui lòng chọn ngày khám.";
      isValid = false;
    } else {
      const today = dayjs().format('YYYY-MM-DD');
      const selectedDate = dayjs(appointmentDate).format('YYYY-MM-DD');
      
      if (selectedDate === today) {
        formErrors.appointmentDate = "Không thể đặt lịch khám trong ngày hiện tại.";
        isValid = false;
      }
    }

    if (!appointmentTime) {
      formErrors.appointmentTime = "Vui lòng chọn giờ khám.";
      isValid = false;
    }

    if (!form.clinicId) {
      formErrors.clinicId = "Vui lòng chọn phòng khám.";
      isValid = false;
    }

    if (!form.serviceId) {
      formErrors.serviceId = "Vui lòng chọn dịch vụ khám.";
      isValid = false;
    }

    if (!form.specialtyId) {
      formErrors.specialtyId = "Vui lòng chọn chuyên khoa.";
      isValid = false;
    }

    if (!form.doctorId) {
      formErrors.doctorId = "Vui lòng chọn bác sĩ phụ trách.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Kiểm tra các trường quan trọng
      if (
        form.patientId === "0" ||
        form.doctorId === "0" ||
        form.serviceId === "0" ||
        form.specialtyId === "0" ||
        form.clinicId === "0"
      ) {
        setShowSuccessMessage(true);
        setSuccessMessageText("Vui lòng chọn bệnh nhân, bác sĩ, dịch vụ, chuyên khoa và phòng khám hợp lệ.");
        setTimeout(() => {
          setShowSuccessMessage(false);
          setSuccessMessageText("");
        }, 3000);
        return;
      }

      // Lấy các đối tượng từ danh sách đã chọn
      const selectedService = services.find(
        (s) => String(s.serviceId) === String(form.serviceId)
      );
      const selectedDoctor = doctors.find(
        (d) => String(d.doctorId) === String(form.doctorId)
      );
      const selectedSpecialty = specialties.find(
        (s) => String(s.specialtyId) === String(form.specialtyId)
      );
      const selectedClinic = clinics.find(
        (c) => String(c.clinicId) === String(form.clinicId)
      );
      const selectedPatient = patients.find(
        (p) => String(p.patientId) === String(form.patientId)
      );

      const submissionData = {
        patientId: Number(form.patientId),
        dateOfBirth: selectedPatient?.dateOfBirth || "",
        doctorId: Number(selectedDoctor?.doctorId),
        serviceId: Number(selectedService?.serviceId),
        specialtyId: Number(selectedSpecialty?.specialtyId),
        clinicId: Number(selectedClinic?.clinicId),
        appointmentDate: appointmentDate ? dayjs(appointmentDate).format('YYYY-MM-DD') : "",
        appointmentTime: appointmentTime
          ? appointmentTime.toISOString().split("T")[1].split(".")[0]
          : "",
      };

      // Nếu đang sửa lịch khám, thêm appointmentId vào dữ liệu
      if (appointment) {
        submissionData.appointmentId = appointment.appointmentId;
      }

      console.log("Dữ liệu gửi đi:", submissionData);

      try {
        let response;
        if (appointment) {
          // Gọi API cập nhật nếu đang sửa
          response = await updateAppointment(appointment.appointmentId, submissionData);
          console.log("Lịch khám đã được cập nhật:", response);
        } else {
          // Gọi API tạo mới nếu đang thêm
          response = await CreateAsync(submissionData);
          console.log("Lịch khám đã được tạo:", response);
        }
        
        // Reset form
        setForm(initialForm);
        setAppointmentDate(null);
        setAppointmentTime(null);
        setErrors({});
        setPatientExists(true);
        
        // Đóng form và gọi callback để hiển thị thông báo thành công
        onClose();
        if (onSubmit) {
          onSubmit();
        }
      } catch (error) {
        console.error("Lỗi khi xử lý lịch khám:", error.response);
        setShowSuccessMessage(true);
        setSuccessMessageText("Có lỗi xảy ra khi xử lý lịch khám. Vui lòng thử lại.");
        setTimeout(() => {
          setShowSuccessMessage(false);
          setSuccessMessageText("");
        }, 3000);
      }
    } else {
      console.log("Form validate lỗi:", errors, form);
    }
  };

  // Xử lý hủy form
  const handleCancel = () => {
    const hasFormData = Object.values(form).some((value) => value != null && value !== "");
    const hasDateTimeData = appointmentDate !== null || appointmentTime !== null;
    const hasData = hasFormData || hasDateTimeData;

    if (hasData) {
      setShowCancelModal(true);
    } else {
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
      <ConfirmModal
        isOpen={showCancelModal}
        title="Xác nhận thoát"
        message={appointment ? "Bạn có muốn thoát khỏi chức năng sửa lịch khám không?" : "Bạn có muốn thoát khỏi chức năng thêm lịch khám không?"}
        onConfirm={() => {
          setShowCancelModal(false);
          onClose();
        }}
        onCancel={() => setShowCancelModal(false)}
      />

      {open && (
        <div className="appointment-modal-overlay">
          <div className="appointment-modal-content">
            <div className="appointment-modal-header">
              <h2>{appointment ? "SỬA LỊCH KHÁM" : "ĐẶT LỊCH KHÁM"}</h2>
              <button className="appointment-close-btn" onClick={handleCancel}></button>
            </div>

            {showSuccessMessage && (
              <div className="appointment-success-message">
                <div className="appointment-error-icon-bg">
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
                </div>
                <span>{successMessageText}</span>
              </div>
            )}

            {isLoadingForm ? (
              <div className="appointment-loading-message">Đang tải dữ liệu, vui lòng chờ...</div>
            ) : (
              <form className="appointment-form" onSubmit={handleSubmit}>
                {errors.form && (
                  <div className="appointment-error-message">
                    {errors.form}
                  </div>
                )}
                <div className="appointment-form-row">
                  {/* Tên dịch vụ khám */}
                  <div className="appointment-form-group" style={{ gridColumn: "1 / -1" }}>
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
                      <option value="">{isLoadingServices ? "Đang tải..." : "Chọn dịch vụ"}</option>
                      {services.map((service) => (
                        <option key={service.serviceId} value={service.serviceId}>
                          {service.serviceName} - {service.description}
                        </option>
                      ))}
                    </select>
                    {errors.serviceId && <p className="appointment-error-message">{errors.serviceId}</p>}
                  </div>

                  {/* Chuyên khoa */}
                  <div className="appointment-form-group">
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
                        <option key={s.specialtyId} value={String(s.specialtyId)}>
                          {s.specialtyName}
                        </option>
                      ))}
                    </select>
                    {errors.specialtyId && <p className="appointment-error-message">{errors.specialtyId}</p>}
                  </div>

                  {/* Bác sĩ */}
                  <div className="appointment-form-group">
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
                    {errors.doctorId && <p className="appointment-error-message">{errors.doctorId}</p>}
                  </div>

                  {/* Tên bệnh nhân */}
                  <div className="appointment-form-group">
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
                        <option key={patient.patientId} value={patient.patientId}>
                          {patient.fullName}
                        </option>
                      ))}
                    </select>
                    {errors.patientName && <p className="appointment-error-message">{errors.patientName}</p>}
                  </div>

                  {/* Ngày khám */}
                  <div className="appointment-form-group">
                    <label>
                      Ngày khám <span className="required">*</span>
                    </label>
                    <DatePicker
                      selected={appointmentDate}
                      onChange={(date) => {
                        const selectedDate = dayjs(date).startOf('day');
                        const tomorrow = dayjs().add(1, 'day').startOf('day');
                        
                        if (selectedDate.isBefore(tomorrow)) {
                          setShowSuccessMessage(true);
                          setSuccessMessageText("Không thể đặt lịch khám trong ngày hiện tại.");
                          setTimeout(() => {
                            setShowSuccessMessage(false);
                            setSuccessMessageText("");
                          }, 3000);
                          setAppointmentDate(null);
                        } else {
                          setAppointmentDate(date);
                        }
                      }}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Chọn ngày"
                      className="form-control"
                      required
                      minDate={new Date(dayjs().add(1, 'day').format('YYYY-MM-DD'))}
                      maxDate={new Date(dayjs().add(30, 'day').format('YYYY-MM-DD'))}
                    />
                    {errors.appointmentDate && <p className="appointment-error-message">{errors.appointmentDate}</p>}
                  </div>

                  {/* Giờ khám */}
                  <div className="appointment-form-group">
                    <label>
                      Giờ khám <span className="required">*</span>
                    </label>
                    <DatePicker
                      selected={appointmentTime}
                      onChange={(time) => setAppointmentTime(time)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Giờ"
                      dateFormat="HH:mm"
                      placeholderText="Chọn giờ"
                      className="form-control"
                      required
                    />
                    {errors.appointmentTime && <p className="appointment-error-message">{errors.appointmentTime}</p>}
                  </div>

                  {/* Phòng khám */}
                  <div className="appointment-form-group">
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
                      <option value="">{isLoadingClinics ? "Đang tải..." : "Chọn phòng khám"}</option>
                      {clinics.map((clinic) => (
                        <option key={clinic.clinicId} value={clinic.clinicId}>
                          {clinic.clinicName}
                        </option>
                      ))}
                    </select>
                    {errors.clinicId && <p className="appointment-error-message">{errors.clinicId}</p>}
                  </div>
                </div>

                <div className="appointment-form-actions">
                  <button type="submit" className="appointment-submit-btn">
                    Xác nhận
                  </button>
                  <button type="button" className="appointment-cancel-btn" onClick={handleCancel}>
                    Hủy bỏ
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentForm;
