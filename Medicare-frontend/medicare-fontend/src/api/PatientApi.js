import axiosInstance from './axiosInstance';

// Lấy tất cả bệnh nhân
export const getAllPatients = () => axiosInstance.get('/coordinator/patients');

// Lấy bệnh nhân theo ID
export const getPatientById = (id) => axiosInstance.get(`/coordinator/patients/${id}`);

// Tạo mới bệnh nhân
export const createPatient = (data) => axiosInstance.post('/coordinator/patients', data);

// Cập nhật bệnh nhân
export const updatePatient = (id, data) => axiosInstance.put(`/coordinator/patients/${id}`, data);

// Xóa bệnh nhân
export const deletePatient = (id) => axiosInstance.delete(`/coordinator/patients/${id}`);
