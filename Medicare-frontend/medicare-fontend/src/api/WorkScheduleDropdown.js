// api/doctorApi.js
import axiosInstance from "./axiosInstance";
export const GetDoctorsAsync = () => axiosInstance.get("/coordinator/doctors");

// api/specialtyApi.js
export const GetSpecialtiesAsync = () => axiosInstance.get("/coordinator/specialties");

// api/clinicApi.js
export const GetClinicsAsync = () => axiosInstance.get("/coordinator/clinics");

// api/serviceApi.js
export const GetServicesAsync = () => axiosInstance.get("/coordinator/services");
