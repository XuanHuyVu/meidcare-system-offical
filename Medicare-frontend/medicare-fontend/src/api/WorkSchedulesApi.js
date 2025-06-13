import axiosInstance from './axiosInstance';

export const GetAllAsync = () => axiosInstance.get('/coordinator/workschedules');
export const GetByIdAsync = (id) => axiosInstance.get(`/coordinator/workschedules/${id}`);
export const CreateAsync = (data) => axiosInstance.post('/coordinator/workschedules', data);
export const UpdateAsync = (id, data) => axiosInstance.put(`/coordinator/workschedules/${id}`, data);
export const DeleteAsync = (id) => axiosInstance.delete(`/coordinator/workschedules/${id}`);
export const GetByDoctorIdAsync = (doctorId) => axiosInstance.get(`/coordinator/workschedules/doctors/${doctorId}`);
export const GetBySpecialtyIdAsync = (specialtyId) => axiosInstance.get(`/coordinator/workschedules/specialties/${specialtyId}`);
