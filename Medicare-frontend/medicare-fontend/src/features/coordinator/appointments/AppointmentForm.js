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
import { appointmentProxyApi } from "../../../api/AppointmentProxyApi";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useAppointmentTemplate } from "./useAppointmentTemplate";

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
  const [errors, setErrors] = useState({});
  const [patientExists, setPatientExists] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { process } = useAppointmentTemplate();

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

    // Xóa lỗi của trường hiện tại khi người dùng bắt đầu nhập
    if (value) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

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

    // Xóa lỗi của trường patientName khi người dùng chọn bệnh nhân
    setErrors(prev => ({
      ...prev,
      patientName: undefined
    }));

    // Cập nhật patientId và patientName trong form
    setForm((prev) => ({
      ...prev,
      patientId: value,
      patientName: selectedPatient ? selectedPatient.fullName : "",
    }));

    // Kiểm tra sự tồn tại của bệnh nhân
    setPatientExists(!!selectedPatient);
  };

  // Xử lý thay đổi ngày khám
  const handleDateChange = (date) => {
    // Xóa lỗi của trường appointmentDate khi người dùng chọn ngày
    setErrors(prev => ({
      ...prev,
      appointmentDate: undefined
    }));

    const selectedDate = dayjs(date).startOf('day');
    const tomorrow = dayjs().add(1, 'day').startOf('day');
    
    if (selectedDate.isBefore(tomorrow)) {
      setAppointmentDate(null);
    } else {
      setAppointmentDate(date);
    }
  };

  // Xử lý thay đổi giờ khám
  const handleTimeChange = (time) => {
    // Xóa lỗi của trường appointmentTime khi người dùng chọn giờ
    setErrors(prev => ({
      ...prev,
      appointmentTime: undefined
    }));

    setAppointmentTime(time);
  };

  // Hàm kiểm tra tính hợp lệ của form
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Validation cho bệnh nhân
    if (!form.patientId || !form.patientName) {
      formErrors.patientName = "Tên bệnh nhân là bắt buộc.";
      isValid = false;
    }

    if (!patientExists) {
      formErrors.patientName = "Bệnh nhân không tồn tại trong hệ thống.";
      isValid = false;
    }

    // Validation cho dịch vụ khám
    if (!form.serviceId) {
      formErrors.serviceId = "Dịch vụ khám là bắt buộc.";
      isValid = false;
    }

    // Validation cho chuyên khoa
    if (!form.specialtyId) {
      formErrors.specialtyId = "Chuyên khoa là bắt buộc.";
      isValid = false;
    }

    // Validation cho bác sĩ
    if (!form.doctorId) {
      formErrors.doctorId = "Bác sĩ phụ trách là bắt buộc.";
      isValid = false;
    }

    // Validation cho ngày khám
    if (!appointmentDate) {
      formErrors.appointmentDate = "Ngày khám là bắt buộc.";
      isValid = false;
    } else {
      const today = dayjs().format('YYYY-MM-DD');
      const selectedDate = dayjs(appointmentDate).format('YYYY-MM-DD');
      
      if (selectedDate === today) {
        formErrors.appointmentDate = "Không thể đặt lịch khám trong ngày hiện tại.";
        isValid = false;
      }
    }

    // Validation cho giờ khám
    if (!appointmentTime) {
      formErrors.appointmentTime = "Giờ khám là bắt buộc.";
      isValid = false;
    }

    // Validation cho phòng khám
    if (!form.clinicId) {
      formErrors.clinicId = "Phòng khám là bắt buộc.";
      isValid = false;
    }

    setErrors(formErrors);
    console.log('Form errors:', formErrors);
    return isValid;
  };

  // Hàm validation real-time cho từng trường
  const validateField = (fieldName, value) => {
    let fieldError = "";

    switch (fieldName) {
      case "patientId":
        if (!value) {
          fieldError = "Vui lòng chọn bệnh nhân.";
        } else if (!patientExists) {
          fieldError = "Bệnh nhân không tồn tại trong hệ thống.";
        }
        break;
      case "serviceId":
        if (!value) {
          fieldError = "Dịch vụ khám là bắt buộc.";
        }
        break;
      case "specialtyId":
        if (!value) {
          fieldError = "Chuyên khoa là bắt buộc.";
        }
        break;
      case "doctorId":
        if (!value) {
          fieldError = "Bác sĩ phụ trách là bắt buộc.";
        }
        break;
      case "clinicId":
        if (!value) {
          fieldError = "Phòng khám là bắt buộc.";
        }
        break;
      case "appointmentDate":
        if (!value) {
          fieldError = "Ngày khám là bắt buộc.";
        } else {
          const today = dayjs().format('YYYY-MM-DD');
          const selectedDate = dayjs(value).format('YYYY-MM-DD');
          
          if (selectedDate === today) {
            fieldError = "Không thể đặt lịch khám trong ngày hiện tại.";
          }
        }
        break;
      case "appointmentTime":
        if (!value) {
          fieldError = "Giờ khám là bắt buộc.";
        }
        break;
      default:
        break;
    }

    return fieldError;
  };

  // Hàm xử lý blur event để validate real-time
  const handleBlur = (fieldName, value) => {
    const fieldError = validateField(fieldName, value);
    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldError
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submissionData = {
        ...form,
        appointmentDate: dayjs(appointmentDate).format("YYYY-MM-DD"),
        appointmentTime: dayjs(appointmentTime).format("HH:mm:ss"),
      };

      await process(submissionData, {
        apiCallOverride: async (data) => {
          if (appointment) {
            return await appointmentProxyApi.updateAppointment(
              appointment.appointmentId,
              data
            );
          } else {
            return await appointmentProxyApi.createAppointment(data);
          }
        },
        handleResultOverride: () => {
          onClose();
          onSubmit();
        },
      });
    } catch (error) {
      console.error("Error submitting appointment:", error);
      // Xử lý lỗi trùng lịch từ backend
      if (error.message && error.message.includes("trùng với lịch hẹn khác của bác sĩ")) {
        setErrors(prev => ({
          ...prev,
          appointmentTime: error.message
        }));
        setAppointmentTime(null);
      } else if (error.response?.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Có lỗi xảy ra khi lưu lịch hẹn. Vui lòng thử lại!");
      }
    } finally {
      setIsSubmitting(false);
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

  // Xử lý xác nhận hủy form
  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    setForm(initialForm);
    setAppointmentDate(null);
    setAppointmentTime(null);
    setErrors({});
    setPatientExists(true);
    onClose();
  };

  return (
    <>
      <ConfirmModal
        isOpen={showCancelModal}
        title="Xác nhận thoát"
        message={appointment ? "Bạn có muốn thoát khỏi chức năng sửa lịch khám không?" : "Bạn có muốn thoát khỏi chức năng thêm lịch khám không?"}
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowCancelModal(false)}
      />

      {open && (
        <div className="appointment-modal-overlay">
          <div className="appointment-modal-content">
            <div className="appointment-modal-header">
              <h2>{appointment ? "SỬA LỊCH KHÁM" : "ĐẶT LỊCH KHÁM"}</h2>
              <button className="appointment-close-btn" onClick={handleCancel}>×</button>
            </div>

            {isLoadingForm ? (
              <div className="appointment-loading-message">Đang tải dữ liệu, vui lòng chờ...</div>
            ) : (
              <form className="appointment-form" onSubmit={handleSubmit} noValidate>
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
                      onBlur={(e) => handleBlur("serviceId", e.target.value)}
                      disabled={isLoadingServices}
                      className={errors.serviceId ? "appointment-input-error" : ""}
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
                      onBlur={(e) => handleBlur("specialtyId", e.target.value)}
                      className={errors.specialtyId ? "appointment-input-error" : ""}
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
                      onBlur={(e) => handleBlur("doctorId", e.target.value)}
                      className={errors.doctorId ? "appointment-input-error" : ""}
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
                      onBlur={(e) => handleBlur("patientId", e.target.value)}
                      className={errors.patientName ? "appointment-input-error" : ""}
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
                      onChange={handleDateChange}
                      onBlur={() => handleBlur("appointmentDate", appointmentDate)}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Chọn ngày"
                      className={`form-control ${errors.appointmentDate ? 'appointment-input-error' : ''}`}
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
                      onChange={handleTimeChange}
                      onBlur={() => handleBlur("appointmentTime", appointmentTime)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Giờ"
                      dateFormat="HH:mm"
                      placeholderText="Chọn giờ"
                      className={`form-control ${errors.appointmentTime ? 'appointment-input-error' : ''}`}
                    />
                    {errors.appointmentTime && (
                      <p className="appointment-error-message">
                        {errors.appointmentTime}
                      </p>
                    )}
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
                      onBlur={(e) => handleBlur("clinicId", e.target.value)}
                      disabled={isLoadingClinics}
                      className={errors.clinicId ? "appointment-input-error" : ""}
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
                  <button 
                    type="submit" 
                    className="appointment-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
                  </button>
                  <button 
                    type="button" 
                    className="appointment-cancel-btn" 
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
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