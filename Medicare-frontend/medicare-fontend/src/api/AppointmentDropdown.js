import axiosInstance from "./axiosInstance";

// api/doctorApi.js
//export const GetDoctorsAsync = () => axiosInstance.get("/coordinator/doctors");
//export const GetSpecialtiesAsync = () => axiosInstance.get("/coordinator/specialties");
//export const GetClinicsAsync = () => axiosInstance.get("/coordinator/clinics");

// api/serviceApi.js
//export const GetServicesAsync = () => axiosInstance.get("/coordinator/services");

// API cho Specialties
export const GetSpecialtiesAsync = () => axiosInstance.get("/coordinator/specialties");

// API cho Doctors
export const GetDoctorsAsync = () => axiosInstance.get("/coordinator/doctors");

// API cho Clinics
export const GetClinicsAsync = () => axiosInstance.get("/coordinator/clinics");

// API cho Services
export const GetServicesAsync = () => axiosInstance.get("/coordinator/services");

// API kiểm tra sự tồn tại của bệnh nhân
export const CheckPatientExistence = async (patientName) => {
  try {
    const response = await axiosInstance.get(
      `/api/patients/check/${patientName}`
    );
    return response.data; // true nếu bệnh nhân tồn tại, false nếu không
  } catch (error) {
    console.error("Error checking patient existence:", error);
    return false; // Trả về false nếu có lỗi xảy ra
  }
};

// API cho Patients
export const GetPatientsAsync = () => axiosInstance.get("/coordinator/patients");
