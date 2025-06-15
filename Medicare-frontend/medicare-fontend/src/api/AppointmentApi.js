import axiosInstance from "./axiosInstance";

export const getAppointments = () =>
  axiosInstance.get("/api/coordinator/appointments");
export const getAppointmentById = (id) =>
  axiosInstance.get(`/api/coordinator/appointments/${id}`);
export const createAppointment = (data) =>
  axiosInstance.post("/api/coordinator/appointments", data);
export const updateAppointment = (id, data) =>
  axiosInstance.put(`/api/coordinator/appointments/${id}`, data);
export const deleteAppointment = (id) => 
  axiosInstance.delete(`/api/coordinator/appointments/${id}`);

