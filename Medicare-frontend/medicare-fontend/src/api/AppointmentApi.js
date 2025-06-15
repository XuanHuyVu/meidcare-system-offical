import axiosInstance from "./axiosInstance";

export const getAppointments = () =>
  axiosInstance.get("/coordinator/appointments");
export const getAppointmentById = (id) =>
  axiosInstance.get(`/coordinator/appointments/${id}`);
export const CreateAsync = (data) =>
  axiosInstance.post("/coordinator/appointments", data);
export const updateAppointment = (id, data) =>
  axiosInstance.put(`/coordinator/appointments/${id}`, data);
export const deleteAppointment = (id) =>
  axiosInstance.delete(`/coordinator/appointments/${id}`);
