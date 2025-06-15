import axiosInstance from "./axiosInstance";

// api/doctorApi.js
//export const GetDoctorsAsync = () => axiosInstance.get("/coordinator/doctors");
//export const GetSpecialtiesAsync = () => axiosInstance.get("/coordinator/specialties");
//export const GetClinicsAsync = () => axiosInstance.get("/coordinator/clinics");

// api/serviceApi.js
//export const GetServicesAsync = () => axiosInstance.get("/coordinator/services");

// API cho Specialties
export const GetSpecialtiesAsync = () => axiosInstance.get("/api/coordinator/specialties");

// API cho Doctors
export const GetDoctorsAsync = () => axiosInstance.get("/api/coordinator/doctors");

// API cho Clinics
export const GetClinicsAsync = () => axiosInstance.get("/api/coordinator/clinics");

// API cho Services
export const GetServicesAsync = () => axiosInstance.get("/api/coordinator/services");
