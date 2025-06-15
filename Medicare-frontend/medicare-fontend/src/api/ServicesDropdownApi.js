import axiosInstance from "./axiosInstance";

// Doctor related APIs
export const GetDoctorsAsync = () => axiosInstance.get("/coordinator/Doctors");

// Specialty related APIs
export const GetSpecialtiesAsync = () => axiosInstance.get("/coordinator/Specialties");

// Clinic related APIs
export const GetClinicsAsync = () => axiosInstance.get("/coordinator/Clinics");

// Service related APIs
export const GetServicesAsync = () => axiosInstance.get("/coordinator/Services");

