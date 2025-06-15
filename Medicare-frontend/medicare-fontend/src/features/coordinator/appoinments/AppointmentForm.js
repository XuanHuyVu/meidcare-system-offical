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
} from "../../../api/AppointmentDropdown";

const AppointmentForm = ({ open, onClose, onSubmit, appointment }) => {
  const initialForm = {
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
  const [allDoctors, setAllDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingClinics, setIsLoadingClinics] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errors, setErrors] = useState({});

  // Hàm kiểm tra tính hợp lệ của form
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!form.patientName) {
      formErrors.patientName = "Tên bệnh nhân là bắt buộc.";
      isValid = false;
    }
    if (!form.appointmentDate) {
      formErrors.appointmentDate = "Ngày khám là bắt buộc.";
      isValid = false;
    }
    if (!form.appointmentTime) {
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

    setErrors(formErrors); // Lưu lỗi vào state
    return isValid;
  };

  // Load dữ liệu khi mở form
  useEffect(() => {
    if (!open) return;

    const fetchDropdowns = async () => {
      setIsLoadingForm(true);
      setIsLoadingClinics(true);
      try {
        const [specialtiesRes, servicesRes, doctorsRes, clinicsRes] =
          await Promise.all([
            GetSpecialtiesAsync(),
            GetServicesAsync(),
            GetDoctorsAsync(),
            GetClinicsAsync(),
          ]);
        setSpecialties(specialtiesRes.data || []);
        setServices(servicesRes.data || []);
        setAllDoctors(doctorsRes.data || []);
        setDoctors(doctorsRes.data || []);
        setClinics(clinicsRes.data || []);
      } catch (error) {
        setSpecialties([]);
        setServices([]);
        setAllDoctors([]);
        setDoctors([]);
        setClinics([]);
        alert("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại!");
      } finally {
        setIsLoadingForm(false);
        setIsLoadingClinics(false);
      }
    };

    fetchDropdowns();
  }, [open]);

  // Điền dữ liệu vào form khi sửa lịch
  useEffect(() => {
    if (
      appointment &&
      services.length &&
      specialties.length &&
      allDoctors.length &&
      clinics.length
    ) {
      const fullDate = new Date(appointment.appointmentDate);

      // Nếu backend trả về appointmentTime là "HH:mm:ss"
      if (appointment.appointmentTime) {
        const [h, m, s] = appointment.appointmentTime.split(":");
        fullDate.setHours(Number(h));
        fullDate.setMinutes(Number(m));
        fullDate.setSeconds(Number(s) || 0);
      }

      setAppointmentDate(new Date(appointment.appointmentDate));
      setAppointmentTime(new Date(fullDate));

      setForm({
        serviceId: String(appointment.serviceId) || "",
        specialtyId: String(appointment.specialtyId) || "",
        doctorId: String(appointment.doctorId) || "",
        patientName: appointment.patientName || "",
        clinicId: String(appointment.clinicId) || "",
      });
    } else if (!appointment) {
      setForm(initialForm);
      setAppointmentDate(null);
      setAppointmentTime(null);
      setDoctors([]);
    }
  }, [appointment, services, specialties, allDoctors, clinics]);

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
        doctorId: "", // Clear doctor selection when specialty changes
      }));
    } else if (name === "doctorId" || name === "clinicId") {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === "appointmentDate") {
      // Cập nhật giá trị ngày
      setAppointmentDate(value); // Cập nhật giá trị ngày
      setForm((prev) => ({
        ...prev,
        appointmentDate: value, // Cập nhật form với giá trị ngày
      }));
    } else if (name === "appointmentTime") {
      // Cập nhật giá trị giờ
      setAppointmentTime(value); // Cập nhật giá trị giờ
      setForm((prev) => ({
        ...prev,
        appointmentTime: value, // Cập nhật form với giá trị giờ
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Lấy tên từ danh sách dựa vào ID
      const selectedService = services.find(
        (s) => String(s.serviceId) === String(form.serviceId)
      );
      const selectedDoctor = doctors.find(
        (d) => String(d.doctorId) === String(form.doctorId)
      );
      const selectedClinic = clinics.find(
        (c) => String(c.clinicId) === String(form.clinicId)
      );
      const selectedSpecialty = specialties.find(
        (s) => String(s.specialtyId) === String(form.specialtyId)
      );

      const submissionData = {
        appointmentId: appointment?.appointmentId || 0,
        patientName: form.patientName,
        serviceId: form.serviceId,
        doctorId: form.doctorId,
        clinicId: form.clinicId,
        specialtyId: form.specialtyId,
        serviceName: selectedService?.serviceName || "",
        doctorName: selectedDoctor?.fullName || "",
        clinicName: selectedClinic?.clinicName || "",
        specialtyName: selectedSpecialty?.specialtyName || "",
        appointmentDate: form.appointmentDate
          ? new Date(form.appointmentDate).toISOString().split("T")[0]
          : "",
        appointmentTime: form.appointmentTime
          ? form.appointmentTime.toISOString().split("T")[1].split(".")[0]
          : "",
      };

      console.log("Dữ liệu gửi đi:", submissionData);
      onSubmit(submissionData);
      onClose();

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2000);
    } else {
      console.log("Form validate lỗi:", errors, form);
    }
  };

  // Xử lý hủy form
  const handleCancel = () => {
    const hasData =
      Object.values(form).some(
        (value) => value && value.toString().trim() !== ""
      ) ||
      appointmentDate ||
      appointmentTime;
    if (hasData) {
      setShowCancelModal(true);
    } else {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <>
      {showCancelModal ? (
        <ConfirmModal
          open={showCancelModal}
          title="XÁC NHẬN THOÁT"
          message={
            appointment
              ? "Bạn có muốn thoát khỏi chức năng đổi lịch khám không?"
              : "Bạn có muốn thoát khỏi chức năng thêm lịch khám không?"
          }
          onConfirm={onClose}
          onCancel={() => setShowCancelModal(false)}
        />
      ) : (
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
                  </div>

                  {/* Tên bệnh nhân */}
                  <div className="form-group">
                    <label>
                      Tên bệnh nhân <span className="required">*</span>
                    </label>
                    <input
                      name="patientName"
                      value={form.patientName}
                      onChange={handleChange}
                      required
                    />
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
                        setForm((prev) => ({
                          ...prev,
                          appointmentDate: date, // Cập nhật giá trị cho form
                        }));
                      }}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Chọn ngày"
                      className="form-control"
                      required
                    />
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
                        setForm((prev) => ({
                          ...prev,
                          appointmentTime: time, // Cập nhật giá trị giờ cho form
                        }));
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
