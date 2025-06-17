import axiosInstance from './axiosInstance';

// Lấy danh sách tất cả bác sĩ
export const getAllDoctors = () => axiosInstance.get('/coordinator/doctors');

// Lấy chi tiết bác sĩ theo id
export const getDoctorById = (id) => axiosInstance.get(`/coordinator/doctors/${id}`);

// Tạo mới bác sĩ (data có thể là FormData hoặc object)
export const createDoctor = (data) => {
  return axiosInstance.post('/coordinator/doctors', data);
};

// Cập nhật thông tin bác sĩ (data có thể là FormData hoặc object)
export const updateDoctor = (id, data) => {
  // Không set Content-Type thủ công nếu data là FormData
  return axiosInstance.put(`/coordinator/doctors/${id}`, data);
};

// Xóa bác sĩ theo id
export const deleteDoctor = (id) => axiosInstance.delete(`/coordinator/doctors/${id}`);